const axios = require('axios');

async function configureTestimonialPermissions() {
  try {
    console.log('Configuring testimonial API permissions...');
    
    // Get the public role
    const rolesResponse = await axios.get('http://localhost:1337/api/users-permissions/roles');
    const publicRole = rolesResponse.data.roles.find(role => role.type === 'public');
    
    if (!publicRole) {
      console.log('Public role not found');
      return;
    }
    
    console.log('Found public role:', publicRole.id);
    
    // Update permissions for testimonials
    const permissions = {
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
    
    await axios.put(`http://localhost:1337/api/users-permissions/roles/${publicRole.id}`, {
      ...publicRole,
      permissions
    });
    
    console.log('✅ Testimonial API permissions configured successfully');
    
    // Test the API
    console.log('Testing testimonials API...');
    const testResponse = await axios.get('http://localhost:1337/api/testimonials');
    console.log('✅ Testimonials API is now accessible');
    console.log('Found testimonials:', testResponse.data.data?.length || 0);
    
  } catch (error) {
    console.log('❌ Error:', error.response?.data || error.message);
  }
}

configureTestimonialPermissions();