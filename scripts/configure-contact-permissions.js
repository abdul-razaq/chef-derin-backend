module.exports = async ({ strapi }) => {
  try {
    console.log('🔧 Configuring contact API permissions...');

    // Find the public role
    const publicRole = await strapi.query('plugin::users-permissions.role').findOne({
      where: { type: 'public' }
    });

    if (!publicRole) {
      console.error('❌ Public role not found');
      return;
    }

    console.log('✅ Found public role:', publicRole.id);

    // Check if contact permissions already exist
    const existingPermission = await strapi.query('plugin::users-permissions.permission').findOne({
      where: {
        action: 'api::contact.contact.create',
        role: publicRole.id
      }
    });

    if (existingPermission) {
      console.log('✅ Contact create permission already exists');
      return;
    }

    // Create permission for contact create
    const permission = await strapi.query('plugin::users-permissions.permission').create({
      data: {
        action: 'api::contact.contact.create',
        subject: null,
        properties: {},
        conditions: [],
        role: publicRole.id
      }
    });

    console.log('✅ Contact create permission created:', permission.id);
    console.log('🎉 Contact API permissions configured successfully!');

  } catch (error) {
    console.error('❌ Error configuring contact permissions:', error);
  }
};