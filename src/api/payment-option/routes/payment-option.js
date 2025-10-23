'use strict';

/**
 * payment-option router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

const defaultRouter = createCoreRouter('api::payment-option.payment-option');

const customRoutes = {
  routes: [
    {
      method: 'POST',
      path: '/payment-options/seed',
      handler: 'seed.seedPaymentOptions',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};

module.exports = {
  routes: [
    ...defaultRouter.routes,
    ...customRoutes.routes,
  ],
};