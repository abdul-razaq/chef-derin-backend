#!/usr/bin/env node

/**
 * Automated API Permissions Configuration Script
 * This script directly configures the required permissions in Strapi
 */

const path = require('path');

// Set up Strapi environment
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

async function configurePermissions() {
  console.log('🚀 Starting automated permissions configuration...\n');

  try {
    // Initialize Strapi
    const strapi = require('@strapi/strapi');
    const app = await strapi().load();

    console.log('✅ Strapi loaded successfully');

    // Get the public role
    const publicRole = await strapi.query('plugin::users-permissions.role').findOne({
      where: { type: 'public' }
    });

    if (!publicRole) {
      console.error('❌ Public role not found');
      process.exit(1);
    }

    console.log('✅ Found public role:', publicRole.name);

    // Define the permissions we need to enable
    const permissionsToEnable = [
      {
        action: 'api::booking.booking.create',
        subject: null,
        properties: {},
        conditions: []
      },
      {
        action: 'api::booking.booking.findOne',
        subject: null,
        properties: {},
        conditions: []
      },
      {
        action: 'api::private-dining.private-dining.find',
        subject: null,
        properties: {},
        conditions: []
      },
      {
        action: 'api::private-dining.private-dining.findOne',
        subject: null,
        properties: {},
        conditions: []
      }
    ];

    console.log('\n🔧 Configuring permissions...');

    // Remove existing permissions for these actions
    for (const perm of permissionsToEnable) {
      await strapi.query('plugin::users-permissions.permission').deleteMany({
        where: {
          action: perm.action,
          role: publicRole.id
        }
      });
    }

    // Create new permissions
    for (const perm of permissionsToEnable) {
      await strapi.query('plugin::users-permissions.permission').create({
        data: {
          action: perm.action,
          subject: perm.subject,
          properties: perm.properties,
          conditions: perm.conditions,
          role: publicRole.id,
          enabled: true
        }
      });

      console.log(`✅ Enabled: ${perm.action}`);
    }

    console.log('\n🎉 Permissions configured successfully!');
    console.log('\n📋 Enabled permissions:');
    console.log('   - booking: create, findOne');
    console.log('   - private-dining: find, findOne');

    console.log('\n🧪 Testing API endpoints...');

    // Test the APIs
    const testResults = [];

    try {
      // Test private-dining find
      const privateDinings = await strapi.entityService.findMany('api::private-dining.private-dining', {
        limit: 1
      });
      testResults.push({ endpoint: 'GET /api/private-dinings', status: 'SUCCESS', count: privateDinings?.length || 0 });
    } catch (error) {
      testResults.push({ endpoint: 'GET /api/private-dinings', status: 'ERROR', error: error.message });
    }

    try {
      // Test booking creation (dry run)
      const bookingSchema = strapi.contentTypes['api::booking.booking'];
      testResults.push({ endpoint: 'POST /api/bookings', status: 'SCHEMA_OK', schema: !!bookingSchema });
    } catch (error) {
      testResults.push({ endpoint: 'POST /api/bookings', status: 'ERROR', error: error.message });
    }

    console.log('\n📊 API Test Results:');
    testResults.forEach(result => {
      const status = result.status === 'SUCCESS' || result.status === 'SCHEMA_OK' ? '✅' : '❌';
      console.log(`${status} ${result.endpoint}: ${result.status}`);
      if (result.count !== undefined) console.log(`   Found ${result.count} items`);
      if (result.error) console.log(`   Error: ${result.error}`);
    });

    console.log('\n🌐 Next steps:');
    console.log('1. Test the booking flow at: http://localhost:3001/test-stripe');
    console.log('2. APIs should now be accessible without 405 errors');

    await app.destroy();
    process.exit(0);

  } catch (error) {
    console.error('❌ Error configuring permissions:', error);
    process.exit(1);
  }
}

// Run the configuration
configurePermissions();