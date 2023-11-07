// pages/api/pay.js

import AuthTokenRepository from "../../src/repositories/AuthTokenRepository";
import HandCashService from "../../src/services/HandCashService";
import SessionTokenRepository from "../../src/repositories/SessionTokenRepository";
import getErrorMessage from "../../lib/getErrorMessage";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(404).json({ error: 'Not found' });
  }

  try {
    const { authorization, requesttype } = req.headers;
    
    const sessionToken = authorization?.split(' ')[1];
    if (!sessionToken) {
      throw new Error('Missing authorization.'); // Throw an error to be caught below
    }

    const { sessionId, user } = SessionTokenRepository.verify(sessionToken);
    const authToken = AuthTokenRepository.getById(sessionId);
    if (!authToken) {
      throw new Error('Expired authorization.'); // Throw an error to be caught below
    }

    const paymentAmount = requesttype === 'image' ? process.env.IMAGE_AMOUNT : process.env.CHAT_AMOUNT;

    const paymentResult = await new HandCashService(authToken).pay({
      destination: process.env.DEST,
      amount: paymentAmount,
      currencyCode: process.env.CURRENCY,
      description: 'ChatBSV payment'
    });

    return res.status(200).json({ status: 'sent', transactionId: paymentResult.transactionId });
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    res.status(error.status || 500).json({ status: 'error', error: errorMessage });
  }
}
