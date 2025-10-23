'use strict';

/**
 * Rate limiting middleware for waiting list submissions
 */

const submissionTracker = new Map();

export default (config, { strapi }) => {
  return async (ctx, next) => {
    const clientIP = ctx.request.ip;
    const now = Date.now();
    const windowMs = 60 * 1000; // 1 minute
    const maxSubmissions = 3; // Max 3 submissions per minute per IP

    // Clean old entries
    for (const [ip, data] of submissionTracker.entries()) {
      if (now - data.firstSubmission > windowMs) {
        submissionTracker.delete(ip);
      }
    }

    // Check current IP
    const ipData = submissionTracker.get(clientIP);
    
    if (ipData) {
      if (ipData.count >= maxSubmissions) {
        return ctx.tooManyRequests('Too many waitlist submissions. Please try again later.');
      }
      ipData.count++;
    } else {
      submissionTracker.set(clientIP, {
        count: 1,
        firstSubmission: now
      });
    }

    await next();
  };
};