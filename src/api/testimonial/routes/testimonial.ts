'use strict';

/**
 * testimonial router
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::testimonial.testimonial', {
  config: {
    find: {
      middlewares: [],
    },
    findOne: {
      middlewares: [],
    },
  },
});