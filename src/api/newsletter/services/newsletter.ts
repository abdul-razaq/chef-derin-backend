/**
 * newsletter service
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreService('api::newsletter.newsletter', ({ strapi }) => ({
  async findByEmail(email: string) {
    return await strapi.entityService.findMany('api::newsletter.newsletter', {
      filters: { email: email.toLowerCase() }
    });
  },

  async getActiveSubscriptions() {
    return await strapi.entityService.findMany('api::newsletter.newsletter', {
      filters: { isActive: true },
      sort: { subscribedAt: 'desc' }
    });
  },

  async getSubscriptionStats() {
    const total = await strapi.entityService.count('api::newsletter.newsletter');
    const active = await strapi.entityService.count('api::newsletter.newsletter', {
      filters: { isActive: true }
    });
    const inactive = total - active;

    // Get source statistics manually
    const homePageSubs = await strapi.entityService.count('api::newsletter.newsletter', {
      filters: { isActive: true, source: 'home_page' }
    });
    const documentaryPageSubs = await strapi.entityService.count('api::newsletter.newsletter', {
      filters: { isActive: true, source: 'documentary_page' }
    });
    const otherSubs = await strapi.entityService.count('api::newsletter.newsletter', {
      filters: { isActive: true, source: 'other' }
    });

    return {
      total,
      active,
      inactive,
      bySource: {
        home_page: homePageSubs,
        documentary_page: documentaryPageSubs,
        other: otherSubs
      }
    };
  },

  async validateEmail(email: string): Promise<boolean> {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}));