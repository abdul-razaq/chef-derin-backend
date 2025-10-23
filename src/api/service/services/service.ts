/**
 * service service
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreService('api::service.service', ({ strapi }) => ({
  /**
   * Find active services
   */
  async findActive(params: any = {}) {
    const { filters = {}, ...otherParams } = params;
    
    return await strapi.entityService.findMany('api::service.service', {
      filters: {
        ...filters,
        publishedAt: { $notNull: true }
      },
      populate: {
        featuredImage: {
          fields: ['url', 'alternativeText', 'caption']
        }
      },
      ...otherParams
    });
  },

  /**
   * Find featured services
   */
  async findFeatured(limit = 3, sort: any = 'order:asc') {
    return await strapi.entityService.findMany('api::service.service', {
      filters: {
        featured: true,
        publishedAt: { $notNull: true }
      },
      sort,
      pagination: {
        limit
      },
      populate: {
        featuredImage: {
          fields: ['url', 'alternativeText', 'caption']
        }
      }
    });
  },

  /**
   * Find services by type
   */
  async findByType(type: any, limit = 10) {
    return await strapi.entityService.findMany('api::service.service', {
      filters: {
        type,
        publishedAt: { $notNull: true }
      },
      sort: 'order:asc',
      pagination: {
        limit
      },
      populate: {
        featuredImage: {
          fields: ['url', 'alternativeText', 'caption']
        }
      }
    });
  }
}));