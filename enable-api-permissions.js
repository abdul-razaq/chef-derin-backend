const { createStrapi } = require('@strapi/strapi');

async function enableApiPermissions() {
  try {
    console.log('🚀 Starting Strapi to enable API permissions...');
    
    // Initialize Strapi
    const app = await createStrapi().load();
    
    console.log('✅ Strapi loaded successfully');
    
    // Get the public role
    const publicRole = await strapi.query('plugin::users-permissions.role').findOne({
      where: { type: 'public' }
    });
    
    if (!publicRole) {
      throw new Error('Public role not found');
    }
    
    console.log('✅ Found public role:', publicRole.id);
    
    // Define permissions to enable
    const permissionsToEnable = [
      {
        action: 'api::booking.booking.find',
        subject: null,
        properties: {},
        conditions: []
      },
      {
        action: 'api::booking.booking.findOne',
        subject: null,
        properties: {},
        conditions: []
      },
      {
        action: 'api::booking.booking.create',
        subject: null,
        properties: {},
        conditions: []
      },
      {
        action: 'api::private-dining.private-dining.find',
        subject: null,
        properties: {},
        conditions: []
      },
      {
        action: 'api::private-dining.private-dining.findOne',
        subject: null,
        properties: {},
        conditions: []
      },
      {
        action: 'api::gallery.gallery.find',
        subject: null,
        properties: {},
        conditions: []
      },
      {
        action: 'api::gallery.gallery.findOne',
        subject: null,
        properties: {},
        conditions: []
      },
      {
        action: 'api::payment-option.payment-option.find',
        subject: null,
        properties: {},
        conditions: []
      },
      {
        action: 'api::payment-option.payment-option.findOne',
        subject: null,
        properties: {},
        conditions: []
      }
    ];
    
    // Create or update permissions
    for (const permissionData of permissionsToEnable) {
      try {
        // Check if permission already exists
        const existingPermission = await strapi.query('plugin::users-permissions.permission').findOne({
          where: {
            action: permissionData.action,
            role: publicRole.id
          }
        });
        
        if (existingPermission) {
          console.log(`✅ Permission already exists: ${permissionData.action}`);
        } else {
          // Create new permission
          await strapi.query('plugin::users-permissions.permission').create({
            data: {
              ...permissionData,
              role: publicRole.id
            }
          });
          console.log(`✅ Created permission: ${permissionData.action}`);
        }
      } catch (error) {
        console.error(`❌ Error with permission ${permissionData.action}:`, error.message);
      }
    }
    
    console.log('🎉 API permissions enabled successfully!');
    console.log('🔄 Please restart Strapi to apply changes');
    
  } catch (error) {
    console.error('❌ Error enabling API permissions:', error.message);
  } finally {
    process.exit(0);
  }
}

enableApiPermissions();