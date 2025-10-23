#!/usr/bin/env node

/**
 * ORISUN Payment Options Seeder Script
 * Seeds payment options including crypto wallets and bank details
 */

const path = require('path');

// Set up Strapi environment
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

async function seedPaymentOptions() {
  try {
    console.log('🚀 Starting ORISUN payment options seeding...');
    
    // Initialize Strapi
    const strapi = require('@strapi/strapi');
    const app = await strapi().load();
    
    const paymentOptionsData = [
      // Stripe Payment Options
      {
        name: "Credit/Debit Card (ZAR)",
        type: "stripe",
        currency: "ZAR",
        instructions: `<p><strong>Secure Card Payment</strong></p>
        <p>Pay securely with your credit or debit card. We accept Visa, Mastercard, and American Express.</p>
        <ul>
          <li>✅ Instant confirmation</li>
          <li>✅ Secure 3D authentication</li>
          <li>✅ Automatic receipt via email</li>
        </ul>`,
        isActive: true,
        displayOrder: 1,
        icon: "credit-card",
        processingTime: "Instant",
        fees: "No additional fees"
      },
      
      {
        name: "Credit/Debit Card (NGN)",
        type: "stripe", 
        currency: "NGN",
        instructions: `<p><strong>Secure Card Payment</strong></p>
        <p>Pay securely with your credit or debit card. We accept Visa, Mastercard, and local Nigerian cards.</p>
        <ul>
          <li>✅ Instant confirmation</li>
          <li>✅ Secure 3D authentication</li>
          <li>✅ Automatic receipt via email</li>
        </ul>`,
        isActive: true,
        displayOrder: 2,
        icon: "credit-card",
        processingTime: "Instant",
        fees: "No additional fees"
      },
      
      // Cryptocurrency Options
      {
        name: "Bitcoin (BTC)",
        type: "cryptocurrency",
        currency: "BTC",
        address: "15LfSM7ojqrwC2FrWDQQq6Jq6JVUUFjdLo",
        network: "Bitcoin Network",
        instructions: `<p><strong>Bitcoin Payment</strong></p>
        <p>Send your payment to the Bitcoin address below:</p>
        <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; font-family: monospace; word-break: break-all;">
          <strong>15LfSM7ojqrwC2FrWDQQq6Jq6JVUUFjdLo</strong>
        </div>
        <p><strong>Important:</strong></p>
        <ul>
          <li>⚠️ Send only Bitcoin (BTC) to this address</li>
          <li>📧 Email us your transaction ID after payment</li>
          <li>⏱️ Allow 1-6 confirmations for processing</li>
          <li>💰 Check current BTC exchange rate before sending</li>
        </ul>`,
        isActive: true,
        displayOrder: 3,
        icon: "bitcoin",
        processingTime: "1-6 confirmations (~10-60 minutes)",
        fees: "Network fees apply"
      },
      
      {
        name: "Ethereum (ETH)",
        type: "cryptocurrency",
        currency: "ETH",
        address: "0x7d874138b77a1f7e094f04cc14edb6faa312c233",
        network: "ERC-20",
        instructions: `<p><strong>Ethereum Payment</strong></p>
        <p>Send your payment to the Ethereum address below:</p>
        <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; font-family: monospace; word-break: break-all;">
          <strong>0x7d874138b77a1f7e094f04cc14edb6faa312c233</strong>
        </div>
        <p><strong>Network:</strong> ERC-20 (Ethereum Network)</p>
        <p><strong>Important:</strong></p>
        <ul>
          <li>⚠️ Send only ETH or ERC-20 tokens to this address</li>
          <li>📧 Email us your transaction hash after payment</li>
          <li>⏱️ Allow 12-35 confirmations for processing</li>
          <li>💰 Check current ETH exchange rate before sending</li>
        </ul>`,
        isActive: true,
        displayOrder: 4,
        icon: "ethereum",
        processingTime: "12-35 confirmations (~3-8 minutes)",
        fees: "Gas fees apply"
      },
      
      {
        name: "USDT (Tether)",
        type: "cryptocurrency",
        currency: "USDT",
        address: "TN8F4ARj5LuoQHs2QdQ2N5A5PCSrGuJd3s",
        network: "TRC-20 (TRON)",
        instructions: `<p><strong>USDT Payment</strong></p>
        <p>Send your USDT payment to the TRON address below:</p>
        <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; font-family: monospace; word-break: break-all;">
          <strong>TN8F4ARj5LuoQHs2QdQ2N5A5PCSrGuJd3s</strong>
        </div>
        <p><strong>Network:</strong> TRC-20 (TRON Network)</p>
        <p><strong>Important:</strong></p>
        <ul>
          <li>⚠️ Send only USDT on TRC-20 network to this address</li>
          <li>❌ Do NOT send ERC-20 USDT or other networks</li>
          <li>📧 Email us your transaction hash after payment</li>
          <li>⏱️ Usually confirmed within 1-3 minutes</li>
          <li>💰 1 USDT = 1 USD equivalent</li>
        </ul>`,
        isActive: true,
        displayOrder: 5,
        icon: "usdt",
        processingTime: "1-3 minutes",
        fees: "Very low TRC-20 fees"
      },
      
      {
        name: "Litecoin (LTC)",
        type: "cryptocurrency",
        currency: "LTC",
        address: "LhGrwo7yAR9ZRdqpHdMYACAZ8ihKgd7obg",
        network: "Litecoin Network",
        instructions: `<p><strong>Litecoin Payment</strong></p>
        <p>Send your payment to the Litecoin address below:</p>
        <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; font-family: monospace; word-break: break-all;">
          <strong>LhGrwo7yAR9ZRdqpHdMYACAZ8ihKgd7obg</strong>
        </div>
        <p><strong>Important:</strong></p>
        <ul>
          <li>⚠️ Send only Litecoin (LTC) to this address</li>
          <li>📧 Email us your transaction ID after payment</li>
          <li>⏱️ Allow 6 confirmations for processing</li>
          <li>💰 Check current LTC exchange rate before sending</li>
          <li>⚡ Faster and cheaper than Bitcoin</li>
        </ul>`,
        isActive: true,
        displayOrder: 6,
        icon: "litecoin",
        processingTime: "6 confirmations (~15 minutes)",
        fees: "Low network fees"
      },
      
      // Bank Transfer Option
      {
        name: "Nigerian Bank Transfer",
        type: "bank_transfer",
        currency: "NGN",
        address: "0711979500",
        bankName: "GTB Bank",
        accountName: "Nobs and berries",
        instructions: `<p><strong>Nigerian Bank Transfer</strong></p>
        <p>Transfer your payment to the account details below:</p>
        <div style="background: #f5f5f5; padding: 15px; border-radius: 8px;">
          <p><strong>Bank:</strong> GTB Bank</p>
          <p><strong>Account Number:</strong> 0711979500</p>
          <p><strong>Account Name:</strong> Nobs and berries</p>
        </div>
        <p><strong>Payment Instructions:</strong></p>
        <ul>
          <li>💳 Use your booking reference as transfer description</li>
          <li>📧 Email us your payment receipt after transfer</li>
          <li>⏱️ Payments are usually confirmed within 2-24 hours</li>
          <li>📱 You can use mobile banking, USSD, or visit any GTB branch</li>
          <li>✅ No additional fees for bank transfers</li>
        </ul>
        <p><strong>Contact:</strong> Send payment confirmation to bookings@orisundining.com</p>`,
        isActive: true,
        displayOrder: 7,
        icon: "bank",
        processingTime: "2-24 hours",
        fees: "No additional fees (bank charges may apply)"
      }
    ];
    
    console.log(`📋 Payment options to create: ${paymentOptionsData.length}`);
    
    const results = [];
    
    for (const optionData of paymentOptionsData) {
      try {
        // Check if payment option already exists
        const existingOptions = await app.entityService.findMany('api::payment-option.payment-option', {
          filters: { name: optionData.name }
        });
        
        if (existingOptions.length === 0) {
          const createdOption = await app.entityService.create('api::payment-option.payment-option', {
            data: {
              ...optionData,
              publishedAt: new Date() // Auto-publish the payment options
            }
          });
          
          results.push({
            status: 'created',
            name: optionData.name,
            type: optionData.type,
            id: createdOption.id
          });
          
          console.log(`✅ Created payment option: ${optionData.name}`);
        } else {
          results.push({
            status: 'exists',
            name: optionData.name,
            type: optionData.type,
            id: existingOptions[0].id
          });
          
          console.log(`⏭️  Payment option already exists: ${optionData.name}`);
        }
      } catch (error) {
        console.error(`❌ Error creating payment option ${optionData.name}:`, error.message);
        results.push({
          status: 'error',
          name: optionData.name,
          type: optionData.type,
          error: error.message
        });
      }
    }
    
    console.log('\n🎉 ORISUN payment options seeding completed!');
    console.log('\n📊 Summary:');
    console.log(`   Stripe options: ${results.filter(r => r.type === 'stripe').length}`);
    console.log(`   Cryptocurrency options: ${results.filter(r => r.type === 'cryptocurrency').length}`);
    console.log(`   Bank transfer options: ${results.filter(r => r.type === 'bank_transfer').length}`);
    console.log(`   Total: ${results.length}`);
    
    // Close Strapi
    await app.destroy();
    
    return results;
    
  } catch (error) {
    console.error('❌ Fatal error during payment options seeding:', error);
    process.exit(1);
  }
}

// Run the seeder
if (require.main === module) {
  seedPaymentOptions()
    .then(() => {
      console.log('✅ Payment options seeding script completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Payment options seeding script failed:', error);
      process.exit(1);
    });
}

module.exports = { seedPaymentOptions };