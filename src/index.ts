import type { Core } from '@strapi/strapi';

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap: async ({ strapi }) => {
    console.log('🚀 Setting up ORISUN booking system...');
    
    try {
      // Wait for Strapi to be fully loaded
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Create a test dining event if none exists
      const existingEvents = await strapi.entityService.findMany('api::private-dining.private-dining');
      
      if (!existingEvents || existingEvents.length === 0) {
        await strapi.entityService.create('api::private-dining.private-dining', {
          data: {
            title: 'ORISUN Nigerian Tasting Experience',
            description: 'An authentic Nigerian culinary journey featuring traditional flavors and modern techniques.',
            location: 'Cape Town, South Africa',
            venue: 'Private Chef Studio',
            date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
            price: 150,
            currency: 'USD',
            maxGuests: 12,
            availableSpots: 12,
            duration: 180,
            status: 'booking_open',
            slug: 'orisun-nigerian-tasting-experience',
            publishedAt: new Date()
          }
        });
        console.log('✅ Created test dining event: ORISUN Nigerian Tasting Experience');
      } else {
        console.log('✅ Test dining event already exists');
      }

      // Configure API permissions for public access
      console.log('🔧 Configuring API permissions...');
      
      try {
        // Get the public role
        const publicRole = await strapi.query('plugin::users-permissions.role').findOne({
          where: { type: 'public' }
        });

        if (publicRole) {
          console.log(`📋 Found Public role: ${publicRole.name} (ID: ${publicRole.id})`);

          // Define permissions to enable
          const permissionsToEnable = [
            'api::booking.booking.find',
            'api::booking.booking.findOne',
            'api::booking.booking.create',
            'api::private-dining.private-dining.find',
            'api::private-dining.private-dining.findOne',
            'api::gallery.gallery.find',
            'api::gallery.gallery.findOne',
            'api::payment-option.payment-option.find',
            'api::payment-option.payment-option.findOne',
            'api::home.home.find',
            'api::home.home.findOne',
            'api::about.about.find',
            'api::about.about.findOne',
            'api::service.service.find',
            'api::service.service.findOne',
            'api::contact.contact.find',
            'api::contact.contact.findOne',
            'api::documentary.documentary.find',
            'api::documentary.documentary.findOne',
            'api::recipe-book.recipe-book.find',
            'api::recipe-book.recipe-book.findOne'
          ];

          // Enable each permission
          for (const action of permissionsToEnable) {
            try {
              // Check if permission exists
              let permission = await strapi.query('plugin::users-permissions.permission').findOne({
                where: { action, role: publicRole.id }
              });

              if (permission) {
                // Update existing permission
                await strapi.query('plugin::users-permissions.permission').update({
                  where: { id: permission.id },
                  data: { enabled: true }
                });
              } else {
                // Create new permission
                await strapi.query('plugin::users-permissions.permission').create({
                  data: {
                    action,
                    role: publicRole.id,
                    enabled: true
                  }
                });
              }
              console.log(`✅ Enabled permission: ${action}`);
            } catch (permError) {
              console.log(`⚠️  Error with ${action}: ${permError.message}`);
            }
          }
          
          console.log('✅ API permissions configured successfully!');
        } else {
          console.log('❌ Public role not found');
        }
      } catch (permissionError) {
        console.log('⚠️  Error configuring permissions:', permissionError.message);
        console.log('📋 Please configure permissions manually through the admin panel');
      }

      console.log('');
      console.log('🎉 Bootstrap completed!');
      console.log('');
      console.log('📋 MANUAL SETUP REQUIRED:');
      console.log('1. Go to: http://localhost:1337/admin');
      console.log('2. Create admin account (if first time)');
      console.log('3. Navigate to: Settings > Users & Permissions Plugin > Roles > Public');
      console.log('4. Enable these permissions:');
      console.log('   - booking: create, findOne');
      console.log('   - private-dining: find, findOne');
      console.log('5. Save changes');
      console.log('');
      console.log('🧪 Then test booking at: http://localhost:3001/test-stripe');
      console.log('');
    } catch (error) {
      console.log('❌ Error in bootstrap:', error.message);
    }
  },
};
