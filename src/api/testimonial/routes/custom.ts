'use strict';

/**
 * Custom testimonial routes
 */

export default {
  routes: [
    {
      method: 'GET',
      path: '/testimonials/featured',
      handler: 'testimonial.featured',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};