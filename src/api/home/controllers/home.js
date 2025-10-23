'use strict';

/**
 * home controller
 */

module.exports = {
  async find(ctx) {
    console.log('=== HOME CONTROLLER CALLED ===');
    
    try {
      // Simple test response
      const testResponse = {
        data: {
          id: 1,
          message: 'Home controller is working!',
          timestamp: new Date().toISOString()
        }
      };
      
      console.log('Returning test response:', testResponse);
      
      return testResponse;
    } catch (error) {
      console.error('Error in home controller:', error);
      ctx.status = 500;
      return { error: 'Internal server error', details: error.message };
    }
  },
};