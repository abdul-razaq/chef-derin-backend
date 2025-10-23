'use strict';

/**
 * waiting-list router
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::waiting-list.waiting-list', {
  config: {
    create: {
      middlewares: ['api::waiting-list.rate-limit']
    }
  }
});