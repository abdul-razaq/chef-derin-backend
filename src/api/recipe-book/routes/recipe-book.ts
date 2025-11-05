export default {
  routes: [
    {
      method: 'GET',
      path: '/recipe-books',
      handler: 'recipe-book.find',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/recipe-books/:id',
      handler: 'recipe-book.findOne',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/recipe-books',
      handler: 'recipe-book.create',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/recipe-books/create-payment-intent',
      handler: 'recipe-book.createPaymentIntent',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/recipe-books/confirm-payment',
      handler: 'recipe-book.confirmPayment',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/recipe-books/generate-download',
      handler: 'recipe-book.generateDownload',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/recipe-books/confirm-crypto-payment',
      handler: 'recipe-book.confirmCryptoPayment',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/recipe-books/confirm-bank-payment',
      handler: 'recipe-book.confirmBankPayment',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};