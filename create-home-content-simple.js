const axios = require('axios');

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
          quote: "Chef Derin's culinary artistry transformed our event into an unforgettable cultural journey. Every dish told a story, every flavor transported us to Nigeria.",
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
          description: "Discover my culinary journey from Nigeria to international recognition, blending traditional techniques with modern innovation.",
          ctaText: "Download Resume"
        },
        newsletter: {
          title: "Stay Connected",
          subtitle: "Newsletter Signup", 
          description: "Get the latest updates on new recipes, upcoming events, and culinary insights delivered to your inbox.",
          placeholderText: "Enter your email address",
          buttonText: "Subscribe Now"
        },
        publishedAt: new Date().toISOString()
      }
    };

    const response = await axios.post('http://localhost:1337/api/home', homeData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Home content created successfully!');
    console.log('Response:', response.data);
    
  } catch (error) {
    console.error('❌ Error creating home content:', error.response?.data || error.message);
  }
}

createHomeContent();