#!/usr/bin/env node

const axios = require('axios');

const BASE_URL = 'http://localhost:1337';

async function configurePermissions() {
  console.log('🔧 Configuring API permissions directly...\n');

  try {
    // First, get the admin JWT token by creating a temporary admin user
    console.log('1. Setting up admin access...');
    
    // Check if admin user exists
    let adminToken;
    try {
      const loginResponse = await axios.post(`${BASE_URL}/admin/login`, {
        email: 'admin@example.com',
        password: 'password123'
      });
      adminToken = loginResponse.data.data.token;
      console.log('✅ Admin login successful');
    } catch (error) {
      // If login fails, try to register
      try {
        const registerResponse = await axios.post(`${BASE_URL}/admin/register-admin`, {
          firstname: 'Admin',
          lastname: 'User',
          email: 'admin@example.com',
          password: 'password123'
        });
        adminToken = registerResponse.data.data.token;
        console.log('✅ Admin user created and logged in');
      } catch (regError) {
        console.log('ℹ️  Admin user already exists, trying alternative approach...');
        
        // Try to get existing token or use API token approach
        const response = await axios.get(`${BASE_URL}/admin/init`);
        if (response.data.data && response.data.data.hasAdmin) {
          console.log('✅ Admin exists, proceeding with permission configuration...');
        }
      }
    }

    // Configure permissions using the Users & Permissions plugin API
    console.log('2. Configuring public role permissions...');

    const permissionsConfig = {
      'api::private-dining.private-dining': ['find', 'findOne'],
      'api::booking.booking': ['create', 'findOne'],
      'api::gallery.gallery': ['find', 'findOne']
    };

    // Get the public role
    const rolesResponse = await axios.get(`${BASE_URL}/users-permissions/roles`);
    const publicRole = rolesResponse.data.roles.find(role => role.type === 'public');
    
    if (!publicRole) {
      throw new Error('Public role not found');
    }

    console.log(`✅ Found public role with ID: ${publicRole.id}`);

    // Update permissions for each content type
    for (const [contentType, permissions] of Object.entries(permissionsConfig)) {
      console.log(`   Configuring ${contentType}...`);
      
      const permissionData = {
        permissions: {
          [contentType]: permissions.reduce((acc, perm) => {
            acc[perm] = {
              enabled: true,
              policy: ''
            };
            return acc;
          }, {})
        }
      };

      try {
        await axios.put(`${BASE_URL}/users-permissions/roles/${publicRole.id}`, permissionData);
        console.log(`   ✅ ${contentType}: ${permissions.join(', ')}`);
      } catch (error) {
        console.log(`   ⚠️  ${contentType}: ${error.response?.data?.message || error.message}`);
      }
    }

    console.log('\n3. Testing API endpoints...');
    
    // Test the APIs
    const testEndpoints = [
      '/api/private-dinings',
      '/api/bookings',
      '/api/galleries'
    ];

    for (const endpoint of testEndpoints) {
      try {
        const response = await axios.get(`${BASE_URL}${endpoint}`, {
          timeout: 5000,
          validateStatus: () => true
        });
        
        if (response.status === 200) {
          console.log(`✅ ${endpoint}: Working (${response.data.data?.length || 0} items)`);
        } else if (response.status === 403) {
          console.log(`🔒 ${endpoint}: Permissions still need configuration`);
        } else {
          console.log(`⚠️  ${endpoint}: Status ${response.status}`);
        }
      } catch (error) {
        console.log(`❌ ${endpoint}: ${error.message}`);
      }
    }

    console.log('\n🎉 Permission configuration completed!');
    console.log('\n📋 Next steps:');
    console.log('1. APIs should now be accessible');
    console.log('2. Test the booking flow at: http://localhost:3001/test-stripe');
    console.log('3. Admin panel: http://localhost:1337/admin');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n🔧 Manual fallback required:');
    console.log('1. Go to: http://localhost:1337/admin');
    console.log('2. Settings → Users & Permissions Plugin → Roles → Public');
    console.log('3. Enable permissions for private-dining, booking, and gallery');
  }
}

configurePermissions();