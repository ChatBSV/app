// src/utils/paymentUtils.js

export function calculatePaymentAmount(requesttype, model, tokens) {
  
    console.log('Request Type:', requesttype);
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
          let pricePerToken;
          let minimumPrice;

          if (model === 'gpt-4') {
              pricePerToken = 0.08 / 1000;
              minimumPrice = 0.08;
          } else {
              pricePerToken = 0.03 / 1000;
              minimumPrice = 0.03;
          }

          const textPayment = Math.max(tokens * pricePerToken, minimumPrice);

          console.log('Text Payment Amount:', textPayment.toFixed(2));
          return textPayment;
      default:
        const defaultPayment = process.env.CHAT_AMOUNT;
        console.log('Default Payment Amount:', defaultPayment);
        return defaultPayment;
    }
  }
  