/**
 * contact controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::contact.contact', ({ strapi }) => ({
  async create(ctx) {
    try {
      // Add timestamp for when the form was submitted
      const data = {
        ...ctx.request.body.data,
        submittedAt: new Date().toISOString(),
      };

      // Create the contact entry
      const entity = await strapi.entityService.create('api::contact.contact', {
        data,
      });

      // Return the created entity
      return { data: entity };
    } catch (error) {
      console.error('Error creating contact:', error);
      ctx.throw(500, 'Failed to submit contact form');
    }
  },

  async find(ctx) {
    // Only allow authenticated users to view contacts
    if (!ctx.state.user) {
      return ctx.unauthorized('You must be authenticated to view contacts');
    }
    
    return await super.find(ctx);
  },

  async findOne(ctx) {
    // Only allow authenticated users to view contacts
    if (!ctx.state.user) {
      return ctx.unauthorized('You must be authenticated to view contacts');
    }
    
    return await super.findOne(ctx);
  }
}));