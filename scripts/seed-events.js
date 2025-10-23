#!/usr/bin/env node

/**
 * ORISUN Dining Events Seeder Script
 * Run this script to populate the database with dining events
 */

const { diningEventsData } = require('../src/api/private-dining/services/seed-dining-events');

async function runSeeder() {
  console.log('🚀 ORISUN Dining Events Seeder');
  console.log('================================');
  
  try {
    // Initialize Strapi programmatically
    const strapi = require('@strapi/strapi');
    const app = await strapi().load();
    
    console.log('📊 Events to be created:');
    diningEventsData.forEach((event, index) => {
      console.log(`${index + 1}. ${event.title} - ${event.location} (${event.date.split('T')[0]})`);
    });
    
    console.log('\n🌱 Starting seeding process...\n');
    
    for (const eventData of diningEventsData) {
      try {
        // Check if event already exists
        const existingEvents = await app.entityService.findMany('api::private-dining.private-dining', {
          filters: { slug: eventData.slug }
        });
        
        if (existingEvents.length === 0) {
          await app.entityService.create('api::private-dining.private-dining', {
            data: {
              ...eventData,
              publishedAt: new Date() // Auto-publish the events
            }
          });
          console.log(`✅ Created: ${eventData.title}`);
        } else {
          console.log(`⏭️  Already exists: ${eventData.title}`);
        }
      } catch (eventError) {
        console.error(`❌ Error creating ${eventData.title}:`, eventError.message);
      }
    }
    
    console.log('\n🎉 Seeding completed successfully!');
    console.log('\n📋 Summary:');
    console.log('- Cape Town: 2 events (Nov 16 & 22)');
    console.log('- Lagos: 3 events (Dec 11, 21 & 28)');
    console.log('- Total: 5 ORISUN dining experiences');
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

// Run the seeder
runSeeder();