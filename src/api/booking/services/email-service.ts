/**
 * Email service for booking confirmations
 */

interface BookingEmailData {
  customerName: string;
  customerEmail: string;
  bookingReference: string;
  eventTitle: string;
  bookingDate: string;
  numberOfGuests: number;
  totalAmount: number;
  currency: string;
  paymentStatus: string;
}

export default {
  /**
   * Send confirmation email to customer
   */
  async sendCustomerConfirmation(bookingData: BookingEmailData) {
    try {
      const { customerName, customerEmail, bookingReference, eventTitle, bookingDate, numberOfGuests, totalAmount, currency } = bookingData;
      
      const emailContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2c3e50; margin-bottom: 10px;">ORISUN Dining</h1>
            <h2 style="color: #27ae60; margin-top: 0;">Booking Confirmed!</h2>
          </div>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #2c3e50; margin-top: 0;">Dear ${customerName},</h3>
            <p style="color: #555; line-height: 1.6;">
              Thank you for your booking! We're excited to host you for an unforgettable dining experience.
            </p>
          </div>
          
          <div style="background-color: #fff; border: 2px solid #27ae60; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #27ae60; margin-top: 0;">Booking Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #555; font-weight: bold;">Booking Reference:</td>
                <td style="padding: 8px 0; color: #2c3e50;">${bookingReference}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #555; font-weight: bold;">Event:</td>
                <td style="padding: 8px 0; color: #2c3e50;">${eventTitle}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #555; font-weight: bold;">Date & Time:</td>
                <td style="padding: 8px 0; color: #2c3e50;">${new Date(bookingDate).toLocaleString()}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #555; font-weight: bold;">Number of Guests:</td>
                <td style="padding: 8px 0; color: #2c3e50;">${numberOfGuests}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #555; font-weight: bold;">Total Amount:</td>
                <td style="padding: 8px 0; color: #27ae60; font-weight: bold;">${currency} ${totalAmount}</td>
              </tr>
            </table>
          </div>
          
          <div style="background-color: #e8f5e8; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #27ae60; margin-top: 0;">What's Next?</h3>
            <ul style="color: #555; line-height: 1.6; padding-left: 20px;">
              <li>You'll receive a reminder email 24 hours before your dining experience</li>
              <li>Please arrive 15 minutes before your scheduled time</li>
              <li>If you have any dietary restrictions, please contact us at least 48 hours in advance</li>
              <li>For any changes or cancellations, please contact us as soon as possible</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #555; margin-bottom: 10px;">Questions? Contact us:</p>
            <p style="color: #27ae60; font-weight: bold; margin: 5px 0;">
              📧 chefderinbookings@gmail.com
            </p>
            <p style="color: #27ae60; font-weight: bold; margin: 5px 0;">
              📱 08083708908 (WhatsApp only)
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 20px; color: #888; font-size: 12px;">
            <p>Thank you for choosing ORISUN Dining. We look forward to serving you!</p>
          </div>
        </div>
      `;

      await strapi.plugins['email'].services.email.send({
        to: customerEmail,
        from: 'chefderinbookings@gmail.com',
        subject: `Booking Confirmed - ${eventTitle} (${bookingReference})`,
        html: emailContent,
      });

      strapi.log.info(`Customer confirmation email sent to ${customerEmail} for booking ${bookingReference}`);
      return { success: true };
    } catch (error) {
      strapi.log.error('Error sending customer confirmation email:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  },

  /**
   * Send notification email to admin
   */
  async sendAdminNotification(bookingData: BookingEmailData) {
    try {
      const { customerName, customerEmail, bookingReference, eventTitle, bookingDate, numberOfGuests, totalAmount, currency, paymentStatus } = bookingData;
      
      const emailContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2c3e50; margin-bottom: 10px;">ORISUN Dining</h1>
            <h2 style="color: #e74c3c; margin-top: 0;">New Booking Received</h2>
          </div>
          
          <div style="background-color: #fff; border: 2px solid #e74c3c; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #e74c3c; margin-top: 0;">Booking Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #555; font-weight: bold;">Booking Reference:</td>
                <td style="padding: 8px 0; color: #2c3e50;">${bookingReference}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #555; font-weight: bold;">Customer Name:</td>
                <td style="padding: 8px 0; color: #2c3e50;">${customerName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #555; font-weight: bold;">Customer Email:</td>
                <td style="padding: 8px 0; color: #2c3e50;">${customerEmail}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #555; font-weight: bold;">Event:</td>
                <td style="padding: 8px 0; color: #2c3e50;">${eventTitle}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #555; font-weight: bold;">Date & Time:</td>
                <td style="padding: 8px 0; color: #2c3e50;">${new Date(bookingDate).toLocaleString()}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #555; font-weight: bold;">Number of Guests:</td>
                <td style="padding: 8px 0; color: #2c3e50;">${numberOfGuests}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #555; font-weight: bold;">Total Amount:</td>
                <td style="padding: 8px 0; color: #27ae60; font-weight: bold;">${currency} ${totalAmount}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #555; font-weight: bold;">Payment Status:</td>
                <td style="padding: 8px 0; color: ${paymentStatus === 'completed' ? '#27ae60' : '#f39c12'}; font-weight: bold;">${paymentStatus.toUpperCase()}</td>
              </tr>
            </table>
          </div>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #2c3e50; margin-top: 0;">Action Required</h3>
            <ul style="color: #555; line-height: 1.6; padding-left: 20px;">
              <li>Review the booking details in your admin dashboard</li>
              <li>Prepare for the dining experience</li>
              <li>Contact the customer if you need any additional information</li>
              ${paymentStatus !== 'completed' ? '<li style="color: #e74c3c; font-weight: bold;">⚠️ Payment verification may be required</li>' : ''}
            </ul>
          </div>
          
          <div style="text-align: center; margin-top: 30px; color: #888; font-size: 12px;">
            <p>This is an automated notification from your ORISUN Dining booking system.</p>
          </div>
        </div>
      `;

      await strapi.plugins['email'].services.email.send({
        to: 'chefderinbookings@gmail.com',
        from: 'chefderinbookings@gmail.com',
        subject: `New Booking: ${eventTitle} - ${bookingReference}`,
        html: emailContent,
      });

      strapi.log.info(`Admin notification email sent for booking ${bookingReference}`);
      return { success: true };
    } catch (error) {
      strapi.log.error('Error sending admin notification email:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  },
};