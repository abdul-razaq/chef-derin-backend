'use strict';

/**
 * testimonial service
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreService('api::testimonial.testimonial', ({ strapi }) => ({
  async findActive(params: any = {}) {
    return await strapi.entityService.findMany('api::testimonial.testimonial', {
      ...params,
      filters: {
        ...(params.filters || {}),
        isActive: true,
        publishedAt: { $notNull: true }
      },
      populate: {
        authorImage: {
          fields: ['url', 'alternativeText', 'width', 'height']
        }
      }
    });
  },

  async findFeatured(limit = 5) {
    return await strapi.entityService.findMany('api::testimonial.testimonial', {
      filters: {
        isActive: true,
        featured: true,
        publishedAt: { $notNull: true }
      },
      sort: 'order:asc,createdAt:desc',
      limit,
      populate: {
        authorImage: {
          fields: ['url', 'alternativeText', 'width', 'height']
        }
      }
    });
  },

  async findByCategory(category: any, limit = 10) {
    return await strapi.entityService.findMany('api::testimonial.testimonial', {
      filters: {
        isActive: true,
        category,
        publishedAt: { $notNull: true }
      },
      sort: 'order:asc,createdAt:desc',
      limit,
      populate: {
        authorImage: {
          fields: ['url', 'alternativeText', 'width', 'height']
        }
      }
    });
  }
}));