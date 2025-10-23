/**
 * Booking Controller
 * Handles ORISUN dining bookings with Stripe payment integration
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::booking.booking', ({ strapi }) => ({
  
  /**
   * Override the default create method to handle payment processing
   */
  async create(ctx, next) {
    const { action } = ctx.request.body;
    
    // Check if this is a payment intent request
    if (action === 'create-payment-intent') {
      return await this.createPaymentIntent(ctx, next);
    }
    
    // Check if this is a payment confirmation request
    if (action === 'confirm-payment') {
      return await this.confirmPayment(ctx, next);
    }
    
    // Otherwise, proceed with normal booking creation
    return await this.createBooking(ctx, next);
  },
  
  /**
   * Create a payment intent for booking
   */
  async createPaymentIntent(ctx, next) {
    try {
      const { amount, currency, customerEmail, customerName, eventTitle, bookingReference } = ctx.request.body;
      
      // Validate required fields
      if (!amount || !currency || !customerEmail || !customerName) {
        return ctx.badRequest('Missing required payment information');
      }
      
      // Get the Stripe service
      const stripeService = strapi.service('api::booking.stripe-service');
      
      // Validate Nigerian payment amounts
      if (currency.toUpperCase() === 'NGN') {
        const validation = stripeService.validateNigerianAmount(amount);
        if (!validation.valid) {
          return ctx.badRequest(validation.error);
        }
      }
      
      const paymentData = {
        amount,
        currency,
        customerEmail,
        customerName,
        eventTitle,
        bookingReference: bookingReference || `ORISUN-${Date.now()}`
      };
      
      const result = await stripeService.createPaymentIntent(paymentData);
      
      if (result.success) {
        ctx.body = {
          success: true,
          clientSecret: result.clientSecret,
          paymentIntentId: result.paymentIntentId,
          amount: result.amount,
          currency: result.currency
        };
      } else {
        ctx.status = 500;
        ctx.body = {
          success: false,
          error: result.error
        };
      }
      
    } catch (error) {
      console.error('Payment Intent Creation Error:', error);
      ctx.status = 500;
      ctx.body = {
        success: false,
        error: 'Failed to create payment intent'
      };
    }
  },
  
  /**
   * Create a new booking with payment processing
   */
  async createBooking(ctx, next) {
    try {
      const bookingData = ctx.request.body.data || ctx.request.body;
      
      // Validate required fields
      const requiredFields = ['customerName', 'customerEmail', 'customerPhone', 'numberOfGuests', 'totalAmount', 'diningEvent'];
      const missingFields = requiredFields.filter(field => !bookingData[field]);
      
      if (missingFields.length > 0) {
        return ctx.badRequest(`Missing required fields: ${missingFields.join(', ')}`);
      }
      
      // Generate booking reference if not provided
      if (!bookingData.bookingReference) {
        bookingData.bookingReference = `ORISUN-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      }
      
      // Set default values
      bookingData.bookingDate = new Date();
      bookingData.paymentStatus = bookingData.paymentStatus || 'pending';
      bookingData.bookingStatus = bookingData.bookingStatus || 'pending';
      bookingData.currency = bookingData.currency || 'USD';
      
      // Create the booking
      const booking = await strapi.documents('api::booking.booking').create({
        data: bookingData
      });
      
      // Publish the booking
      await strapi.documents('api::booking.booking').publish({
        documentId: booking.documentId
      });

      // Create payment intent for the booking
      let paymentData = null;
      try {
        const stripeService = strapi.service('api::booking.stripe-service');
        const paymentIntentData = {
          amount: bookingData.totalAmount,
          currency: bookingData.currency,
          customerEmail: bookingData.customerEmail,
          customerName: bookingData.customerName,
          eventTitle: `Booking ${bookingData.bookingReference}`,
          bookingReference: bookingData.bookingReference
        };

        const paymentResult = await stripeService.createPaymentIntent(paymentIntentData);
        if (paymentResult.success) {
          paymentData = {
            clientSecret: paymentResult.clientSecret,
            paymentIntentId: paymentResult.paymentIntentId,
            amount: paymentResult.amount,
            currency: paymentResult.currency
          };
        }
      } catch (paymentError) {
        console.log('Payment intent creation failed, but booking was created:', paymentError);
      }
      
      ctx.body = {
        success: true,
        booking: booking,
        payment: paymentData,
        message: 'Booking created successfully'
      };
      
    } catch (error) {
      console.error('Booking Creation Error:', error);
      ctx.status = 500;
      ctx.body = {
        success: false,
        error: 'Failed to create booking'
      };
    }
  },
  
  /**
   * Confirm payment and update booking status
   */
  async confirmPayment(ctx, next) {
    try {
      const { paymentIntentId, bookingId } = ctx.request.body;
      
      if (!paymentIntentId || !bookingId) {
        return ctx.badRequest('Missing payment intent ID or booking ID');
      }
      
      // Get the Stripe service
      const stripeService = strapi.service('api::booking.stripe-service');
      
      // Confirm payment with Stripe
      const paymentResult = await stripeService.confirmPayment(paymentIntentId);
      
      if (paymentResult.success && paymentResult.status === 'succeeded') {
        // Find the booking first
        const booking = await strapi.documents('api::booking.booking').findFirst({
          filters: { documentId: bookingId }
        });
        
        if (!booking) {
          return ctx.badRequest('Booking not found');
        }
        
        // Update booking status
        const updatedBooking = await strapi.documents('api::booking.booking').update({
          documentId: bookingId,
          data: {
            paymentStatus: 'completed',
            bookingStatus: 'confirmed',
            stripePaymentIntentId: paymentIntentId
          }
        });
        
        ctx.body = {
          success: true,
          booking: updatedBooking,
          paymentStatus: paymentResult.status,
          message: 'Payment confirmed and booking updated'
        };
      } else {
        ctx.status = 400;
        ctx.body = {
          success: false,
          error: 'Payment confirmation failed',
          details: paymentResult.error
        };
      }
      
    } catch (error) {
      console.error('Payment Confirmation Error:', error);
      ctx.status = 500;
      ctx.body = {
        success: false,
        error: 'Failed to confirm payment'
      };
    }
  }
  
}));