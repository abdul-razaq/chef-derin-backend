'use strict';

module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/home-data',
      handler: 'home-data.find',
      config: {
        auth: false,
      },
    },
  ],
};