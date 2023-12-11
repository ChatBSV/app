// src/utils/paymentUtils.js

export function calculatePaymentAmount(requesttype, model, tokens = 0) {
    console.log('calculatePaymentAmount is called.');
  
    console.log('Calculating payment amount for request type:', requesttype);
    
    console.log('Model:', model);
    console.log('Tokens:', tokens);
  
    switch (requesttype) {
      case 'image':
        const imagePayment = model === 'dall-e-2' ? process.env.DALLE2_AMOUNT : process.env.DALLE3_AMOUNT;
        console.log('Image Payment Amount:', imagePayment);
        return imagePayment;
      case 'meme':
        const memePayment = process.env.MEME_AMOUNT;
        console.log('Meme Payment Amount:', memePayment);
        return memePayment;
      case 'text':
        // Dynamic pricing based on token usage for GPT models
        const pricePerThousandTokens = model === 'gpt-4' ? 0.05 : 0.01; // 5 cents for GPT-4 and 1 cent for GPT-3
        const minimumPrice = model === 'gpt-4' ? 0.05 : 0.01; // Minimum price for GPT-4 and GPT-3
        const additionalCost = Math.ceil(tokens / 1000) * pricePerThousandTokens;
        const textPayment = Math.max(minimumPrice, additionalCost);
        console.log('Text Payment Amount:', textPayment);
        return textPayment;
      default:
        const defaultPayment = process.env.CHAT_AMOUNT;
        console.log('Default Payment Amount:', defaultPayment);
        return defaultPayment;
    }
  }
  