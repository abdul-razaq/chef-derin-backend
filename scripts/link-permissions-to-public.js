#!/usr/bin/env node

/**
 * Link Permissions to Public Role for Strapi v5
 * This script links the existing permissions to the Public role
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

async function linkPermissionsToPublic() {
  console.log('🔗 Linking API permissions to Public role...\n');

  const dbPath = path.join(__dirname, '..', '.tmp', 'data.db');
  const db = new sqlite3.Database(dbPath);

  try {
    // Get the Public role ID
    const publicRole = await new Promise((resolve, reject) => {
      db.get('SELECT id FROM up_roles WHERE type = ?', ['public'], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (!publicRole) {
      console.error('❌ Public role not found!');
      return;
    }

    console.log(`📋 Found Public role with ID: ${publicRole.id}`);

    // Get all permissions that need to be linked
    const permissions = await new Promise((resolve, reject) => {
      db.all(`
        SELECT id, action FROM up_permissions 
        WHERE action LIKE 'api::%'
      `, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });

    console.log(`📋 Found ${permissions.length} API permissions to link\n`);

    // Link each permission to the Public role
    for (const permission of permissions) {
      try {
        await new Promise((resolve, reject) => {
          const query = `
            INSERT OR IGNORE INTO up_permissions_role_lnk (permission_id, role_id)
            VALUES (?, ?)
          `;
          
          db.run(query, [permission.id, publicRole.id], function(err) {
            if (err) {
              console.log(`⚠️  Permission ${permission.action} might already be linked`);
            } else {
              console.log(`✅ Linked permission: ${permission.action}`);
            }
            resolve();
          });
        });
      } catch (error) {
        console.log(`⚠️  Error linking ${permission.action}: ${error.message}`);
      }
    }

    console.log('\n🎉 Permissions linking completed!');
    console.log('🔄 Please restart Strapi to apply changes');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    db.close();
  }
}

linkPermissionsToPublic();