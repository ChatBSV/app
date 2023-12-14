// pages/api/pay.js

import AuthTokenRepository from "../../src/repositories/AuthTokenRepository";
import HandCashService from "../../src/services/HandCashService";
import SessionTokenRepository from "../../src/repositories/SessionTokenRepository";
import getErrorMessage from '../../src/lib/getErrorMessage';
import { calculatePaymentAmount } from '../../src/utils/paymentUtils';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(404).json({ error: 'Not found' });
    }

    try {
        const { authorization, requesttype, model } = req.headers;
        const { tokens } = req.body;

        if (!authorization) {
            return res.status(401).json({ error: getErrorMessage(new Error('Missing authorization. Please reconnect to Handcash.')) });
        }

        const sessionToken = authorization.split(' ')[1];
        if (!sessionToken) {
            return res.status(401).json({ error: getErrorMessage(new Error('Missing session token. Please reconnect to Handcash.')) });
        }

        const { sessionId } = SessionTokenRepository.verify(sessionToken);
        const authToken = AuthTokenRepository.getById(sessionId);
        if (!authToken) {
            const errorMessage = getErrorMessage(new Error('Expired authentication. Reconnecting to Handcash. Please authorize to proceed. ')); 
            return res.status(401).json({ error: errorMessage, redirectUrl: new HandCashService().getRedirectionUrl() });
        }

        const paymentAmount = calculatePaymentAmount(requesttype, model, tokens);

        // Construct attachment metadata
        const metadata = {
          ChatBSV: 'ChatBSV',
          Model: model, // GPT-3, GPT-4, DALL-E-2, DALL-E-3, or MEME
          Type: tokens !== 10000 ? 'text' : 'image',
          Tokens: tokens !== 10000 ? tokens : null,
          PaymentAmountUSD: paymentAmount
        };

        const attachment = {
          format: 'json',
          value: metadata
        };

        const paymentResult = await makePayment(authToken, paymentAmount, model, tokens, attachment);

        return res.status(200).json({ status: 'sent', transactionId: paymentResult.transactionId });
    } catch (error) {
        console.error('Error in pay API:', error);
        const errorMessage = getErrorMessage(error);
        return res.status(500).json({ error: errorMessage });
    }
}

async function makePayment(authToken, paymentAmount, model, tokens, attachment) {
    const handCashService = new HandCashService(authToken);
    return await handCashService.pay({
        destination: process.env.DEST,
        amount: paymentAmount,
        currencyCode: process.env.CURRENCY,
        description: `ChatBSV ${model.toUpperCase().replace('-TURBO', '')}${tokens !== 10000 ? ` ${tokens} Tokens` : ' Image'}`.substring(0, 25).trim(),
        attachment: attachment // Include the attachment in the payment
    });
}
