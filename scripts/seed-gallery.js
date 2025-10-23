const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Database path
const dbPath = path.join(__dirname, '../.tmp/data.db');

// Check if database exists
if (!fs.existsSync(dbPath)) {
  console.error('Database not found at:', dbPath);
  process.exit(1);
}

const db = new sqlite3.Database(dbPath);

// Generate unique IDs
function generateId() {
  return Math.floor(Math.random() * 1000000) + Date.now();
}

// Gallery data to seed
const galleryData = [
  {
    title: "Chef Derin's Signature Dishes",
    category: "food",
    description: "A collection of Chef Derin's most celebrated culinary creations, showcasing the fusion of traditional Nigerian flavors with modern techniques.",
    slug: "signature-dishes",
    featured: true,
    order: 1,
    images: [
      "/images/food/Chef Derin + Eralimad + PP -392.jpg",
      "/images/food/Chef Derin + Eralimad + PP-207.jpg",
      "/images/food/Chef Derin + Eralimad + PP-225.jpg",
      "/images/food/Chef Derin + Eralimad + PP-231.jpg",
      "/images/food/Chef Derin + Eralimad + PP-249.jpg",
      "/images/food/Chef Derin + Eralimad + PP-259.jpg",
      "/images/food/IMG_5113.JPG",
      "/images/food/IMG_5114.JPG",
      "/images/food/IMG_5137.jpg"
    ]
  },
  {
    title: "Orisun Dining Experience",
    category: "dinner_events",
    description: "Exclusive moments from our intimate Orisun dining experiences, where culinary artistry meets cultural storytelling.",
    slug: "orisun-dining-experience",
    featured: true,
    order: 2,
    eventDate: "2024-01-15",
    location: "Chef Derin's Private Kitchen",
    images: [
      "/images/dinner/IMG_6145HS.jpg",
      "/images/dinner/IMG_6264HS.jpg",
      "/images/dinner/IMG_6274HS.jpg",
      "/images/dinner/IMG_6293HS.jpg",
      "/images/dinner/IMG_6300HS.jpg",
      "/images/dinner/IMG_6322HS.jpg",
      "/images/dinner/IMG_6381HS.jpg",
      "/images/dinner/IMG_6447HS.jpg",
      "/images/dinner/IMG_6493HS.jpg"
    ]
  },
  {
    title: "Documentary Behind the Scenes",
    category: "documentary",
    description: "Intimate moments captured during the filming of Chef Derin's documentary, showcasing the journey from Lagos to global recognition.",
    slug: "documentary-behind-scenes",
    featured: true,
    order: 3,
    photographer: "Eralimad Productions",
    images: [
      "/images/documentary/Chef Derin + Eralimad + PP-08.jpg",
      "/images/documentary/Chef Derin + Eralimad + PP-16.jpg",
      "/images/documentary/Chef Derin + Eralimad + PP-19.jpg",
      "/images/documentary/Chef Derin + Eralimad + PP-20.jpg",
      "/images/documentary/Chef Derin + Eralimad + PP-31.jpg",
      "/images/documentary/Chef Derin + Eralimad + PP-43.jpg",
      "/images/documentary/Chef Derin + Eralimad + PP-49.jpg",
      "/images/documentary/Chef Derin + Eralimad + PP-053.jpg",
      "/images/documentary/Chef Derin + Eralimad + PP-058.jpg",
      "/images/documentary/Chef Derin + Eralimad + PP-059.jpg"
    ]
  },
  {
    title: "Corporate Events & Collaborations",
    category: "dinner_events",
    description: "Professional dining events and corporate collaborations showcasing Chef Derin's versatility in different settings.",
    slug: "corporate-events",
    featured: false,
    order: 4,
    images: [
      "/images/dinner/FliQ X MANTRA SECURITY PROTECTION LIMITED 123.jpg",
      "/images/dinner/FliQ X MANTRA SECURITY PROTECTION LIMITED 59.jpg",
      "/images/dinner/FliQ X MANTRA SECURITY PROTECTION LIMITED 71.jpg"
    ]
  },
  {
    title: "Chef Portraits & Professional Shots",
    category: "chef_portraits",
    description: "Professional portraits and candid shots of Chef Derin in various culinary settings.",
    slug: "chef-portraits",
    featured: false,
    order: 5,
    images: [
      "/images/documentary/Chef Derin + Eralimad + PP-115.jpg",
      "/images/documentary/Chef Derin + Eralimad + PP-123.jpg",
      "/images/documentary/Chef Derin + Eralimad + PP-124.jpg",
      "/images/documentary/Chef Derin + Eralimad + PP-128.jpg",
      "/images/documentary/Chef Derin + Eralimad + PP-134.jpg",
      "/images/documentary/IMG_7228.jpg",
      "/images/documentary/IMG_7328.jpg"
    ]
  }
];

async function seedGallery() {
  try {
    console.log('Starting gallery seeding...');

    // Check if galleries table exists
    const tableExists = await new Promise((resolve, reject) => {
      db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='galleries'", (err, row) => {
        if (err) reject(err);
        resolve(!!row);
      });
    });

    if (!tableExists) {
      console.log('Galleries table does not exist. Please run Strapi first to create the schema.');
      return;
    }

    // Clear existing gallery data
    await new Promise((resolve, reject) => {
      db.run("DELETE FROM galleries", (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    console.log('Cleared existing gallery data');

    // Insert new gallery data
    for (const gallery of galleryData) {
      const id = generateId();
      const now = new Date().toISOString();
      
      const insertQuery = `
        INSERT INTO galleries (
          id, title, category, description, slug, featured, "order", 
          event_date, location, photographer, tags, created_at, updated_at, published_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      await new Promise((resolve, reject) => {
        db.run(insertQuery, [
          id,
          gallery.title,
          gallery.category,
          gallery.description,
          gallery.slug,
          gallery.featured ? 1 : 0,
          gallery.order,
          gallery.eventDate || null,
          gallery.location || null,
          gallery.photographer || null,
          JSON.stringify(gallery.images || []),
          now,
          now,
          now
        ], (err) => {
          if (err) reject(err);
          else resolve();
        });
      });

      console.log(`✓ Created gallery: ${gallery.title}`);
    }

    console.log('Gallery seeding completed successfully!');
    console.log(`Created ${galleryData.length} gallery collections`);

  } catch (error) {
    console.error('Error seeding gallery:', error);
  } finally {
    db.close();
  }
}

// Run the seeding
seedGallery();