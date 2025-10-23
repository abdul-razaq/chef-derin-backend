const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '..', '.tmp', 'data.db');

// Function to generate a random ID similar to Strapi's format
function generateId() {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 25; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Get current timestamp
const now = Date.now();

// Define the newsletter permissions to add
const permissions = [
  'api::newsletter.newsletter.subscribe',
  'api::newsletter.newsletter.unsubscribe'
];

console.log('🔧 Adding newsletter permissions and linking to Public role...');

// Open database
const db = new sqlite3.Database(dbPath);

// Get the next available IDs
const maxPermissionResult = db.prepare("SELECT MAX(id) as maxId FROM up_permissions").get();
const maxLinkResult = db.prepare("SELECT MAX(id) as maxLinkId FROM up_permissions_role_lnk").get();

let nextPermissionId = (maxPermissionResult.maxId || 0) + 1;
let nextLinkId = (maxLinkResult.maxLinkId || 0) + 1;

// Prepare statements
const insertPermission = db.prepare(`
  INSERT INTO up_permissions (id, document_id, action, created_at, updated_at, published_at, created_by_id, updated_by_id, locale)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const insertLink = db.prepare(`
  INSERT INTO up_permissions_role_lnk (id, permission_id, role_id, permission_ord)
  VALUES (?, ?, ?, ?)
`);

// Get the Public role ID (usually 1)
const publicRoleResult = db.prepare("SELECT id FROM up_roles WHERE type = 'public'").get();
const publicRoleId = publicRoleResult ? publicRoleResult.id : 1;

console.log(`✅ Found public role ID: ${publicRoleId}`);

// Add each permission
permissions.forEach((action, index) => {
  const documentId = generateId();
  
  // Check if permission already exists
  const existingPermission = db.prepare("SELECT id FROM up_permissions WHERE action = ?").get(action);
  
  if (existingPermission) {
    console.log(`⚠️  Permission ${action} already exists, skipping...`);
    return;
  }
  
  // Insert permission
  insertPermission.run(
    nextPermissionId,
    documentId,
    action,
    now,
    now,
    now,
    null,
    null,
    null
  );
  
  // Link permission to public role
  insertLink.run(
    nextLinkId,
    nextPermissionId,
    publicRoleId,
    index + 1
  );
  
  console.log(`✅ Added permission: ${action} (ID: ${nextPermissionId})`);
  
  nextPermissionId++;
  nextLinkId++;
});

// Finalize statements
insertPermission.finalize();
insertLink.finalize();

// Close database
db.close();

console.log('\n🎉 Newsletter permissions processing completed!');
console.log('🔄 Please restart Strapi to apply the changes.');