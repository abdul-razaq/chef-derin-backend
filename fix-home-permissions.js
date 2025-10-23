const { createStrapi } = require('@strapi/strapi');

async function enableHomePermissions() {
  try {
    console.log('🔧 Starting Strapi to configure permissions...');
    
    const app = await createStrapi().load();
    
    console.log('📋 Checking current permissions...');
    
    // Get the public role
    const publicRole = await strapi.query('plugin::users-permissions.role').findOne({
      where: { type: 'public' }
    });
    
    if (!publicRole) {
      console.error('❌ Public role not found');
      return;
    }
    
    console.log('✅ Found public role:', publicRole.id);
    
    // Check if home permission already exists
    const existingPermission = await strapi.query('plugin::users-permissions.permission').findOne({
      where: {
        role: publicRole.id,
        action: 'api::home.home.find'
      }
    });
    
    if (existingPermission) {
      console.log('✅ Home find permission already exists');
    } else {
      // Create the permission
      console.log('🔧 Creating home find permission...');
      await strapi.query('plugin::users-permissions.permission').create({
        data: {
          action: 'api::home.home.find',
          subject: null,
          properties: {},
          conditions: [],
          role: publicRole.id
        }
      });
      console.log('✅ Home find permission created');
    }
    
    // Also check for findOne permission
    const existingFindOnePermission = await strapi.query('plugin::users-permissions.permission').findOne({
      where: {
        role: publicRole.id,
        action: 'api::home.home.findOne'
      }
    });
    
    if (existingFindOnePermission) {
      console.log('✅ Home findOne permission already exists');
    } else {
      // Create the findOne permission
      console.log('🔧 Creating home findOne permission...');
      await strapi.query('plugin::users-permissions.permission').create({
        data: {
          action: 'api::home.home.findOne',
          subject: null,
          properties: {},
          conditions: [],
          role: publicRole.id
        }
      });
      console.log('✅ Home findOne permission created');
    }
    
    console.log('🎉 Permissions configured successfully!');
    console.log('🔄 Please restart Strapi for changes to take effect');
    
  } catch (error) {
    console.error('❌ Error configuring permissions:', error.message);
  } finally {
    process.exit(0);
  }
}

enableHomePermissions();