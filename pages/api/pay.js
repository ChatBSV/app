// pages/api/pay.js
import AuthTokenRepository from "../../src/repositories/AuthTokenRepository";
import HandCashService from "../../src/services/HandCashService";
import SessionTokenRepository from "../../src/repositories/SessionTokenRepository";

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(404).json({error: 'Not a POST request'});
    }
    try {
        const {authorization, requestType} = req.headers;  // Extract requestType from headers
        const sessionToken = authorization.split(' ')[1];
        if (!sessionToken) {
            return res.status(401).json({error: 'Missing authorization.'});
        }

        const authTokenRepo = new AuthTokenRepository();
        const sessionTokenRepo = new SessionTokenRepository();
        const isSessionTokenValid = sessionTokenRepo.verify(sessionToken);

        if (!isSessionTokenValid) {
          return res.status(401).json({ error: 'Invalid session token' });
        }

        // Determine the payment amount based on the request type
        let paymentAmount = parseFloat(process.env.CHAT_AMOUNT);  // Default amount for chat
        if (requestType === 'image') {
            paymentAmount = parseFloat(process.env.IMAGE_AMOUNT);  // Amount for DALL-E image request
        }

        const handCashService = new HandCashService();
        const paymentResult = await handCashService.pay(paymentAmount, requestType, sessionToken);

        res.status(200).json(paymentResult);
    } catch (error) {
        console.error('pay.js: Error', error);
        return res.status(400).json({status: 'error', message: error.toString()});
    }
}
