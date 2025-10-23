const fetch = require('node-fetch');

async function createHomeContent() {
  try {
    console.log('🏠 Creating home content...');
    
    const homeData = {
      data: {
        hero: {
          title: "Dr. Aderinsola Awofala",
          subtitle: "Chef Derin",
          description: "Bringing authentic Nigerian flavors to the world through culinary excellence and cultural storytelling.",
          tagline: "From Lagos to the World",
          ctaText: "Explore My Journey",
          ctaLink: "/about"
        },
        testimonial: {
          title: "What People Say",
          subtitle: "Client Testimonials",
          quote: "Chef Derin's culinary artistry transformed our event into an unforgettable cultural journey.",
          authorName: "Sarah Johnson",
          authorTitle: "Event Coordinator"
        },
        services: {
          title: "My Services",
          subtitle: "Culinary Excellence",
          description: "From intimate private dinners to large-scale events, I bring authentic Nigerian cuisine and cultural storytelling to every occasion."
        },
        resume: {
          title: "My Journey",
          subtitle: "Professional Background",
          description: "Discover my culinary journey from Nigeria to international recognition.",
          ctaText: "Download Resume"
        },
        newsletter: {
          title: "Stay Connected",
          subtitle: "Newsletter Signup",
          description: "Get the latest updates on new recipes, upcoming events, and culinary insights.",
          buttonText: "Subscribe Now"
        },
        publishedAt: new Date().toISOString()
      }
    };

    const response = await fetch('http://localhost:1337/api/home', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(homeData)
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Home content created successfully!');
      console.log('Response:', JSON.stringify(result, null, 2));
    } else {
      console.error('❌ Failed to create home content');
      console.error('Status:', response.status);
      console.error('Error:', result);
    }
    
  } catch (error) {
    console.error('❌ Error creating home content:', error.message);
  }
}

createHomeContent();