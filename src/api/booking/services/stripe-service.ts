'use strict';

/**
 * Stripe Payment Service for ORISUN Dining
 * Handles payment processing with multi-currency support
 */

import Stripe from 'stripe';

// Initialize Stripe
const isDevelopment = process.env.NODE_ENV === 'development';
const isTestKey = process.env.STRIPE_SECRET_KEY?.startsWith('sk_test_') || !process.env.STRIPE_SECRET_KEY;

let stripe: Stripe | null = null;

if (process.env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-09-30.clover' as any,
  });
}

interface BookingData {
  amount: number;
  currency: string;
  customerEmail: string;
  customerName: string;
  eventTitle?: string;
  bookingReference: string;
}

interface CustomerData {
  email: string;
  name: string;
  phone?: string;
}

interface PaymentResult {
  success: boolean;
  clientSecret?: string;
  paymentIntentId?: string;
  amount?: number;
  currency?: string;
  error?: string;
}

interface PaymentConfirmationResult {
  success: boolean;
  status?: string;
  paymentIntent?: Stripe.PaymentIntent;
  error?: string;
}

interface CustomerResult {
  success: boolean;
  customerId?: string;
  customer?: Stripe.Customer;
  error?: string;
}

export default {
  
  /**
   * Create a payment intent for a dining booking
   */
  async createPaymentIntent(bookingData: BookingData): Promise<PaymentResult> {
    try {
      const { amount, currency, customerEmail, customerName, eventTitle, bookingReference } = bookingData;
      
      // For NGN, the frontend already sends the amount in kobo, so no conversion needed
      // For other currencies, convert to smallest unit
      let amountInCents;
      if (currency.toLowerCase() === 'ngn') {
        // Frontend already converted NGN to kobo, validate the original amount
        const amountInNaira = amount / 100;
        this.validateNigerianAmount(amountInNaira);
        amountInCents = amount; // Already in kobo
      } else {
        // Convert other currencies to smallest unit (cents)
        amountInCents = this.convertToSmallestUnit(amount, currency);
      }
      
      // Handle mock mode for development (only when no Stripe instance)
      if (!stripe) {
        console.log('Using mock Stripe payment intent for development');
        // Generate mock payment intent ID following proper Stripe format: pi_1{random_string}
        const timestamp = Date.now().toString();
        const randomString = Math.random().toString(36).substring(2, 15);
        const mockPaymentIntentId = `pi_1${timestamp.slice(-6)}${randomString}`;
        const mockClientSecret = `${mockPaymentIntentId}_secret_${Math.random().toString(36).substring(2, 18)}`;
        
        return {
          success: true,
          paymentIntentId: mockPaymentIntentId,
          clientSecret: mockClientSecret,
          amount: amountInCents,
          currency: currency.toLowerCase(),
        };
      }
      
      // For NGN in test mode, use mock payment to bypass Stripe limitations
      if (currency.toLowerCase() === 'ngn' && isTestKey) {
        console.log('Using mock payment for NGN in test mode');
        
        // Frontend already sends amount in kobo, validate the original amount in Naira
        const amountInNaira = amount / 100;
        this.validateNigerianAmount(amountInNaira);
        
        // Amount is already in kobo from frontend
        const amountInKobo = amount;
        
        // Return a mock payment intent for testing
        const mockPaymentIntentId = `pi_mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const mockSecret = Math.random().toString(36).substr(2, 16);
        const mockClientSecret = `${mockPaymentIntentId}_secret_${mockSecret}`;
        
        console.log('Mock Payment Intent created for NGN test:', {
          id: mockPaymentIntentId,
          amount: amountInKobo,
          currency: 'ngn',
          status: 'requires_payment_method',
          amountInNaira: amountInNaira
        });

        return {
          success: true,
          clientSecret: mockClientSecret,
          paymentIntentId: mockPaymentIntentId,
          amount: amountInKobo,
          currency: 'ngn'
        };
      }
      
      // Configure payment methods based on currency
      const paymentMethodTypes = ['card'];
      const automaticPaymentMethods: any = { enabled: true };
      
      // For production NGN, add Nigerian payment methods
      if (currency.toLowerCase() === 'ngn' && !isTestKey) {
        // Only add Nigerian payment methods in production with live keys
        paymentMethodTypes.push('ng_card', 'ng_bank_transfer');
        automaticPaymentMethods.enabled = false;
        automaticPaymentMethods.allow_redirects = 'always';
      }

      const paymentIntentData = {
        amount: amountInCents,
        currency: currency.toLowerCase(),
        payment_method_types: paymentMethodTypes,
        metadata: {
          booking_reference: bookingReference,
          customer_name: customerName,
          event_title: eventTitle || 'ORISUN Dining',
          service: 'orisun_dining',
          currency_original: currency.toUpperCase()
        },
        description: `ORISUN Dining - ${eventTitle || 'Private Dining Experience'}`,
        receipt_email: customerEmail,
        automatic_payment_methods: automaticPaymentMethods,
      };

      console.log('Creating Stripe Payment Intent with data:', JSON.stringify(paymentIntentData, null, 2));
      
      const paymentIntent = await stripe.paymentIntents.create(paymentIntentData);
      
      return {
        success: true,
        clientSecret: paymentIntent.client_secret || undefined,
        paymentIntentId: paymentIntent.id,
        amount: amountInCents,
        currency: currency.toLowerCase()
      };
      
    } catch (error: any) {
      console.error('Stripe Payment Intent Error Details:');
      console.error('Error message:', error.message);
      console.error('Error type:', error.type);
      console.error('Error code:', error.code);
      console.error('Error param:', error.param);
      console.error('Full error:', error);
      
      return {
        success: false,
        error: error.message || 'Failed to create payment intent'
      };
    }
  },
  
  /**
   * Confirm a payment intent
   */
  async confirmPayment(paymentIntentId: string): Promise<PaymentConfirmationResult> {
    try {
      // Handle mock mode for development (only when no Stripe instance)
      if (!stripe) {
        console.log('Using mock Stripe payment confirmation for development');
        return {
          success: true,
          status: 'succeeded',
          paymentIntent: {
            id: paymentIntentId,
            status: 'succeeded',
            amount: 1200,
            currency: 'zar'
          } as any
        };
      }
      
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      
      return {
        success: true,
        status: paymentIntent.status,
        paymentIntent: paymentIntent
      };
      
    } catch (error: any) {
      console.error('Stripe Payment Confirmation Error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },
  
  /**
   * Create a customer in Stripe
   */
  async createCustomer(customerData: CustomerData): Promise<CustomerResult> {
    try {
      const { email, name, phone } = customerData;
      
      const customer = await stripe.customers.create({
        email: email,
        name: name,
        phone: phone,
        metadata: {
          service: 'orisun_dining'
        }
      });
      
      return {
        success: true,
        customerId: customer.id,
        customer: customer
      };
      
    } catch (error: any) {
      console.error('Stripe Customer Creation Error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },
  
  /**
   * Handle Stripe webhook events
   */
  async handleWebhook(event: Stripe.Event) {
    try {
      switch (event.type) {
        case 'payment_intent.succeeded':
          await this.handlePaymentSuccess(event.data.object as Stripe.PaymentIntent);
          break;
        case 'payment_intent.payment_failed':
          await this.handlePaymentFailure(event.data.object as Stripe.PaymentIntent);
          break;
        default:
          console.log(`Unhandled event type: ${event.type}`);
      }
      
      return { success: true };
      
    } catch (error: any) {
      console.error('Webhook handling error:', error);
      return { success: false, error: error.message };
    }
  },
  
  /**
   * Handle successful payment
   */
  async handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
    try {
      const bookingReference = paymentIntent.metadata.booking_reference;
      
      if (bookingReference) {
        // Find and update the booking
        const bookings = await strapi.documents('api::booking.booking').findMany({
          filters: { bookingReference: bookingReference }
        });
        
        if (bookings.length > 0) {
          await strapi.documents('api::booking.booking').update({
            documentId: bookings[0].documentId,
            data: {
              paymentStatus: 'completed',
              bookingStatus: 'confirmed',
              stripePaymentIntentId: paymentIntent.id
            }
          });
          
          console.log(`Payment successful for booking: ${bookingReference}`);
        }
      }
      
    } catch (error) {
      console.error('Error handling payment success:', error);
    }
  },
  
  /**
   * Handle failed payment
   */
  async handlePaymentFailure(paymentIntent: Stripe.PaymentIntent) {
    try {
      const bookingReference = paymentIntent.metadata.booking_reference;
      
      if (bookingReference) {
        // Find and update the booking
        const bookings = await strapi.documents('api::booking.booking').findMany({
          filters: { bookingReference: bookingReference }
        });
        
        if (bookings.length > 0) {
          await strapi.documents('api::booking.booking').update({
            documentId: bookings[0].documentId,
            data: {
              paymentStatus: 'failed',
              bookingStatus: 'cancelled'
            }
          });
          
          console.log(`Payment failed for booking: ${bookingReference}`);
        }
      }
      
    } catch (error) {
      console.error('Error handling payment failure:', error);
    }
  },
  
  /**
   * Convert amount to smallest currency unit
   */
  convertToSmallestUnit(amount: number, currency: string): number {
    const zeroDecimalCurrencies = ['BIF', 'CLP', 'DJF', 'GNF', 'JPY', 'KMF', 'KRW', 'MGA', 'PYG', 'RWF', 'UGX', 'VND', 'VUV', 'XAF', 'XOF', 'XPF'];
    
    if (zeroDecimalCurrencies.includes(currency.toUpperCase())) {
      return Math.round(amount);
    }
    
    return Math.round(amount * 100);
  },
  
  /**
   * Get supported currencies
   */
  getSupportedCurrencies(): string[] {
    return ['USD', 'NGN', 'ZAR', 'EUR', 'GBP'];
  },

  /**
   * Get supported payment methods for a currency
   */
  getSupportedPaymentMethods(currency: string): string[] {
    const baseMethods = ['card'];
    
    switch (currency.toUpperCase()) {
      case 'NGN':
        return [...baseMethods, 'ng_card', 'ng_bank_transfer'];
      case 'USD':
      case 'EUR':
      case 'GBP':
        return [...baseMethods, 'link', 'cashapp']; // US/EU specific methods
      case 'ZAR':
        return baseMethods; // South African Rand - basic card support
      default:
        return baseMethods;
    }
  },

  /**
   * Validate amount for Nigerian payments
   */
  validateNigerianAmount(amount: number): { valid: boolean; error?: string } {
    const minAmount = 500; // 500 NGN minimum
    const maxAmount = 100000000; // 100,000,000 NGN maximum
    
    if (amount < minAmount) {
      return {
        valid: false,
        error: `Minimum amount for Nigerian payments is ${minAmount} NGN`
      };
    }
    
    if (amount > maxAmount) {
      return {
        valid: false,
        error: `Maximum amount for Nigerian payments is ${maxAmount.toLocaleString()} NGN`
      };
    }
    
    return { valid: true };
  },

  /**
   * Convert USD to NGN (approximate rate for development)
   * In production, you should use a real-time currency API
   */
  convertUSDToNGN(usdAmount: number): number {
    const exchangeRate = 1650; // Approximate USD to NGN rate (update with real API)
    return Math.round(usdAmount * exchangeRate);
  }
  
};