'use strict';

module.exports = {
  async find(ctx) {
    try {
      console.log('Custom home controller called');
      
      // Direct database query to get home data
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

      if (!results || results.length === 0) {
        console.log('No published home data found, trying without published filter');
        
        // Fallback: try without published filter
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

        if (!allResults || allResults.length === 0) {
          console.log('No home data found at all');
          return ctx.notFound('Home content not found');
        }

        console.log('Found unpublished home data:', JSON.stringify(allResults[0], null, 2));
        return ctx.send({
          data: allResults[0],
          meta: {}
        });
      }

      console.log('Found published home data:', JSON.stringify(results[0], null, 2));
      return ctx.send({
        data: results[0],
        meta: {}
      });
    } catch (error) {
      console.error('Error in custom home controller:', error);
      return ctx.internalServerError('Internal server error');
    }
  }
};