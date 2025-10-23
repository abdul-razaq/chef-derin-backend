/**
 * ORISUN Dining Events Seeder
 * Creates the specific dining events with exact dates provided
 */

const diningEventsData = [
  // Nigeria - Available with pricing
  {
    title: "ORISUN Dining Experience - Lagos",
    location: "Lagos, Nigeria",
    venue: "Private Venue, Victoria Island",
    date: "2024-12-11T19:00:00.000Z",
    status: "available",
    price: 150000,
    currency: "NGN",
    guestCapacity: 15,
    bookingDeadline: "2024-12-09T23:59:59.000Z",
    description: `<p>Experience the vibrant flavors of Nigeria with Chef Derin in Lagos. This exclusive dining event celebrates the rich culinary heritage of West Africa with contemporary presentation and techniques.</p>
    
    <p><strong>What to Expect:</strong></p>
    <ul>
      <li>8-course Nigerian-inspired tasting menu</li>
      <li>Premium Nigerian wines and craft cocktails</li>
      <li>Live cooking demonstration</li>
      <li>Cultural storytelling through food</li>
      <li>Take-home spice blends and recipes</li>
    </ul>`,
    menuPreview: "Pepper Soup Shooter • Suya Beef Tartare • Jollof Paella • Grilled Croaker • Plantain Soufflé • Palm Wine Sorbet • Nigerian Coffee",
    eventDuration: "4.5 hours",
    dressCode: "Elegant Casual",
    ageRestriction: "21+",
    cancellationPolicy: "Full refund up to 72 hours before the event",
    contactEmail: "bookings@orisundining.com",
    contactPhone: "+234 1 234 5678",
    seoTitle: "ORISUN Dining Experience Lagos - Chef Derin Nigerian Cuisine",
    seoDescription: "Join Chef Derin for an exclusive Nigerian dining experience in Lagos. 8-course tasting menu celebrating West African flavors.",
    seoKeywords: "Chef Derin, Lagos dining, Nigerian cuisine, private chef, West African food"
  },

  {
    title: "ORISUN Dining Experience - Lagos (Second Date)",
    location: "Lagos, Nigeria",
    venue: "Private Venue, Victoria Island", 
    date: "2024-12-21T19:00:00.000Z",
    status: "available",
    price: 150000,
    currency: "NGN",
    guestCapacity: 15,
    bookingDeadline: "2024-12-19T23:59:59.000Z",
    description: `<p>Experience the vibrant flavors of Nigeria with Chef Derin in Lagos. This exclusive dining event celebrates the rich culinary heritage of West Africa with contemporary presentation and techniques.</p>
    
    <p><strong>What to Expect:</strong></p>
    <ul>
      <li>8-course Nigerian-inspired tasting menu</li>
      <li>Premium Nigerian wines and craft cocktails</li>
      <li>Live cooking demonstration</li>
      <li>Cultural storytelling through food</li>
      <li>Take-home spice blends and recipes</li>
    </ul>`,
    menuPreview: "Pepper Soup Shooter • Suya Beef Tartare • Jollof Paella • Grilled Croaker • Plantain Soufflé • Palm Wine Sorbet • Nigerian Coffee",
    eventDuration: "4.5 hours",
    dressCode: "Elegant Casual",
    ageRestriction: "21+",
    cancellationPolicy: "Full refund up to 72 hours before the event",
    contactEmail: "bookings@orisundining.com",
    contactPhone: "+234 1 234 5678",
    seoTitle: "ORISUN Dining Experience Lagos - Chef Derin Nigerian Cuisine",
    seoDescription: "Join Chef Derin for an exclusive Nigerian dining experience in Lagos. 8-course tasting menu celebrating West African flavors.",
    seoKeywords: "Chef Derin, Lagos dining, Nigerian cuisine, private chef, West African food"
  },

  {
    title: "ORISUN Dining Experience - Lagos (Third Date)",
    location: "Lagos, Nigeria",
    venue: "Private Venue, Victoria Island",
    date: "2024-12-28T19:00:00.000Z", 
    status: "available",
    price: 150000,
    currency: "NGN",
    guestCapacity: 15,
    bookingDeadline: "2024-12-26T23:59:59.000Z",
    description: `<p>Experience the vibrant flavors of Nigeria with Chef Derin in Lagos. This exclusive dining event celebrates the rich culinary heritage of West Africa with contemporary presentation and techniques.</p>
    
    <p><strong>What to Expect:</strong></p>
    <ul>
      <li>8-course Nigerian-inspired tasting menu</li>
      <li>Premium Nigerian wines and craft cocktails</li>
      <li>Live cooking demonstration</li>
      <li>Cultural storytelling through food</li>
      <li>Take-home spice blends and recipes</li>
    </ul>`,
    menuPreview: "Pepper Soup Shooter • Suya Beef Tartare • Jollof Paella • Grilled Croaker • Plantain Soufflé • Palm Wine Sorbet • Nigerian Coffee",
    eventDuration: "4.5 hours",
    dressCode: "Elegant Casual",
    ageRestriction: "21+",
    cancellationPolicy: "Full refund up to 72 hours before the event",
    contactEmail: "bookings@orisundining.com",
    contactPhone: "+234 1 234 5678",
    seoTitle: "ORISUN Dining Experience Lagos - Chef Derin Nigerian Cuisine",
    seoDescription: "Join Chef Derin for an exclusive Nigerian dining experience in Lagos. 8-course tasting menu celebrating West African flavors.",
    seoKeywords: "Chef Derin, Lagos dining, Nigerian cuisine, private chef, West African food"
  },

  // South Africa - Waiting List with pricing
  {
    title: "ORISUN Dining Experience - Cape Town",
    location: "Cape Town, South Africa",
    venue: "Private Venue, Camps Bay",
    date: "2025-02-15T19:00:00.000Z", // Future date since not available yet
    status: "waiting_list",
    price: 325,
    currency: "USD",
    guestCapacity: 12,
    bookingDeadline: null, // No deadline for waiting list
    description: `<p>Join the waiting list for Chef Derin's extraordinary culinary journey in the heart of Cape Town. This intimate dining experience will showcase the finest African cuisine with a modern twist, set against the stunning backdrop of Camps Bay.</p>
    
    <p><strong>What to Expect:</strong></p>
    <ul>
      <li>7-course tasting menu featuring locally sourced ingredients</li>
      <li>Wine pairings from renowned South African vineyards</li>
      <li>Interactive cooking demonstration</li>
      <li>Meet and greet with Chef Derin</li>
      <li>Exclusive recipes and cooking tips</li>
    </ul>
    
    <p><em>Join our waiting list to be notified when dates become available!</em></p>`,
    menuPreview: "Amuse-bouche • Seafood Ceviche • Jollof Risotto • Grilled Springbok • Plantain Tarte Tatin • African Coffee & Petit Fours",
    eventDuration: "4 hours",
    dressCode: "Smart Casual",
    ageRestriction: "18+",
    cancellationPolicy: "Full refund available when booking opens",
    contactEmail: "bookings@orisundining.com",
    contactPhone: "+27 21 123 4567",
    seoTitle: "ORISUN Dining Experience Cape Town - Chef Derin Private Dinner Waiting List",
    seoDescription: "Join the waiting list for an exclusive dining experience with Chef Derin in Cape Town. 7-course African cuisine tasting menu with wine pairings.",
    seoKeywords: "Chef Derin, Cape Town dining, private chef, African cuisine, tasting menu, waiting list"
  },

  // Rwanda - Waiting List without pricing
  {
    title: "ORISUN Dining Experience - Kigali",
    location: "Kigali, Rwanda",
    venue: "Private Venue, Kigali Heights",
    date: "2025-03-15T19:00:00.000Z", // Future date since not available yet
    status: "waiting_list",
    price: null, // No pricing yet
    currency: "USD",
    guestCapacity: 10,
    bookingDeadline: null, // No deadline for waiting list
    description: `<p>Be among the first to experience Chef Derin's culinary artistry in the beautiful city of Kigali, Rwanda. This exclusive dining experience will celebrate the rich flavors and traditions of East African cuisine with Chef Derin's signature modern approach.</p>
    
    <p><strong>What to Expect:</strong></p>
    <ul>
      <li>Multi-course East African inspired tasting menu</li>
      <li>Local Rwandan coffee and tea pairings</li>
      <li>Interactive cooking demonstration</li>
      <li>Cultural storytelling through food</li>
      <li>Meet and greet with Chef Derin</li>
    </ul>
    
    <p><em>Join our waiting list to be the first to know when this experience becomes available. Pricing will be announced soon!</em></p>`,
    menuPreview: "East African Amuse-bouche • Ugali Variations • Grilled Tilapia • Rwandan Coffee Experience • Traditional Desserts",
    eventDuration: "4 hours",
    dressCode: "Smart Casual",
    ageRestriction: "18+",
    cancellationPolicy: "Details will be provided when booking opens",
    contactEmail: "bookings@orisundining.com",
    contactPhone: "+250 788 123 456",
    seoTitle: "ORISUN Dining Experience Kigali - Chef Derin East African Cuisine Waiting List",
    seoDescription: "Join the waiting list for Chef Derin's exclusive East African dining experience in Kigali, Rwanda. Be the first to know when this unique culinary journey becomes available.",
    seoKeywords: "Chef Derin, Kigali dining, Rwanda cuisine, East African food, private chef, waiting list"
  }
];

module.exports = {
  diningEventsData,
  
  async seedDiningEvents() {
    try {
      console.log('🌱 Starting ORISUN dining events seeding...');
      
      for (const eventData of diningEventsData) {
        // Check if event already exists
        const existingEvent = await strapi.entityService.findMany('api::private-dining.private-dining', {
          filters: { slug: eventData.slug }
        });
        
        if (existingEvent.length === 0) {
          await strapi.entityService.create('api::private-dining.private-dining', {
            data: {
              ...eventData,
              publishedAt: new Date() // Auto-publish the events
            }
          });
          console.log(`✅ Created event: ${eventData.title}`);
        } else {
          console.log(`⏭️  Event already exists: ${eventData.title}`);
        }
      }
      
      console.log('🎉 ORISUN dining events seeding completed!');
      return { success: true, message: 'All events created successfully' };
      
    } catch (error) {
      console.error('❌ Error seeding dining events:', error);
      return { success: false, error: error.message };
    }
  }
};