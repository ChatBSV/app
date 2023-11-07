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
    
    const sessionToken = authorization.split(' ')[1];
    if (!sessionToken) {
      return res.status(401).json({ error: 'Missing authorization.' });
    }

    const { sessionId, user } = SessionTokenRepository.verify(sessionToken);
    const authToken = AuthTokenRepository.getById(sessionId);
    if (!authToken) {
      return res.status(401).json({ error: 'Expired authorization.' });
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
    return res.status(400).json({ status: 'error', error: errorMessage });
  }
}
