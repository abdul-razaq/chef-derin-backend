'use strict';

module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/custom-home',
      handler: 'custom-home.find',
      config: {
        auth: false,
      },
    },
  ],
};