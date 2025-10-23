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

// Define the permissions to add
const permissions = [
  // Booking permissions
  'api::booking.booking.find',
  'api::booking.booking.findOne',
  'api::booking.booking.create',
  
  // Private dining permissions
  'api::private-dining.private-dining.find',
  'api::private-dining.private-dining.findOne',
  'api::private-dining.private-dining.create',
  
  // Gallery permissions
  'api::gallery.gallery.find',
  'api::gallery.gallery.findOne',
  
  // Payment option permissions
  'api::payment-option.payment-option.find',
  'api::payment-option.payment-option.findOne'
];

console.log('Adding permissions and linking to Public role...');

// Use synchronous approach
const db = new sqlite3.Database(dbPath);

// Get the current max IDs
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

// Insert each permission
permissions.forEach((action, index) => {
  const permissionId = nextPermissionId + index;
  const linkId = nextLinkId + index;
  
  try {
    // Insert permission
    insertPermission.run([
      permissionId,
      generateId(),
      action,
      now,
      now,
      now,
      null,
      null,
      null
    ]);
    
    // Link permission to Public role (ID: 2)
    insertLink.run([
      linkId,
      permissionId,
      2, // Public role ID
      (index + 1) * 1.0
    ]);
    
    console.log(`✓ Added and linked permission: ${action}`);
  } catch (err) {
    console.error(`✗ Error with permission ${action}:`, err.message);
  }
});

// Finalize statements
insertPermission.finalize();
insertLink.finalize();

// Close database
db.close();

console.log('\n✅ All permissions processing completed!');
console.log('🔄 Please restart Strapi to apply the changes.');