// pages/api/pay.js

import AuthTokenRepository from "../../src/repositories/AuthTokenRepository";
import HandCashService from "../../src/services/HandCashService";
import SessionTokenRepository from "../../src/repositories/SessionTokenRepository";
import getErrorMessage from '../../src/lib/getErrorMessage';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(404).json({ error: 'Not found' });
  }

  try {
    const { authorization, requesttype, model } = req.headers;

    console.log('Request Type:', requesttype);
    console.log('Model:', model); 

    if (!authorization) {
      return res.status(401).json({ error: getErrorMessage(new Error('Missing authorization. Please reconnect to Handcash.')) });
    }

    const sessionToken = authorization.split(' ')[1];
    if (!sessionToken) {
      return res.status(401).json({ error: getErrorMessage(new Error('Missing session token. Please reconnect to Handcash.')) });
    }

    const { sessionId, user } = SessionTokenRepository.verify(sessionToken);
    const authToken = AuthTokenRepository.getById(sessionId);
    if (!authToken) {
      const errorMessage = getErrorMessage(new Error('Expired authentication. Reconnecting to Handcash. Please authorize to proceed. '));
      return res.status(401).json({ error: errorMessage, redirectUrl: new HandCashService().getRedirectionUrl() });
    }

    const handCashService = new HandCashService(authToken);
    const spendableBalance = await handCashService.getSpendableBalance();
    console.log('Spendable Balance:', spendableBalance);
    if (spendableBalance.spendableFiatBalance < 1) {
      console.log('Low Balance');
      const errorMessage = getErrorMessage(new Error('Low balance, please top up or increase your spending limit.'));
      return res.status(400).json({ error: errorMessage });
      
  }

    let paymentAmount = calculatePaymentAmount(requesttype, model);
    console.log('Processed Payment Amount:', paymentAmount); 

    const paymentResult = await makePayment(authToken, paymentAmount, model);
    console.log('Transaction ID:', paymentResult.transactionId);

    return res.status(200).json({ status: 'sent', transactionId: paymentResult.transactionId });
  } catch (error) {
    console.error(error);
    const errorMessage = getErrorMessage(error);
    return res.status(500).json({ error: errorMessage }); // Defaulting to 500 for any server-side error
}

}

function calculatePaymentAmount(requesttype, model) {
  switch (requesttype) {
    case 'image':
      return model === 'dall-e-2' ? process.env.DALLE2_AMOUNT : process.env.DALLE3_AMOUNT;
    case 'meme':
      return process.env.MEME_AMOUNT;
    case 'text':
      return model === 'gpt-4' ? process.env.GPT4_AMOUNT : process.env.GPT3_AMOUNT;
    default:
      return process.env.CHAT_AMOUNT;
  }
}

async function makePayment(authToken, paymentAmount, model) {
  return await new HandCashService(authToken).pay({
    destination: process.env.DEST,
    amount: paymentAmount,
    currencyCode: process.env.CURRENCY,
    description: 'ChatBSV - ' + model.toUpperCase()
  });
}