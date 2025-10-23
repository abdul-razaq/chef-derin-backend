const axios = require('axios');

async function checkStrapiRoutes() {
  console.log('🔍 Checking Strapi routes and configuration...');
  
  const baseUrl = 'http://localhost:1337';
  
  // Test various possible API endpoints
  const testRoutes = [
    '/api',
    '/api/private-dinings',
    '/api/private-dining', 
    '/api/bookings',
    '/api/booking',
    '/api/galleries',
    '/api/gallery',
    '/private-dinings',
    '/private-dining',
    '/bookings', 
    '/booking',
    '/galleries',
    '/gallery',
    '/content-manager/collection-types',
    '/admin/content-manager/collection-types'
  ];
  
  for (const route of testRoutes) {
    try {
      const response = await axios.get(`${baseUrl}${route}`, {
        timeout: 5000,
        validateStatus: () => true // Don't throw on 4xx/5xx
      });
      
      console.log(`${route}: ${response.status} ${response.statusText}`);
      
      if (response.status === 200 && response.data) {
        console.log(`  ✅ Data found: ${JSON.stringify(response.data).substring(0, 100)}...`);
      }
    } catch (error) {
      console.log(`${route}: ERROR - ${error.message}`);
    }
  }
  
  // Check if Strapi is in development mode
  try {
    const response = await axios.get(`${baseUrl}/admin`, {
      timeout: 5000,
      validateStatus: () => true
    });
    console.log(`\n🔧 Admin panel: ${response.status === 200 ? '✅ Available' : '❌ Not available'}`);
  } catch (error) {
    console.log(`\n🔧 Admin panel: ERROR - ${error.message}`);
  }
}

checkStrapiRoutes().catch(console.error);