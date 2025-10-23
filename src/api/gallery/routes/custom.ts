/**
 * Custom gallery routes
 */

export default {
  routes: [
    {
      method: 'GET',
      path: '/galleries/home-data',
      handler: 'gallery.getHomeData',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/galleries/about-data',
      handler: 'gallery.getAboutData',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/galleries/services-data',
      handler: 'gallery.getServicesData',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/galleries/gallery-data',
      handler: 'gallery.getGalleryData',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/galleries/contact-data',
      handler: 'gallery.getContactData',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/galleries/documentary-data',
      handler: 'gallery.getDocumentaryData',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/galleries/recipe-books-data',
      handler: 'gallery.getRecipeBooksData',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
  ],
};