/**
 * service controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::service.service', ({ strapi }) => ({
  /**
   * Find services with filtering options
   */
  async find(ctx) {
    const { query } = ctx;
    
    // Extract custom query parameters
    const { type, featured, limit, sort = 'order:asc' } = query;
    
    // Build filters
    const filters: any = {
      publishedAt: { $notNull: true }
    };
    
    if (type) {
      filters.type = type;
    }
    
    if (featured !== undefined) {
      filters.featured = featured === 'true';
    }
    
    // Build query parameters
    const queryParams: any = {
      filters,
      sort: sort,
      populate: {
        featuredImage: {
          fields: ['url', 'alternativeText', 'caption']
        },
        gallery: {
          fields: ['url', 'alternativeText', 'caption']
        }
      }
    };
    
    if (limit) {
      queryParams.pagination = {
        limit: parseInt(limit as string, 10)
      };
    }
    
    const data = await strapi.entityService.findMany('api::service.service', queryParams);
    
    return { data };
  },

  /**
   * Find one service by ID
   */
  async findOne(ctx) {
    const { id } = ctx.params;
    
    const entity = await strapi.entityService.findOne('api::service.service', id, {
      populate: {
        featuredImage: {
          fields: ['url', 'alternativeText', 'caption']
        },
        gallery: {
          fields: ['url', 'alternativeText', 'caption']
        }
      }
    });
    
    return { data: entity };
  },

  /**
   * Get featured services
   */
  async featured(ctx) {
    const { limit = 3 } = ctx.query;
    
    const data = await strapi.entityService.findMany('api::service.service', {
      filters: {
        featured: true,
        publishedAt: { $notNull: true }
      },
      sort: 'order:asc',
      pagination: {
        limit: parseInt(limit as string, 10)
      },
      populate: {
        featuredImage: {
          fields: ['url', 'alternativeText', 'caption']
        }
      }
    });
    
    return { data };
  }
}));