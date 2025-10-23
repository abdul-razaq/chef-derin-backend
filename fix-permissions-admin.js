const axios = require('axios');

const STRAPI_URL = 'http://localhost:1337';

async function configurePermissions() {
  try {
    console.log('🔐 Configuring API permissions...');

    // First, get an admin token
    const authResponse = await axios.post(`${STRAPI_URL}/admin/login`, {
      email: 'admin@example.com',
      password: 'password123'
    });

    const token = authResponse.data.data.token;
    console.log('✅ Admin authenticated');

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    // Get the public role
    const rolesResponse = await axios.get(`${STRAPI_URL}/users-permissions/roles`, { headers });
    const publicRole = rolesResponse.data.roles.find(role => role.type === 'public');
    
    if (!publicRole) {
      throw new Error('Public role not found');
    }

    console.log('✅ Found public role:', publicRole.id);

    // Get current permissions
    const permissionsResponse = await axios.get(`${STRAPI_URL}/users-permissions/permissions`, { headers });
    const permissions = permissionsResponse.data.permissions;

    console.log('✅ Retrieved current permissions');

    // Enable specific permissions for the public role
    const permissionsToEnable = [
      'api::booking.booking.find',
      'api::booking.booking.findOne',
      'api::booking.booking.create',
      'api::private-dining.private-dining.find',
      'api::private-dining.private-dining.findOne',
      'api::gallery.gallery.find',
      'api::gallery.gallery.findOne',
      'api::payment-option.payment-option.find',
      'api::payment-option.payment-option.findOne'
    ];

    // Update permissions for public role
    const updatedPermissions = { ...permissions };
    
    permissionsToEnable.forEach(permission => {
      if (updatedPermissions[permission]) {
        updatedPermissions[permission].controllers = {
          ...updatedPermissions[permission].controllers
        };
        
        // Enable for public role
        Object.keys(updatedPermissions[permission].controllers).forEach(controller => {
          Object.keys(updatedPermissions[permission].controllers[controller]).forEach(action => {
            if (!updatedPermissions[permission].controllers[controller][action].enabled) {
              updatedPermissions[permission].controllers[controller][action].enabled = true;
            }
            if (!updatedPermissions[permission].controllers[controller][action].policy) {
              updatedPermissions[permission].controllers[controller][action].policy = '';
            }
          });
        });
      }
    });

    // Update the public role with new permissions
    const updateResponse = await axios.put(`${STRAPI_URL}/users-permissions/roles/${publicRole.id}`, {
      name: publicRole.name,
      description: publicRole.description,
      type: publicRole.type,
      permissions: updatedPermissions
    }, { headers });

    console.log('✅ Permissions updated successfully');
    console.log('🎉 API endpoints should now be accessible!');
    
  } catch (error) {
    console.error('❌ Error configuring permissions:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      console.log('💡 Please ensure you have created an admin account at http://localhost:1337/admin');
      console.log('💡 Use email: admin@example.com and password: password123');
    }
  }
}

configurePermissions();