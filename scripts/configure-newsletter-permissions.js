module.exports = async ({ strapi }) => {
  try {
    console.log('🔧 Configuring newsletter API permissions...');

    // Find the public role
    const publicRole = await strapi.query('plugin::users-permissions.role').findOne({
      where: { type: 'public' }
    });

    if (!publicRole) {
      console.error('❌ Public role not found');
      return;
    }

    console.log('✅ Found public role:', publicRole.id);

    // Define newsletter permissions
    const permissions = [
      'api::newsletter.newsletter.subscribe',
      'api::newsletter.newsletter.unsubscribe'
    ];

    for (const action of permissions) {
      // Check if permission already exists
      const existingPermission = await strapi.query('plugin::users-permissions.permission').findOne({
        where: {
          action: action,
          role: publicRole.id
        }
      });

      if (existingPermission) {
        console.log(`✅ Permission ${action} already exists`);
        continue;
      }

      // Create permission
      const permission = await strapi.query('plugin::users-permissions.permission').create({
        data: {
          action: action,
          subject: null,
          properties: {},
          conditions: [],
          role: publicRole.id
        }
      });

      console.log(`✅ Permission ${action} created:`, permission.id);
    }

    console.log('🎉 Newsletter API permissions configured successfully!');

  } catch (error) {
    console.error('❌ Error configuring newsletter permissions:', error);
  }
};