export default {
  routes: [
    {
      method: 'GET',
      path: '/services/featured',
      handler: 'service.featured',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};