'use strict';

module.exports = (config, { strapi }) => {
  return async (ctx, next) => {
    // Intercept requests to /api/home
    if (ctx.request.url.startsWith('/api/home')) {
      try {
        console.log('Home middleware intercepted request:', ctx.request.url);
        
        // Direct database query to get home data
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
          console.log('Found published home data via middleware');
          ctx.body = {
            data: results[0],
            meta: {}
          };
          return;
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
          console.log('Found unpublished home data via middleware');
          ctx.body = {
            data: allResults[0],
            meta: {}
          };
          return;
        }

        console.log('No home data found via middleware');
        ctx.status = 404;
        ctx.body = {
          data: null,
          error: {
            status: 404,
            name: 'NotFoundError',
            message: 'Home content not found',
            details: {}
          }
        };
        return;
      } catch (error) {
        console.error('Error in home middleware:', error);
        ctx.status = 500;
        ctx.body = {
          data: null,
          error: {
            status: 500,
            name: 'InternalServerError',
            message: 'Internal server error',
            details: {}
          }
        };
        return;
      }
    }

    // Continue to next middleware for other requests
    await next();
  };
};