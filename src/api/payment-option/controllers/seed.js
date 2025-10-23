'use strict';

/**
 * Payment Options Seeding Controller
 * Provides API endpoint to seed payment options data
 */

const { seedPaymentOptions } = require('../services/seed-payment-options');

module.exports = {
  async seedPaymentOptions(ctx) {
    try {
      console.log('🚀 Payment options seeding endpoint called');
      
      const result = await seedPaymentOptions();
      
      if (result.success) {
        ctx.status = 200;
        ctx.body = {
          success: true,
          message: result.message,
          data: result.results,
          summary: result.summary
        };
      } else {
        ctx.status = 500;
        ctx.body = {
          success: false,
          message: 'Failed to seed payment options',
          error: result.error
        };
      }
      
    } catch (error) {
      console.error('❌ Payment options seeding controller error:', error);
      ctx.status = 500;
      ctx.body = {
        success: false,
        message: 'Internal server error during payment options seeding',
        error: error.message
      };
    }
  }
};