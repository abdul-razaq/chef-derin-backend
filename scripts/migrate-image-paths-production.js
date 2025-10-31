#!/usr/bin/env node

/**
 * Production Image Paths Migration Script
 * This script uses Strapi's API to update image paths in production
 * Works with any database type (SQLite, PostgreSQL, MySQL)
 */

const axios = require('axios');
require('dotenv').config();

// Configuration
const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const API_TOKEN = process.env.STRAPI_API_TOKEN; // You'll need to set this in production

if (!API_TOKEN) {
  console.error('❌ STRAPI_API_TOKEN environment variable is required');
  console.log('💡 Create an API token in Strapi Admin > Settings > API Tokens');
  process.exit(1);
}

const api = axios.create({
  baseURL: `${STRAPI_URL}/api`,
  headers: {
    'Authorization': `Bearer ${API_TOKEN}`,
    'Content-Type': 'application/json'
  }
});

async function migrateImagePaths() {
  console.log('🔧 Starting production image path migration...');
  console.log(`📡 Connecting to: ${STRAPI_URL}`);
  
  try {
    // Get all gallery records
    const response = await api.get('/galleries?populate=*');
    const galleries = response.data.data;
    
    console.log(`📊 Found ${galleries.length} gallery records to check`);
    
    let updatedCount = 0;
    
    for (const gallery of galleries) {
      const { id, attributes } = gallery;
      let hasChanges = false;
      let updatedData = { ...attributes };
      
      // Check and fix images array
      if (attributes.images && Array.isArray(attributes.images)) {
        const fixedImages = attributes.images.map(imagePath => {
          if (typeof imagePath === 'string' && imagePath.includes('/images/food/')) {
            hasChanges = true;
            const fixedPath = imagePath.replace('/images/food/', '/images/');
            console.log(`  🔄 Fixing: ${imagePath} → ${fixedPath}`);
            return fixedPath;
          }
          return imagePath;
        });
        
        if (hasChanges) {
          updatedData.images = fixedImages;
        }
      }
      
      // Check and fix tags array (if it contains image paths)
      if (attributes.tags && Array.isArray(attributes.tags)) {
        const fixedTags = attributes.tags.map(tag => {
          if (typeof tag === 'string' && tag.includes('/images/food/')) {
            hasChanges = true;
            const fixedPath = tag.replace('/images/food/', '/images/');
            console.log(`  🔄 Fixing tag: ${tag} → ${fixedPath}`);
            return fixedPath;
          }
          return tag;
        });
        
        if (hasChanges) {
          updatedData.tags = fixedTags;
        }
      }
      
      // Update the record if changes were made
      if (hasChanges) {
        try {
          await api.put(`/galleries/${id}`, { data: updatedData });
          console.log(`  ✅ Updated gallery: ${attributes.title}`);
          updatedCount++;
        } catch (updateError) {
          console.error(`  ❌ Error updating gallery ${id}:`, updateError.response?.data || updateError.message);
        }
      } else {
        console.log(`  ⏭️  No changes needed for: ${attributes.title}`);
      }
    }
    
    console.log(`\n🎉 Image path migration completed successfully!`);
    console.log(`📈 Updated ${updatedCount} out of ${galleries.length} galleries`);
    console.log('\n📋 Next steps:');
    console.log('1. Verify that images are loading correctly on your website');
    console.log('2. Check the gallery pages for any remaining 404 errors');
    console.log('3. Clear any CDN cache if you\'re using one');
    
  } catch (error) {
    console.error('❌ Error during migration:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      console.log('💡 Check your STRAPI_API_TOKEN - it may be invalid or expired');
    } else if (error.response?.status === 403) {
      console.log('💡 Your API token may not have permission to read/write galleries');
    }
    
    throw error;
  }
}

// Run the migration
migrateImagePaths().catch(error => {
  console.error('❌ Migration failed:', error.message);
  process.exit(1);
});