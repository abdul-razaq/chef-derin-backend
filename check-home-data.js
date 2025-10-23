const { createStrapi } = require('@strapi/strapi');

async function checkHomeData() {
  try {
    // Initialize Strapi
    const app = await createStrapi().load();
    
    console.log('Checking home data in database...');
    
    // Query all home records
    const allHomeData = await strapi.db.query('api::home.home').findMany({
      populate: true
    });
    
    console.log('All home records:', allHomeData.length);
    console.log('Home data:', JSON.stringify(allHomeData, null, 2));
    
    // Query with specific population
    const populatedData = await strapi.db.query('api::home.home').findMany({
      populate: {
        hero: {
          populate: {
            backgroundImage: true,
            ctaButton: true
          }
        },
        testimonial: {
          populate: {
            image: true,
            author: true
          }
        },
        services: {
          populate: {
            services: {
              populate: {
                icon: true,
                image: true
              }
            }
          }
        }
      }
    });
    
    console.log('Populated data:', JSON.stringify(populatedData, null, 2));
    
    await app.destroy();
    
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkHomeData();