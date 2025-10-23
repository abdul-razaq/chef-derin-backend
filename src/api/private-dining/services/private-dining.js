'use strict';

/**
 * private-dining service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::private-dining.private-dining');