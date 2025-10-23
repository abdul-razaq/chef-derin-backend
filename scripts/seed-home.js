const strapi = require('@strapi/strapi');

async function seedHome() {
  try {
    console.log('🏠 Starting Home content seeding...');
    
    // Check if home content already exists
    const existingHome = await strapi.entityService.findMany('api::home.home');
    
    if (existingHome) {
      console.log('✅ Home content already exists');
      console.log('Existing home:', existingHome);
      return;
    }
    
    console.log('📝 Creating home content...');
    
    // Create home content with components
    const homeContent = await strapi.entityService.create('api::home.home', {
      data: {
        hero: {
          title: 'Welcome to Chef Derin',
          subtitle: 'Authentic Nigerian Flavors',
          description: 'Experience the finest Nigerian cuisine crafted with passion and served with love',
          backgroundImage: '/images/hero-bg.jpg',
          ctaText: 'Book Your Experience',
          ctaLink: '/booking'
        },
        testimonial: {
          quote: 'Chef Derin brings the soul of Nigeria to every dish',
          author: 'Food Critic',
          rating: 5
        },
        services: {
          title: 'Our Services',
          description: 'From intimate dining to grand celebrations',
          items: [
            {
              title: 'Private Dining',
              description: 'Exclusive culinary experiences',
              icon: 'chef-hat'
            },
            {
              title: 'Catering',
              description: 'Events and celebrations',
              icon: 'utensils'
            }
          ]
        },
        newsletter: {
          title: 'Stay Updated',
          description: 'Get the latest news and exclusive offers',
          placeholder: 'Enter your email'
        },
        seo: {
          metaTitle: 'Chef Derin - Authentic Nigerian Cuisine',
          metaDescription: 'Experience the finest Nigerian cuisine with Chef Derin. Book your exclusive dining experience today.',
          keywords: 'Nigerian cuisine, Chef Derin, fine dining, authentic food'
        },
        publishedAt: new Date()
      }
    });
    
    console.log('✅ Home content created successfully!');
    console.log('Created home:', homeContent);
    
  } catch (error) {
    console.error('❌ Error seeding home content:', error);
    throw error;
  }
}

module.exports = seedHome;

// Run if called directly
if (require.main === module) {
  const strapiInstance = strapi();
  strapiInstance.load().then(() => {
    seedHome().then(() => {
      console.log('🎉 Home seeding completed!');
      process.exit(0);
    }).catch(error => {
      console.error('❌ Home seeding failed:', error);
      process.exit(1);
    });
  });
}