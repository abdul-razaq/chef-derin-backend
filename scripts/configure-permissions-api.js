#!/usr/bin/env node

/**
 * Configure API Permissions via Admin API
 * This script uses the admin API to configure permissions
 */

const axios = require('axios');

async function configurePermissions() {
  console.log('🔧 Configuring API permissions via Admin API...\n');

  const baseURL = 'http://localhost:1337';
  
  try {
    // First, let's check if we can access the admin API without authentication
    // In development mode, some endpoints might be accessible
    
    console.log('📋 Checking admin API access...');
    
    // Try to get the public role
    try {
      const rolesResponse = await axios.get(`${baseURL}/admin/users-permissions/roles`);
      console.log('✅ Admin API accessible');
      
      const publicRole = rolesResponse.data.find(role => role.type === 'public');
      if (!publicRole) {
        console.error('❌ Public role not found!');
        return;
      }
      
      console.log(`📋 Found Public role: ${publicRole.name} (ID: ${publicRole.id})`);
      
      // Update the public role permissions
      const updatedPermissions = {
        ...publicRole.permissions,
        'api::booking': {
          'booking': {
            'find': { enabled: true },
            'findOne': { enabled: true },
            'create': { enabled: true }
          }
        },
        'api::private-dining': {
          'private-dining': {
            'find': { enabled: true },
            'findOne': { enabled: true }
          }
        },
        'api::gallery': {
          'gallery': {
            'find': { enabled: true },
            'findOne': { enabled: true }
          }
        },
        'api::payment-option': {
          'payment-option': {
            'find': { enabled: true },
            'findOne': { enabled: true }
          }
        }
      };
      
      // Update the role
      await axios.put(`${baseURL}/admin/users-permissions/roles/${publicRole.id}`, {
        ...publicRole,
        permissions: updatedPermissions
      });
      
      console.log('✅ Permissions updated successfully!');
      
    } catch (apiError) {
      console.log('⚠️  Admin API requires authentication');
      console.log('📋 Please configure permissions manually through the admin panel:');
      console.log('1. Go to: http://localhost:1337/admin');
      console.log('2. Navigate to: Settings > Users & Permissions Plugin > Roles > Public');
      console.log('3. Enable these permissions:');
      console.log('   - booking: find, create, findOne');
      console.log('   - private-dining: find, findOne');
      console.log('   - gallery: find, findOne');
      console.log('   - payment-option: find, findOne');
      console.log('4. Save changes');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n📋 Please configure permissions manually through the admin panel:');
    console.log('1. Go to: http://localhost:1337/admin');
    console.log('2. Navigate to: Settings > Users & Permissions Plugin > Roles > Public');
    console.log('3. Enable the required permissions');
    console.log('4. Save changes');
  }
}

configurePermissions();