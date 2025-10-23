/**
 * Rate limiting middleware for contact form submissions
 */

export default (config, { strapi }) => {
  return async (ctx, next) => {
    const clientIP = ctx.request.ip;
    const now = Date.now();
    const windowMs = 15 * 60 * 1000; // 15 minutes
    const maxRequests = 5; // Max 5 submissions per 15 minutes per IP

    // Simple in-memory rate limiting (in production, use Redis)
    if (!global.contactRateLimit) {
      global.contactRateLimit = new Map();
    }

    const requests = global.contactRateLimit.get(clientIP) || [];
    const recentRequests = requests.filter(timestamp => now - timestamp < windowMs);

    if (recentRequests.length >= maxRequests) {
      return ctx.throw(429, 'Too many contact form submissions. Please try again later.');
    }

    // Add current request timestamp
    recentRequests.push(now);
    global.contactRateLimit.set(clientIP, recentRequests);

    await next();
  };
};