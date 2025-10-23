const { createStrapi } = require('@strapi/strapi');

async function checkPermissions() {
  try {
    const app = await createStrapi().load();
    
    console.log('🔍 Checking API permissions...\n');
    
    // Get the users-permissions plugin
    const usersPermissionsPlugin = app.plugin('users-permissions');
    
    if (!usersPermissionsPlugin) {
      console.log('❌ Users & Permissions plugin not found');
      return;
    }
    
    // Get all roles
    const roles = await app.entityService.findMany('plugin::users-permissions.role', {
      populate: ['permissions']
    });
    
    console.log('📋 Available roles:');
    for (const role of roles) {
      console.log(`  - ${role.name} (${role.type})`);
      
      if (role.permissions) {
        const apiPermissions = role.permissions.filter(p => 
          p.action.startsWith('api::') && 
          (p.action.includes('private-dining') || p.action.includes('booking'))
        );
        
        if (apiPermissions.length > 0) {
          console.log(`    API Permissions:`);
          apiPermissions.forEach(p => {
            console.log(`      ✓ ${p.action} - enabled: ${p.enabled}`);
          });
        } else {
          console.log(`    ❌ No API permissions found for private-dining or booking`);
        }
      }
      console.log('');
    }
    
    // Check content types
    console.log('📦 Available content types:');
    const contentTypes = Object.keys(app.contentTypes);
    contentTypes.forEach(ct => {
      if (ct.startsWith('api::')) {
        console.log(`  - ${ct}`);
      }
    });
    
    console.log('\n🔗 Expected API endpoints:');
    console.log('  - GET /api/private-dinings');
    console.log('  - GET /api/bookings');
    console.log('  - GET /api/galleries');
    
    await app.destroy();
    
  } catch (error) {
    console.error('❌ Error checking permissions:', error.message);
    process.exit(1);
  }
}

checkPermissions();