const strapi = require('@strapi/strapi');

async function configureNewsletterPermissions() {
  try {
    console.log('Starting Strapi...');
    const app = await strapi().load();
    
    console.log('Configuring newsletter permissions...');
    
    // Find the public role
    const publicRole = await strapi.query('plugin::users-permissions.role').findOne({
      where: { type: 'public' }
    });
    
    if (!publicRole) {
      console.error('Public role not found');
      return;
    }
    
    console.log('Found public role:', publicRole.id);
    
    // Configure permissions for newsletter API
    const permissions = [
      {
        action: 'api::newsletter.newsletter.subscribe',
        subject: null,
        properties: {},
        conditions: []
      },
      {
        action: 'api::newsletter.newsletter.unsubscribe', 
        subject: null,
        properties: {},
        conditions: []
      }
    ];
    
    for (const permission of permissions) {
      try {
        // Check if permission already exists
        const existingPermission = await strapi.query('plugin::users-permissions.permission').findOne({
          where: {
            action: permission.action,
            role: publicRole.id
          }
        });
        
        if (existingPermission) {
          // Update existing permission
          await strapi.query('plugin::users-permissions.permission').update({
            where: { id: existingPermission.id },
            data: {
              enabled: true,
              ...permission,
              role: publicRole.id
            }
          });
          console.log(`Updated permission: ${permission.action}`);
        } else {
          // Create new permission
          await strapi.query('plugin::users-permissions.permission').create({
            data: {
              enabled: true,
              ...permission,
              role: publicRole.id
            }
          });
          console.log(`Created permission: ${permission.action}`);
        }
      } catch (error) {
        console.error(`Error configuring permission ${permission.action}:`, error.message);
      }
    }
    
    console.log('Newsletter permissions configured successfully!');
    
  } catch (error) {
    console.error('Error configuring newsletter permissions:', error);
  } finally {
    process.exit(0);
  }
}

configureNewsletterPermissions();
