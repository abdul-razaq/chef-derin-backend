export default {
  email: {
    config: {
      provider: 'sendmail',
      providerOptions: {
        dkim: false,
      },
      settings: {
        defaultFrom: 'chefderinbookings@gmail.com',
        defaultReplyTo: 'chefderinbookings@gmail.com',
      },
    },
  },
};