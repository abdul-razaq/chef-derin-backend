#!/usr/bin/env node

/**
 * Fix Image Paths Migration Script
 * This script updates existing database records to remove /food/ from image paths
 */

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

async function fixImagePaths() {
  console.log('🔧 Starting image path migration...');
  
  try {
    // Get all gallery records
    const galleries = await new Promise((resolve, reject) => {
      db.all('SELECT * FROM galleries', (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
    
    console.log(`📊 Found ${galleries.length} gallery records to check`);
    
    for (const gallery of galleries) {
      if (gallery.images) {
        try {
          const images = JSON.parse(gallery.images);
          let hasChanges = false;
          
          // Fix image paths by removing /food/ subdirectory
          const fixedImages = images.map(imagePath => {
            if (imagePath.includes('/images/food/')) {
              hasChanges = true;
              const fixedPath = imagePath.replace('/images/food/', '/images/');
              console.log(`  🔄 Fixing: ${imagePath} → ${fixedPath}`);
              return fixedPath;
            }
            return imagePath;
          });
          
          // Update the record if changes were made
          if (hasChanges) {
            await new Promise((resolve, reject) => {
              db.run(
                'UPDATE galleries SET images = ? WHERE id = ?',
                [JSON.stringify(fixedImages), gallery.id],
                function(err) {
                  if (err) reject(err);
                  else resolve();
                }
              );
            });
            console.log(`  ✅ Updated gallery: ${gallery.title}`);
          } else {
            console.log(`  ⏭️  No changes needed for: ${gallery.title}`);
          }
        } catch (parseError) {
          console.error(`  ❌ Error parsing images for gallery ${gallery.id}:`, parseError.message);
        }
      }
    }
    
    // Also check for any other tables that might have image references
    console.log('\n🔍 Checking other tables for image references...');
    
    // Check home table
    const homeRecords = await new Promise((resolve, reject) => {
      db.all('SELECT * FROM homes', (err, rows) => {
        if (err && err.message.includes('no such table')) {
          resolve([]);
        } else if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
    
    for (const home of homeRecords) {
      // Check hero background image
      if (home.hero && typeof home.hero === 'string') {
        try {
          const heroData = JSON.parse(home.hero);
          if (heroData.backgroundImage && heroData.backgroundImage.includes('/images/food/')) {
            heroData.backgroundImage = heroData.backgroundImage.replace('/images/food/', '/images/');
            
            await new Promise((resolve, reject) => {
              db.run(
                'UPDATE homes SET hero = ? WHERE id = ?',
                [JSON.stringify(heroData), home.id],
                function(err) {
                  if (err) reject(err);
                  else resolve();
                }
              );
            });
            console.log(`  ✅ Updated home hero background image`);
          }
        } catch (parseError) {
          console.error(`  ❌ Error parsing hero data:`, parseError.message);
        }
      }
    }
    
    console.log('\n🎉 Image path migration completed successfully!');
    
  } catch (error) {
    console.error('❌ Error during migration:', error);
    throw error;
  } finally {
    db.close();
  }
}

// Run the migration
fixImagePaths().catch(error => {
  console.error('❌ Migration failed:', error);
  process.exit(1);
});