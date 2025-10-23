const strapi = require('@strapi/strapi');

async function configureHomePermissions() {
  try {
    console.log('🔧 Configuring Home API permissions...');
    
    // Find the public role
    const publicRole = await strapi.query('plugin::users-permissions.role').findOne({
      where: { type: 'public' }
    });

    if (!publicRole) {
      console.error('❌ Public role not found');
      return;
    }

    console.log('✅ Found public role:', publicRole.id);

    // Configure permissions for Home API
    const homePermissions = [
      {
        action: 'api::home.home.find',
        subject: null,
        properties: {},
        conditions: []
      }
    ];

    // Update permissions
    for (const permission of homePermissions) {
      try {
        const existingPermission = await strapi.query('plugin::users-permissions.permission').findOne({
          where: {
            action: permission.action,
            role: publicRole.id
          }
        });

        if (existingPermission) {
          await strapi.query('plugin::users-permissions.permission').update({
            where: { id: existingPermission.id },
            data: {
              enabled: true,
              ...permission,
              role: publicRole.id
            }
          });
          console.log(`✅ Updated permission: ${permission.action}`);
        } else {
          await strapi.query('plugin::users-permissions.permission').create({
            data: {
              enabled: true,
              ...permission,
              role: publicRole.id
            }
          });
          console.log(`✅ Created permission: ${permission.action}`);
        }
      } catch (error) {
        console.error(`❌ Error configuring permission ${permission.action}:`, error.message);
      }
    }

    console.log('🎉 Home API permissions configured successfully!');
  } catch (error) {
    console.error('❌ Error configuring Home API permissions:', error);
  }
}

module.exports = configureHomePermissions;

// Run if called directly
if (require.main === module) {
  const strapiInstance = strapi();
  strapiInstance.load().then(() => {
    configureHomePermissions().then(() => {
      process.exit(0);
    }).catch((error) => {
      console.error(error);
      process.exit(1);
    });
  });
}