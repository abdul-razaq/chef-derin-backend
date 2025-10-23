'use strict';

module.exports = {
  async find(ctx) {
    try {
      console.log('Home-data controller called');
      
      // Direct database query to get home data with deep population
      const results = await strapi.db.query('api::home.home').findMany({
        where: { 
          publishedAt: { $notNull: true } 
        },
        populate: {
          hero: {
            populate: {
              backgroundImage: true,
              ctaButton: true
            }
          },
          testimonial: {
            populate: {
              image: true,
              author: true
            }
          },
          services: {
            populate: {
              services: {
                populate: {
                  icon: true,
                  image: true
                }
              }
            }
          },
          resume: {
            populate: {
              downloadFile: true,
              previewImage: true
            }
          },
          newsletter: {
            populate: true
          },
          seo: {
            populate: {
              metaImage: true,
              metaSocial: {
                populate: {
                  image: true
                }
              }
            }
          }
        }
      });

      if (results && results.length > 0) {
        console.log('Found published home data');
        return ctx.send({
          data: results[0],
          meta: {}
        });
      }

      // Fallback: try without published filter
      console.log('No published data found, trying without published filter');
      const allResults = await strapi.db.query('api::home.home').findMany({
        populate: {
          hero: {
            populate: {
              backgroundImage: true,
              ctaButton: true
            }
          },
          testimonial: {
            populate: {
              image: true,
              author: true
            }
          },
          services: {
            populate: {
              services: {
                populate: {
                  icon: true,
                  image: true
                }
              }
            }
          },
          resume: {
            populate: {
              downloadFile: true,
              previewImage: true
            }
          },
          newsletter: {
            populate: true
          },
          seo: {
            populate: {
              metaImage: true,
              metaSocial: {
                populate: {
                  image: true
                }
              }
            }
          }
        }
      });

      if (allResults && allResults.length > 0) {
        console.log('Found unpublished home data');
        return ctx.send({
          data: allResults[0],
          meta: {}
        });
      }

      console.log('No home data found at all');
      return ctx.notFound('Home content not found');
    } catch (error) {
      console.error('Error in home-data controller:', error);
      return ctx.internalServerError('Internal server error');
    }
  }
};