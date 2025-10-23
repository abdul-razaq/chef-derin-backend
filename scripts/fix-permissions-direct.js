#!/usr/bin/env node

/**
 * Direct Database Permissions Fix for Strapi v5
 * This script directly inserts the required permissions into the SQLite database
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

async function fixPermissions() {
  console.log('🔧 Fixing API permissions directly in database...\n');

  const dbPath = path.join(__dirname, '..', '.tmp', 'data.db');
  const db = new sqlite3.Database(dbPath);

  try {
    // Get current timestamp
    const now = Date.now();

    // Define permissions to add
    const permissions = [
      {
        action: 'api::booking.booking.find',
        document_id: `booking_find_${now}`
      },
      {
        action: 'api::booking.booking.create',
        document_id: `booking_create_${now}`
      },
      {
        action: 'api::booking.booking.findOne', 
        document_id: `booking_findone_${now}`
      },
      {
        action: 'api::private-dining.private-dining.find',
        document_id: `private_dining_find_${now}`
      },
      {
        action: 'api::private-dining.private-dining.findOne',
        document_id: `private_dining_findone_${now}`
      },
      {
        action: 'api::gallery.gallery.find',
        document_id: `gallery_find_${now}`
      },
      {
        action: 'api::gallery.gallery.findOne',
        document_id: `gallery_findone_${now}`
      },
      {
        action: 'api::payment-option.payment-option.find',
        document_id: `payment_option_find_${now}`
      },
      {
        action: 'api::payment-option.payment-option.findOne',
        document_id: `payment_option_findone_${now}`
      }
    ];

    // Insert permissions
    for (const permission of permissions) {
      await new Promise((resolve, reject) => {
        const query = `
          INSERT INTO up_permissions (document_id, action, created_at, updated_at, published_at)
          VALUES (?, ?, ?, ?, ?)
        `;
        
        db.run(query, [
          permission.document_id,
          permission.action,
          now,
          now,
          now
        ], function(err) {
          if (err) {
            console.log(`⚠️  Permission ${permission.action} might already exist`);
          } else {
            console.log(`✅ Added permission: ${permission.action}`);
          }
          resolve();
        });
      });
    }

    console.log('\n🎉 Permissions configuration completed!');
    console.log('🔄 Please restart Strapi to apply changes');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    db.close();
  }
}

fixPermissions();