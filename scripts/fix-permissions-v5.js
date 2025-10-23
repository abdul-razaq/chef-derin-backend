const { createStrapi } = require('@strapi/strapi');

async function fixPermissions() {
  let strapi;
  
  try {
    console.log('🔧 Starting Strapi v5 permissions fix...\n');
    
    // Create Strapi instance
    strapi = await createStrapi().load();
    
    // Get the public role
    const publicRole = await strapi.entityService.findMany('plugin::users-permissions.role', {
      filters: { type: 'public' },
      populate: ['permissions']
    });
    
    if (!publicRole || publicRole.length === 0) {
      console.log('❌ Public role not found');
      return;
    }
    
    const publicRoleData = publicRole[0];
    console.log(`📋 Found public role: ${publicRoleData.name} (ID: ${publicRoleData.id})`);
    
    // Content types to enable
    const contentTypes = [
      'api::private-dining.private-dining',
      'api::booking.booking', 
      'api::gallery.gallery',
      'api::payment-option.payment-option'
    ];
    
    // Actions to enable for each content type
    const actions = ['find', 'findOne'];
    
    console.log('\n🔑 Setting up permissions...');
    
    for (const contentType of contentTypes) {
      console.log(`\n📦 Processing ${contentType}:`);
      
      for (const action of actions) {
        const permissionAction = `${contentType}.${action}`;
        
        try {
          // Check if permission already exists
          const existingPermission = await strapi.entityService.findMany('plugin::users-permissions.permission', {
            filters: {
              action: permissionAction,
              role: publicRoleData.id
            }
          });
          
          if (existingPermission && existingPermission.length > 0) {
            // Update existing permission
            await strapi.entityService.update('plugin::users-permissions.permission', existingPermission[0].id, {
              data: { enabled: true }
            });
            console.log(`  ✅ Updated ${action} permission`);
          } else {
            // Create new permission
            await strapi.entityService.create('plugin::users-permissions.permission', {
              data: {
                action: permissionAction,
                enabled: true,
                policy: '',
                role: publicRoleData.id
              }
            });
            console.log(`  ✅ Created ${action} permission`);
          }
        } catch (error) {
          console.log(`  ❌ Failed to set ${action} permission: ${error.message}`);
        }
      }
    }
    
    console.log('\n🎉 Permissions configuration completed!');
    console.log('\n🧪 Test your API endpoints:');
    console.log('  - GET http://localhost:1337/api/private-dinings');
    console.log('  - GET http://localhost:1337/api/bookings');
    console.log('  - GET http://localhost:1337/api/galleries');
    console.log('  - GET http://localhost:1337/api/payment-options');
    
  } catch (error) {
    console.error('❌ Error fixing permissions:', error.message);
    console.error(error.stack);
  } finally {
    if (strapi) {
      await strapi.destroy();
    }
  }
}

// Run the script
fixPermissions();