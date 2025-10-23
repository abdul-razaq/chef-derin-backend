/**
 * gallery controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::gallery.gallery', ({ strapi }) => ({
  // Get galleries by category
  async findByCategory(ctx) {
    const { category } = ctx.params;
    
    try {
      const galleries = await strapi.db.query('api::gallery.gallery').findMany({
        where: { category },
        orderBy: { order: 'asc' },
        populate: ['images', 'videos', 'featuredImage']
      });

      return { data: galleries };
    } catch (error) {
      ctx.throw(500, 'Failed to fetch galleries by category');
    }
  },

  // Get featured galleries
  async findFeatured(ctx) {
    try {
      const galleries = await strapi.db.query('api::gallery.gallery').findMany({
        where: { featured: true },
        orderBy: { order: 'asc' },
        populate: ['images', 'videos', 'featuredImage']
      });

      return { data: galleries };
    } catch (error) {
      ctx.throw(500, 'Failed to fetch featured galleries');
    }
  },

  // Get gallery by slug
  async findBySlug(ctx) {
    const { slug } = ctx.params;
    
    try {
      const gallery = await strapi.db.query('api::gallery.gallery').findOne({
        where: { slug },
        populate: ['images', 'videos', 'featuredImage']
      });

      if (!gallery) {
        return ctx.notFound('Gallery not found');
      }

      return { data: gallery };
    } catch (error) {
      ctx.throw(500, 'Failed to fetch gallery by slug');
    }
  },

  // Override default find to include populate
  async find(ctx) {
    const { query } = ctx;
    
    const galleries = await strapi.db.query('api::gallery.gallery').findMany({
      ...query,
      populate: ['images', 'videos', 'featuredImage'],
      orderBy: { order: 'asc' }
    });

    return { data: galleries };
  },

  async getHomeData(ctx) {
    try {
      console.log('Getting home data via custom endpoint...');
      
      // Try to find published home content first
      const homeData = await strapi.db.query('api::home.home').findMany({
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
                  socialNetwork: true,
                  image: true
                }
              },
              keywords: true
            }
          }
        }
      });

      console.log('Found published home data:', homeData ? homeData.length : 0, 'records');

      if (homeData && homeData.length > 0) {
        return { data: homeData[0] };
      }

      // If no data found, try without any filters
      const allHomeData = await strapi.db.query('api::home.home').findMany({
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
                  socialNetwork: true,
                  image: true
                }
              },
              keywords: true
            }
          }
        }
      });

      console.log('Found all home data:', allHomeData ? allHomeData.length : 0, 'records');

      if (allHomeData && allHomeData.length > 0) {
        return { data: allHomeData[0] };
      }

      return { data: null, message: 'No home content found' };

    } catch (error) {
      console.error('Error in getHomeData:', error);
      ctx.status = 500;
      return { error: 'Internal server error', details: error.message };
    }
  },

  async getAboutData(ctx) {
    try {
      console.log('Getting about data via custom endpoint...');
      
      const aboutData = await strapi.entityService.findOne('api::about.about', 1, {
        populate: '*'
      });
      
      if (!aboutData) {
        return ctx.notFound('About data not found');
      }
      
      ctx.body = aboutData;
    } catch (error) {
      console.error('Error fetching about data:', error);
      ctx.internalServerError('Failed to fetch about data');
    }
  },

  async getServicesData(ctx) {
    try {
      console.log('Getting services data via custom endpoint...');
      
      const servicesData = await strapi.entityService.findMany('api::service.service', {
        populate: '*',
        sort: { createdAt: 'desc' }
      });
      
      ctx.body = servicesData;
    } catch (error) {
      console.error('Error fetching services data:', error);
      ctx.internalServerError('Failed to fetch services data');
    }
  },

  async getGalleryData(ctx) {
    try {
      console.log('Getting gallery data via custom endpoint...');
      
      const galleryData = await strapi.entityService.findMany('api::gallery.gallery', {
        populate: '*',
        sort: { createdAt: 'desc' }
      });
      
      ctx.body = galleryData;
    } catch (error) {
      console.error('Error fetching gallery data:', error);
      ctx.internalServerError('Failed to fetch gallery data');
    }
  },

  async getContactData(ctx) {
    try {
      console.log('Getting contact data via custom endpoint...');
      
      // For contact, we might want to return contact info/settings
      // Since contact is mainly a form, we'll return basic contact info
      const contactData = {
        title: "Get In Touch",
        subtitle: "Let's create something extraordinary together",
        email: "hello@chefderin.com",
        phone: "+27 123 456 789",
        address: "Cape Town, South Africa",
        socialMedia: {
          instagram: "@chefderin",
          linkedin: "chef-derin",
          twitter: "@chefderin"
        }
      };
      
      ctx.body = contactData;
    } catch (error) {
      console.error('Error fetching contact data:', error);
      ctx.internalServerError('Failed to fetch contact data');
    }
  },

  async getDocumentaryData(ctx) {
    try {
      console.log('Getting documentary data via custom endpoint...');
      
      const documentaryData = await strapi.entityService.findOne('api::documentary.documentary', 1, {
        populate: '*'
      });
      
      if (!documentaryData) {
        return ctx.notFound('Documentary data not found');
      }
      
      ctx.body = documentaryData;
    } catch (error) {
      console.error('Error fetching documentary data:', error);
      ctx.internalServerError('Failed to fetch documentary data');
    }
  },

  async getRecipeBooksData(ctx) {
    try {
      console.log('Getting recipe books data via custom endpoint...');
      
      const recipeBooksData = await strapi.entityService.findMany('api::recipe-book.recipe-book', {
        populate: '*',
        sort: { createdAt: 'desc' }
      });
      
      ctx.body = recipeBooksData;
    } catch (error) {
      console.error('Error fetching recipe books data:', error);
      ctx.internalServerError('Failed to fetch recipe books data');
    }
  }
}));