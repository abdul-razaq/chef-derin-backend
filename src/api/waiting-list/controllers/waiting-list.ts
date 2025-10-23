'use strict';

/**
 * waiting-list controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::waiting-list.waiting-list', ({ strapi }) => ({
  async create(ctx) {
    try {
      const { data } = ctx.request.body;
      
      // Validate required fields
      if (!data.email || !data.firstName || !data.lastName) {
        return ctx.badRequest('Email, first name, and last name are required');
      }

      // Determine preferred location based on experience
      let preferredLocation: 'Cape Town' | 'Lagos' | 'Any' = 'Any';
      if (data.experienceTitle?.includes('South Africa')) {
        preferredLocation = 'Cape Town';
      } else if (data.experienceTitle?.includes('Nigeria')) {
        preferredLocation = 'Lagos';
      }

      // Prepare the data for Strapi
      const waitlistData = {
        email: data.email,
        name: `${data.firstName} ${data.lastName}`,
        phone: data.phone || null,
        numberOfGuests: 1, // Default to 1 if not specified
        preferredLocation,
        preferredDates: data.preferredDates ? [data.preferredDates] : [],
        joinedDate: new Date(),
        status: 'active' as const,
        specialRequests: data.specialRequests || null,
        source: 'website'
      };

      // Create the waitlist entry
      const entity = await strapi.entityService.create('api::waiting-list.waiting-list', {
        data: waitlistData,
      });

      // Log the submission for admin tracking
      strapi.log.info(`New waitlist submission: ${data.email} for ${data.experienceTitle}`);

      return ctx.send({
        data: {
          id: entity.id,
          message: 'Successfully joined the waiting list'
        }
      });

    } catch (error) {
      strapi.log.error('Error creating waitlist entry:', error);
      return ctx.internalServerError('Failed to join waiting list');
    }
  },

  async find(ctx) {
    // Only allow admin users to view waitlist entries
    if (!ctx.state.user || ctx.state.user.role?.type !== 'admin') {
      return ctx.forbidden('Access denied');
    }

    return await super.find(ctx);
  },

  async findOne(ctx) {
    // Only allow admin users to view waitlist entries
    if (!ctx.state.user || ctx.state.user.role?.type !== 'admin') {
      return ctx.forbidden('Access denied');
    }

    return await super.findOne(ctx);
  }
}));