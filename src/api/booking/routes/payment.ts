/**
 * Payment Routes
 * Custom routes for Stripe payment integration
 */

export default {
  routes: [
    {
      method: 'POST',
      path: '/bookings/create-payment-intent',
      handler: 'booking.createPaymentIntent',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/bookings/create-booking',
      handler: 'booking.createBooking',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/bookings/confirm-payment',
      handler: 'booking.confirmPayment',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};