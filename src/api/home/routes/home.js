'use strict';

/**
 * home router
 */

module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/home',
      handler: 'home.find',
      config: {
        auth: false,
      },
    },
  ],
};