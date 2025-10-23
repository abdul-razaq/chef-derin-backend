'use strict';

/**
 * home service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::home.home', ({ strapi }) => ({
  async findSingleType() {
    try {
      // Try to find the published home content using different approaches
      
      // Approach 1: Use db.query to find published content
      const results = await strapi.db.query('api::home.home').findMany({
        where: { 
          publishedAt: { $notNull: true } 
        },
        populate: {
          hero: {
            populate: true
          },
          testimonial: {
            populate: true
          },
          services: {
            populate: true
          },
          resume: {
            populate: true
          },
          newsletter: {
            populate: true
          },
          seo: {
            populate: true
          }
        }
      });

      if (results && results.length > 0) {
        return results[0];
      }

      // Approach 2: Try without published filter as fallback
      const allResults = await strapi.db.query('api::home.home').findMany({
        populate: {
          hero: {
            populate: true
          },
          testimonial: {
            populate: true
          },
          services: {
            populate: true
          },
          resume: {
            populate: true
          },
          newsletter: {
            populate: true
          },
          seo: {
            populate: true
          }
        }
      });

      return allResults && allResults.length > 0 ? allResults[0] : null;
    } catch (error) {
      console.error('Error in home service:', error);
      throw error;
    }
  }
}));