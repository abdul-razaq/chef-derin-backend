/**
 * newsletter controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::newsletter.newsletter', ({ strapi }) => ({
  async subscribe(ctx) {
    try {
      const { email, source = 'unknown' } = ctx.request.body.data || ctx.request.body;

      // Validate email
      if (!email || !email.includes('@')) {
        return ctx.badRequest('Valid email is required');
      }

      // Check if email already exists
      const existingSubscription = await strapi.db.query('api::newsletter.newsletter').findOne({
        where: { email: email.toLowerCase() }
      });

      if (existingSubscription) {
        if (existingSubscription.isActive) {
          return ctx.badRequest('Email is already subscribed');
        } else {
          // Reactivate subscription
          const updated = await strapi.db.query('api::newsletter.newsletter').update({
            where: { id: existingSubscription.id },
            data: {
              isActive: true,
              source,
              subscribedAt: new Date(),
              unsubscribedAt: null
            }
          });
          
          strapi.log.info(`Newsletter subscription reactivated: ${email} from ${source}`);
          return ctx.send({ data: updated, message: 'Successfully resubscribed to newsletter' });
        }
      }

      // Create new subscription
      const subscription = await strapi.db.query('api::newsletter.newsletter').create({
        data: {
          email: email.toLowerCase(),
          source,
          isActive: true,
          subscribedAt: new Date()
        }
      });

      strapi.log.info(`New newsletter subscription: ${email} from ${source}`);
      return ctx.send({ data: subscription, message: 'Successfully subscribed to newsletter' });

    } catch (error) {
      strapi.log.error('Newsletter subscription error:', error);
      return ctx.internalServerError('Failed to process subscription');
    }
  },

  async unsubscribe(ctx) {
    try {
      const { email } = ctx.request.body.data || ctx.request.body;

      if (!email) {
        return ctx.badRequest('Email is required');
      }

      const subscription = await strapi.db.query('api::newsletter.newsletter').findOne({
        where: { email: email.toLowerCase(), isActive: true }
      });

      if (!subscription) {
        return ctx.notFound('Active subscription not found');
      }

      const updated = await strapi.db.query('api::newsletter.newsletter').update({
        where: { id: subscription.id },
        data: {
          isActive: false,
          unsubscribedAt: new Date()
        }
      });

      strapi.log.info(`Newsletter unsubscription: ${email}`);
      return ctx.send({ data: updated, message: 'Successfully unsubscribed from newsletter' });

    } catch (error) {
      strapi.log.error('Newsletter unsubscription error:', error);
      return ctx.internalServerError('Failed to process unsubscription');
    }
  }
}));