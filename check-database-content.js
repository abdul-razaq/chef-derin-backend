const { createStrapi } = require('@strapi/strapi');

async function checkDatabaseContent() {
  try {
    console.log('🔍 Checking database content...');
    
    // Initialize Strapi
    const app = await createStrapi().load();
    
    // Query the home content directly from database
    const homeContent = await strapi.entityService.findMany('api::home.home', {
      populate: 'deep'
    });
    
    console.log('📊 Database query result:');
    console.log('Home content found:', homeContent ? 'YES' : 'NO');
    
    if (homeContent) {
      console.log('📝 Content structure:');
      console.log(JSON.stringify(homeContent, null, 2));
      
      // Check specifically for hero content
      if (homeContent.hero) {
        console.log('🎯 Hero section found:');
        console.log('Title:', homeContent.hero.title);
        console.log('Subtitle:', homeContent.hero.subtitle);
        console.log('Description:', homeContent.hero.description);
      } else {
        console.log('❌ No hero section found in content');
      }
    } else {
      console.log('❌ No home content found in database');
    }
    
    // Also check if it's published
    const publishedContent = await strapi.entityService.findMany('api::home.home', {
      populate: 'deep',
      publicationState: 'live'
    });
    
    console.log('📢 Published content check:');
    console.log('Published content found:', publishedContent ? 'YES' : 'NO');
    
    await app.destroy();
    
  } catch (error) {
    console.error('❌ Error checking database:', error.message);
    console.error('Stack:', error.stack);
  }
}

checkDatabaseContent();