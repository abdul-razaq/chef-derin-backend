#!/usr/bin/env node

/**
 * Fix API Permissions using Strapi's programmatic API
 * This script uses Strapi's built-in methods to configure permissions
 */

const strapi = require('@strapi/strapi');

async function fixPermissions() {
  console.log('🔧 Fixing API permissions using Strapi API...\n');

  try {
    // Initialize Strapi
    const app = await strapi().load();

    // Get the users-permissions plugin
    const usersPermissionsPlugin = app.plugin('users-permissions');
    
    if (!usersPermissionsPlugin) {
      console.error('❌ Users-permissions plugin not found!');
      return;
    }

    // Get the Public role
    const publicRole = await strapi.query('plugin::users-permissions.role').findOne({
      where: { type: 'public' }
    });

    if (!publicRole) {
      console.error('❌ Public role not found!');
      return;
    }

    console.log(`📋 Found Public role: ${publicRole.name} (ID: ${publicRole.id})`);

    // Define the permissions to enable
    const permissionsToEnable = [
      { controller: 'booking', action: 'find' },
      { controller: 'booking', action: 'findOne' },
      { controller: 'booking', action: 'create' },
      { controller: 'private-dining', action: 'find' },
      { controller: 'private-dining', action: 'findOne' },
      { controller: 'gallery', action: 'find' },
      { controller: 'gallery', action: 'findOne' },
      { controller: 'payment-option', action: 'find' },
      { controller: 'payment-option', action: 'findOne' }
    ];

    // Get current permissions for the public role
    const currentPermissions = await strapi.query('plugin::users-permissions.permission').findMany({
      where: { role: publicRole.id }
    });

    console.log(`📋 Current permissions count: ${currentPermissions.length}\n`);

    // Enable each permission
    for (const perm of permissionsToEnable) {
      try {
        // Check if permission already exists
        const existingPermission = await strapi.query('plugin::users-permissions.permission').findOne({
          where: {
            role: publicRole.id,
            action: `api::${perm.controller}.${perm.controller}.${perm.action}`
          }
        });

        if (existingPermission) {
          // Update existing permission to enabled
          await strapi.query('plugin::users-permissions.permission').update({
            where: { id: existingPermission.id },
            data: { enabled: true }
          });
          console.log(`✅ Updated permission: ${perm.controller}.${perm.action}`);
        } else {
          // Create new permission
          await strapi.query('plugin::users-permissions.permission').create({
            data: {
              action: `api::${perm.controller}.${perm.controller}.${perm.action}`,
              role: publicRole.id,
              enabled: true
            }
          });
          console.log(`✅ Created permission: ${perm.controller}.${perm.action}`);
        }
      } catch (error) {
        console.log(`⚠️  Error with ${perm.controller}.${perm.action}: ${error.message}`);
      }
    }

    console.log('\n🎉 Permissions configuration completed!');
    console.log('🔄 Restarting Strapi to apply changes...');

    // Restart Strapi
    await app.destroy();
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

fixPermissions();