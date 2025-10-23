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

// Define the waitlist permissions to add
const waitlistPermissions = [
  'api::waiting-list.waiting-list.create'
];

console.log('Adding waitlist permissions and linking to Public role...');

// Use synchronous approach
const db = new sqlite3.Database(dbPath);

// Get the current max IDs
const maxPermissionStmt = db.prepare("SELECT MAX(id) as maxId FROM up_permissions");
const maxPermissionResult = maxPermissionStmt.get();
maxPermissionStmt.finalize();

const maxLinkStmt = db.prepare("SELECT MAX(id) as maxLinkId FROM up_permissions_role_lnk");
const maxLinkResult = maxLinkStmt.get();
maxLinkStmt.finalize();

let nextPermissionId = (maxPermissionResult?.maxId || 0) + 1;
let nextLinkId = (maxLinkResult?.maxLinkId || 0) + 1;

// Get the Public role ID
const publicRoleStmt = db.prepare("SELECT id FROM up_roles WHERE type = 'public'");
const publicRoleResult = publicRoleStmt.get();
publicRoleStmt.finalize();

if (!publicRoleResult) {
  console.error('❌ Public role not found!');
  db.close();
  process.exit(1);
}

console.log('Public role result:', publicRoleResult);
const publicRoleId = publicRoleResult.id;
console.log(`📋 Found Public role with ID: ${publicRoleId}`);

if (!publicRoleId) {
  console.error('❌ Public role ID is undefined!');
  db.close();
  process.exit(1);
}

// Prepare statements
const insertPermission = db.prepare(`
  INSERT INTO up_permissions (id, document_id, action, created_at, updated_at, published_at, created_by_id, updated_by_id, locale)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const insertLink = db.prepare(`
  INSERT INTO up_permissions_role_lnk (id, permission_id, role_id, permission_ord)
  VALUES (?, ?, ?, ?)
`);

// First, check if permissions already exist and delete them
console.log('🧹 Cleaning up existing waitlist permissions...');

// Delete existing links first
db.prepare(`
  DELETE FROM up_permissions_role_lnk WHERE permission_id IN (
    SELECT id FROM up_permissions WHERE action LIKE 'api::waiting-list%'
  )
`).run();

// Then delete the permissions
db.prepare(`
  DELETE FROM up_permissions WHERE action LIKE 'api::waiting-list%'
`).run();

// Get fresh max IDs after cleanup
const newMaxPermissionResult = db.prepare("SELECT MAX(id) as maxId FROM up_permissions").get();
const newMaxLinkResult = db.prepare("SELECT MAX(id) as maxLinkId FROM up_permissions_role_lnk").get();

nextPermissionId = (newMaxPermissionResult?.maxId || 0) + 1;
nextLinkId = (newMaxLinkResult?.maxLinkId || 0) + 1;

// Add new permissions
waitlistPermissions.forEach((action, index) => {
  const permissionId = nextPermissionId + index;
  const documentId = generateId();
  
  console.log(`➕ Adding permission: ${action}`);
  
  // Insert permission
  insertPermission.run(
    permissionId,
    documentId,
    action,
    now,
    now,
    now,
    null,
    null,
    null
  );
  
  // Link permission to Public role
  const linkId = nextLinkId + index;
  insertLink.run(linkId, permissionId, publicRoleId, index + 1);
  
  console.log(`✅ Permission ${action} added and linked to Public role`);
});

// Finalize statements
insertPermission.finalize();
insertLink.finalize();

// Close database
db.close();

console.log('\n✅ Waitlist permissions configured successfully!');
console.log('🔄 Please restart Strapi to apply the changes.');