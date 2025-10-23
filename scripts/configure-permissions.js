const axios = require('axios');

async function configurePermissions() {
  console.log('🔧 Configuring Strapi API permissions...');
  
  try {
    // First, check if admin user exists by trying to get a JWT token
    console.log('📋 Checking admin setup...');
    
    // Try to register an admin user (this will fail if one already exists)
    try {
      const adminResponse = await axios.post('http://localhost:1337/admin/register-admin', {
        firstname: 'Admin',
        lastname: 'User',
        email: 'admin@orisun.com',
        password: 'AdminPassword123!'
      });
      console.log('✅ Admin user created successfully');
    } catch (error) {
      if (error.response?.status === 400) {
        console.log('✅ Admin user already exists');
      } else {
        console.log('⚠️  Admin setup issue:', error.response?.data?.message || error.message);
      }
    }

    // Login to get JWT token
    console.log('🔑 Getting admin token...');
    const loginResponse = await axios.post('http://localhost:1337/admin/login', {
      email: 'admin@orisun.com',
      password: 'AdminPassword123!'
    });
    
    const token = loginResponse.data.data.token;
    console.log('✅ Admin token obtained');

    // Configure permissions for public role
    console.log('🔧 Configuring public role permissions...');
    
    // Get public role ID
    const rolesResponse = await axios.get('http://localhost:1337/admin/users-permissions/roles', {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    const publicRole = rolesResponse.data.roles.find(role => role.type === 'public');
    if (!publicRole) {
      throw new Error('Public role not found');
    }
    
    console.log(`✅ Found public role with ID: ${publicRole.id}`);

    // Update public role permissions
    const updatedPermissions = {
      ...publicRole.permissions,
      'api::booking': {
        controllers: {
          booking: {
            create: { enabled: true },
            findOne: { enabled: true }
          }
        }
      },
      'api::private-dining': {
        controllers: {
          'private-dining': {
            find: { enabled: true },
            findOne: { enabled: true }
          }
        }
      }
    };

    await axios.put(`http://localhost:1337/admin/users-permissions/roles/${publicRole.id}`, {
      ...publicRole,
      permissions: updatedPermissions
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log('✅ Permissions configured successfully!');
    console.log('');
    console.log('🎉 Setup complete! You can now:');
    console.log('1. Test the API endpoints');
    console.log('2. Use the booking form at http://localhost:3001/test-stripe');
    console.log('3. View bookings in Strapi admin at http://localhost:1337/admin');
    
  } catch (error) {
    console.error('❌ Error configuring permissions:', error.response?.data || error.message);
    console.log('');
    console.log('📋 Manual setup required:');
    console.log('1. Go to http://localhost:1337/admin');
    console.log('2. Create admin account if needed');
    console.log('3. Navigate to Settings > Users & Permissions Plugin > Roles > Public');
    console.log('4. Enable: booking (create, findOne) and private-dining (find, findOne)');
    console.log('5. Save changes');
  }
}

configurePermissions();