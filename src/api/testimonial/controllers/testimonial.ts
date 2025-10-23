'use strict';

/**
 * testimonial controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::testimonial.testimonial', ({ strapi }) => ({
  async find(ctx) {
    try {
      // Get query parameters
      const { 
        category, 
        featured, 
        limit = 10, 
        sort = 'order:asc,createdAt:desc' 
      } = ctx.query;

      // Build filters
      const filters: any = {
        isActive: true,
        publishedAt: { $notNull: true }
      };

      if (category) {
        filters.category = category;
      }

      if (featured !== undefined) {
        filters.featured = featured === 'true';
      }

      // Fetch testimonials
      const testimonials = await strapi.entityService.findMany('api::testimonial.testimonial', {
        filters,
        sort,
        limit: parseInt(limit as string),
        populate: {
          authorImage: {
            fields: ['url', 'alternativeText', 'width', 'height']
          }
        }
      });

      return ctx.send({
        data: testimonials,
        meta: {
          count: testimonials.length
        }
      });

    } catch (error) {
      strapi.log.error('Error fetching testimonials:', error);
      return ctx.internalServerError('Failed to fetch testimonials');
    }
  },

  async findOne(ctx) {
    try {
      const { id } = ctx.params;

      const testimonial = await strapi.entityService.findOne('api::testimonial.testimonial', id, {
        filters: {
          isActive: true,
          publishedAt: { $notNull: true }
        },
        populate: {
          authorImage: {
            fields: ['url', 'alternativeText', 'width', 'height']
          }
        }
      });

      if (!testimonial) {
        return ctx.notFound('Testimonial not found');
      }

      return ctx.send({
        data: testimonial
      });

    } catch (error) {
      strapi.log.error('Error fetching testimonial:', error);
      return ctx.internalServerError('Failed to fetch testimonial');
    }
  },

  // Custom endpoint for featured testimonials
  async featured(ctx) {
    try {
      const { limit = 5 } = ctx.query;

      const testimonials = await strapi.entityService.findMany('api::testimonial.testimonial', {
        filters: {
          isActive: true,
          featured: true,
          publishedAt: { $notNull: true }
        },
        sort: 'order:asc,createdAt:desc',
        limit: parseInt(limit as string),
        populate: {
          authorImage: {
            fields: ['url', 'alternativeText', 'width', 'height']
          }
        }
      });

      return ctx.send({
        data: testimonials,
        meta: {
          count: testimonials.length
        }
      });

    } catch (error) {
      strapi.log.error('Error fetching featured testimonials:', error);
      return ctx.internalServerError('Failed to fetch featured testimonials');
    }
  }
}));