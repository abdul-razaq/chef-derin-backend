const axios = require('axios');

const STRAPI_URL = 'http://localhost:1337';

// Define the permissions we need to enable
const permissions = [
  // Booking permissions
  'api::booking.booking.find',
  'api::booking.booking.findOne', 
  'api::booking.booking.create',
  
  // Private dining permissions
  'api::private-dining.private-dining.find',
  'api::private-dining.private-dining.findOne',
  'api::private-dining.private-dining.create',
  
  // Gallery permissions
  'api::gallery.gallery.find',
  'api::gallery.gallery.findOne',
  
  // Payment option permissions
  'api::payment-option.payment-option.find',
  'api::payment-option.payment-option.findOne'
];

async function configurePermissions() {
  try {
    console.log('🔧 Configuring API permissions...');
    
    // First, get the public role
    console.log('📋 Getting public role...');
    const rolesResponse = await axios.get(`${STRAPI_URL}/users-permissions/roles`);
    const publicRole = rolesResponse.data.roles.find(role => role.type === 'public');
    
    if (!publicRole) {
      throw new Error('Public role not found');
    }
    
    console.log(`✓ Found public role with ID: ${publicRole.id}`);
    
    // Get current permissions
    const currentPermissions = publicRole.permissions || {};
    
    // Add our API permissions
    permissions.forEach(permission => {
      const [, contentType, , action] = permission.split('.');
      const apiKey = `api::${contentType}.${contentType}`;
      
      if (!currentPermissions[apiKey]) {
        currentPermissions[apiKey] = {};
      }
      
      if (!currentPermissions[apiKey].controllers) {
        currentPermissions[apiKey].controllers = {};
      }
      
      if (!currentPermissions[apiKey].controllers[contentType]) {
        currentPermissions[apiKey].controllers[contentType] = {};
      }
      
      currentPermissions[apiKey].controllers[contentType][action] = {
        enabled: true,
        policy: ''
      };
      
      console.log(`✓ Enabled: ${permission}`);
    });
    
    // Update the role with new permissions
    console.log('💾 Updating public role permissions...');
    await axios.put(`${STRAPI_URL}/users-permissions/roles/${publicRole.id}`, {
      ...publicRole,
      permissions: currentPermissions
    });
    
    console.log('✅ Permissions configured successfully!');
    console.log('🧪 You can now test the API endpoints');
    
  } catch (error) {
    console.error('❌ Error configuring permissions:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

configurePermissions();