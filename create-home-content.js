const strapi = require('@strapi/strapi');

async function createHomeContent() {
  let app;
  try {
    // Initialize Strapi
    app = await strapi().load();
    
    console.log('🏠 Checking for existing home content...');
    
    // Check if home content exists
    const existingHome = await app.db.query('api::home.home').findOne();
    
    if (existingHome) {
      console.log('✅ Home content already exists:', existingHome);
      return;
    }
    
    console.log('📝 Creating home content...');
    
    // Create home content
    const homeContent = await app.db.query('api::home.home').create({
      data: {
        title: 'Welcome to Chef Derin',
        description: 'Experience the finest Nigerian cuisine with Chef Derin',
        heroTitle: 'Authentic Nigerian Flavors',
        heroSubtitle: 'Crafted with passion, served with love',
        publishedAt: new Date(),
      },
    });
    
    console.log('✅ Home content created successfully:', homeContent);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    // Close Strapi
    if (app) {
      await app.destroy();
    }
    process.exit(0);
  }
}

createHomeContent();