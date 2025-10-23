#!/usr/bin/env node

const sqlite3 = require('sqlite3').verbose();
const { v4: uuidv4 } = require('uuid');
const path = require('path');

async function enableAPIs() {
  console.log('🔧 Enabling API permissions directly in database...');
  
  const dbPath = path.join(__dirname, '../.tmp/data.db');
  const db = new sqlite3.Database(dbPath);
  
  try {
    // Get the public role
    const publicRole = await new Promise((resolve, reject) => {
      db.get("SELECT * FROM up_roles WHERE type = 'public'", (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
    
    if (!publicRole) {
      console.log('❌ Public role not found');
      return;
    }
    
    console.log(`✅ Found public role with ID: ${publicRole.id}`);
    
    // Define all permissions we need
    const permissions = [
      // Private Dining
      'api::private-dining.private-dining.find',
      'api::private-dining.private-dining.findOne',
      
      // Booking
      'api::booking.booking.create',
      'api::booking.booking.findOne',
      
      // Gallery
      'api::gallery.gallery.find',
      'api::gallery.gallery.findOne',
      
      // Payment Options
      'api::payment-option.payment-option.find',
      'api::payment-option.payment-option.findOne'
    ];
    
    // Clear existing API permissions
    await new Promise((resolve, reject) => {
      db.run(`DELETE FROM up_permissions WHERE action LIKE 'api::%'`, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
    
    // Insert new permissions
    for (const action of permissions) {
      const documentId = uuidv4().replace(/-/g, '').substring(0, 24);
      const now = Date.now();
      
      const permissionId = await new Promise((resolve, reject) => {
        db.run(
          `INSERT INTO up_permissions (document_id, action, created_at, updated_at, published_at) 
           VALUES (?, ?, ?, ?, ?)`,
          [documentId, action, now, now, now],
          function(err) {
            if (err) reject(err);
            else resolve(this.lastID);
          }
        );
      });
      
      // Link permission to public role
      await new Promise((resolve, reject) => {
        db.run(
          `INSERT INTO up_permissions_role_lnk (permission_id, role_id, permission_ord) 
           VALUES (?, ?, ?)`,
          [permissionId, publicRole.id, 1],
          (err) => {
            if (err) reject(err);
            else resolve();
          }
        );
      });
      
      console.log(`✅ ${action}: Enabled`);
    }
    
    console.log('\n🎉 All permissions configured!');
    console.log('🔄 Please restart Strapi to apply changes...');
    
  } catch (error) {
    console.error('❌ Error configuring permissions:', error);
  } finally {
    db.close();
  }
}

enableAPIs();