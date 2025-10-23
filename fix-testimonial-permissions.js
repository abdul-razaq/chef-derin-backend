const axios = require('axios');

async function configureTestimonialPermissions() {
  console.log('🔧 Configuring Testimonial API permissions...');
  
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

    // Update public role permissions for testimonials
    const updatedPermissions = {
      ...publicRole.permissions,
      'api::testimonial.testimonial': {
        controllers: {
          testimonial: {
            find: { enabled: true },
            findOne: { enabled: true },
            featured: { enabled: true }
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

    console.log('✅ Testimonial permissions configured successfully!');
    
    // Test the API
    console.log('🧪 Testing testimonials API...');
    const testResponse = await axios.get('http://localhost:1337/api/testimonials');
    console.log('✅ Testimonials API is now accessible');
    console.log(`📊 Found ${testResponse.data.data?.length || 0} testimonials`);
    
    console.log('');
    console.log('🎉 Testimonial API setup complete!');
    console.log('You can now:');
    console.log('1. Add testimonials in Strapi admin at http://localhost:1337/admin');
    console.log('2. View them on the frontend at http://localhost:3000');
    
  } catch (error) {
    console.error('❌ Error configuring testimonial permissions:', error.response?.data || error.message);
    console.log('');
    console.log('📋 Manual setup required:');
    console.log('1. Go to http://localhost:1337/admin');
    console.log('2. Navigate to Settings > Users & Permissions Plugin > Roles > Public');
    console.log('3. Enable testimonial permissions: find, findOne, and featured');
    console.log('4. Save changes');
  }
}

configureTestimonialPermissions();