import { factories } from '@strapi/strapi';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-09-30.clover',
});

export default factories.createCoreController('api::recipe-book.recipe-book', ({ strapi }) => ({
  // Override default find method
  async find(ctx) {
    try {
      const entities = await strapi.entityService.findMany('api::recipe-book.recipe-book', {
        populate: '*',
      });
      return { data: entities };
    } catch (error) {
      console.error('Error fetching recipe books:', error);
      ctx.throw(500, 'Failed to fetch recipe books');
    }
  },

  // Override default findOne method
  async findOne(ctx) {
    try {
      const { id } = ctx.params;
      const entity = await strapi.entityService.findOne('api::recipe-book.recipe-book', id, {
        populate: '*',
      });
      return { data: entity };
    } catch (error) {
      console.error('Error fetching recipe book:', error);
      ctx.throw(500, 'Failed to fetch recipe book');
    }
  },

  // Create a new recipe book
  async create(ctx) {
    try {
      const { data } = ctx.request.body;
      const entity = await strapi.entityService.create('api::recipe-book.recipe-book', {
        data,
      });
      return { data: entity };
    } catch (error) {
      console.error('Error creating recipe book:', error);
      ctx.throw(500, 'Failed to create recipe book');
    }
  },

  // Create payment intent for recipe book purchase
  async createPaymentIntent(ctx) {
    try {
      const { bookId, customerEmail, customerName, paymentReference, paymentMethod = 'card' } = ctx.request.body;

      if (!bookId || !customerEmail || !customerName) {
        return ctx.badRequest('Missing required fields: bookId, customerEmail, customerName');
      }

      // Fetch the recipe book
      const recipeBook = await strapi.entityService.findOne('api::recipe-book.recipe-book', bookId, {
        populate: '*'
      });

      if (!recipeBook) {
        return ctx.notFound('Recipe book not found');
      }

      if (!recipeBook.available) {
        return ctx.badRequest('Recipe book is not available for purchase');
      }

      const amount = Math.round(recipeBook.price * 100);
      const currency = recipeBook.currency?.toLowerCase() || 'usd';
      const reference = paymentReference || `RECIPE-${Date.now()}`;

      // Handle different payment methods
      if (paymentMethod === 'crypto') {
        // For crypto payments, create a pending order record
        const cryptoOrder = {
          bookId: bookId.toString(),
          customerEmail,
          customerName,
          bookTitle: recipeBook.title,
          amount: recipeBook.price,
          currency: recipeBook.currency,
          paymentMethod: 'crypto',
          paymentReference: reference,
          status: 'pending_payment',
          createdAt: new Date(),
        };

        ctx.body = {
          success: true,
          paymentMethod: 'crypto',
          orderReference: reference,
          amount: recipeBook.price,
          currency: recipeBook.currency,
          bookTitle: recipeBook.title,
          cryptoOptions: [
            {
              name: 'Bitcoin (BTC)',
              address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
              network: 'Bitcoin Network'
            },
            {
              name: 'Ethereum (ETH)',
              address: '0x8ba1f109551bD432803012645Hac136c22C85B',
              network: 'Ethereum Network'
            },
            {
              name: 'USDT (Tether)',
              address: 'TLa2f6VPqDgRE67v1736s7bJ8Ray5wYjU7',
              network: 'TRC-20 (Tron)'
            },
            {
              name: 'Litecoin (LTC)',
              address: 'ltc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4',
              network: 'Litecoin Network'
            }
          ],
          instructions: 'Send the exact amount to the wallet address for your chosen cryptocurrency. Include your order reference in the transaction memo if possible.'
        };
        return;
      }

      if (paymentMethod === 'bank') {
        // For bank transfers, create a pending order record
        const bankOrder = {
          bookId: bookId.toString(),
          customerEmail,
          customerName,
          bookTitle: recipeBook.title,
          amount: recipeBook.price,
          currency: recipeBook.currency,
          paymentMethod: 'bank',
          paymentReference: reference,
          status: 'pending_payment',
          createdAt: new Date(),
        };

        ctx.body = {
          success: true,
          paymentMethod: 'bank',
          orderReference: reference,
          amount: recipeBook.price,
          currency: recipeBook.currency,
          bookTitle: recipeBook.title,
          bankDetails: {
            bankName: 'First Bank of Nigeria',
            accountName: 'ORISUN Dining Experiences',
            accountNumber: '1234567890',
            sortCode: '011-152-003'
          },
          instructions: `Transfer the exact amount (${recipeBook.currency} ${recipeBook.price.toLocaleString()}) to the account above. Use reference: ${reference}. Send proof of payment to payments@orisundining.com`
        };
        return;
      }

      // Default to Stripe card payment
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency,
        metadata: {
          type: 'recipe_book_purchase',
          bookId: bookId.toString(),
          customerEmail,
          customerName,
          bookTitle: recipeBook.title,
          paymentReference: reference
        },
        description: `Recipe Book: ${recipeBook.title}`,
        receipt_email: customerEmail,
      });

      ctx.body = {
        success: true,
        paymentMethod: 'card',
        paymentIntentId: paymentIntent.id,
        clientSecret: paymentIntent.client_secret,
        amount,
        currency,
        bookTitle: recipeBook.title
      };

    } catch (error) {
      console.error('Error creating payment intent:', error);
      ctx.throw(500, 'Failed to create payment intent');
    }
  },

  // Confirm payment and generate download link
  async confirmPayment(ctx) {
    try {
      const { paymentIntentId, customerInfo } = ctx.request.body;

      if (!paymentIntentId) {
        return ctx.badRequest('Payment intent ID is required');
      }

      // Retrieve payment intent from Stripe
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

      if (paymentIntent.status !== 'succeeded') {
        return ctx.badRequest('Payment has not been completed');
      }

      const { bookId, customerEmail, customerName, bookTitle } = paymentIntent.metadata;

      // Fetch the recipe book
      const recipeBook = await strapi.entityService.findOne('api::recipe-book.recipe-book', parseInt(bookId), {
        populate: '*'
      });

      if (!recipeBook) {
        return ctx.notFound('Recipe book not found');
      }

      // Create purchase record (you might want to create a separate content type for this)
      const purchaseRecord = {
        paymentIntentId,
        customerEmail,
        customerName: customerName || customerInfo?.name,
        bookId: parseInt(bookId),
        bookTitle,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        purchaseDate: new Date(),
        status: 'completed'
      };

      // Generate download URL (using the existing PDF file)
      const downloadUrl = `${strapi.config.server.url}/chef-derin-recipe-book.pdf`;

      ctx.body = {
        success: true,
        downloadUrl,
        purchaseRecord,
        message: 'Payment confirmed successfully. Your recipe book is ready for download.'
      };

    } catch (error) {
      console.error('Error confirming payment:', error);
      ctx.throw(500, 'Failed to confirm payment');
    }
  },

  // Generate download link (for already purchased books)
  async generateDownload(ctx) {
    try {
      const { paymentIntentId } = ctx.request.body;

      if (!paymentIntentId) {
        return ctx.badRequest('Payment intent ID is required');
      }

      // Verify payment intent exists and was successful
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

      if (paymentIntent.status !== 'succeeded') {
        return ctx.badRequest('Invalid or incomplete payment');
      }

      // Generate download URL
      const downloadUrl = `${strapi.config.server.url}/chef-derin-recipe-book.pdf`;

      ctx.body = {
        success: true,
        downloadUrl,
        message: 'Download link generated successfully'
      };

    } catch (error) {
      console.error('Error generating download:', error);
      ctx.throw(500, 'Failed to generate download link');
    }
  },

  // Confirm crypto payment (admin use)
  async confirmCryptoPayment(ctx) {
    try {
      const { orderReference, transactionHash, customerEmail } = ctx.request.body;

      if (!orderReference || !transactionHash || !customerEmail) {
        return ctx.badRequest('Missing required fields: orderReference, transactionHash, customerEmail');
      }

      // In a real implementation, you would:
      // 1. Verify the transaction on the blockchain
      // 2. Store the payment confirmation in your database
      // 3. Send confirmation email to customer

      // For now, we'll just generate the download link
      const downloadUrl = `${strapi.config.server.url}/chef-derin-recipe-book.pdf`;

      ctx.body = {
        success: true,
        downloadUrl,
        orderReference,
        transactionHash,
        message: 'Crypto payment confirmed successfully. Download link generated.'
      };

    } catch (error) {
      console.error('Error confirming crypto payment:', error);
      ctx.throw(500, 'Failed to confirm crypto payment');
    }
  },

  // Confirm bank transfer payment (admin use)
  async confirmBankPayment(ctx) {
    try {
      const { orderReference, bankReference, customerEmail } = ctx.request.body;

      if (!orderReference || !bankReference || !customerEmail) {
        return ctx.badRequest('Missing required fields: orderReference, bankReference, customerEmail');
      }

      // In a real implementation, you would:
      // 1. Verify the bank transfer with your bank
      // 2. Store the payment confirmation in your database
      // 3. Send confirmation email to customer

      // For now, we'll just generate the download link
      const downloadUrl = `${strapi.config.server.url}/chef-derin-recipe-book.pdf`;

      ctx.body = {
        success: true,
        downloadUrl,
        orderReference,
        bankReference,
        message: 'Bank transfer payment confirmed successfully. Download link generated.'
      };

    } catch (error) {
      console.error('Error confirming bank payment:', error);
      ctx.throw(500, 'Failed to confirm bank payment');
    }
  }
}));