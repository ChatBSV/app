// pages/api/pay.js
import AuthTokenRepository from "../../src/repositories/AuthTokenRepository";
import HandCashService from "../../src/services/HandCashService";
import SessionTokenRepository from "../../src/repositories/SessionTokenRepository";

export default async function handler(req, res) {
    console.log('pay.js: Entered handler');
    if (req.method !== 'POST') {
        return res.status(404).json({error: 'Not a POST request'});
    }
    try {
        const {authorization, requesttype} = req.headers;  // Extract requesttype from headers, note the lowercase
        console.log('pay.js: Authorization header:', authorization);
        console.log('pay.js: Request type:', requesttype);  // Log the request type
        
        const sessionToken = authorization.split(' ')[1];
        if (!sessionToken) {
            return res.status(401).json({error: 'Missing authorization.'});
        }

        const {sessionId, user} = SessionTokenRepository.verify(sessionToken);
        const authToken = AuthTokenRepository.getById(sessionId);
        if (!authToken) {
            return res.status(401).json({status: 'error', error: 'Expired authorization.'});
        }

        // Determine the payment amount based on the request type
        let paymentAmount = process.env.CHAT_AMOUNT;  // Default amount for chat
        if (requesttype === 'image') {
            paymentAmount = process.env.IMAGE_AMOUNT;  // Amount for DALL-E image request
        }
        console.log('pay.js: Using paymentAmount:', paymentAmount);  // Debug log to check used paymentAmount

        const paymentResult = await new HandCashService(authToken).pay({
            destination: process.env.DEST, 
            amount: paymentAmount,  // Use the determined amount
            currencyCode: process.env.CURRENCY, 
            description: 'ChatBSV4 payment'
        });
        return res.status(200).json({status: 'sent', transactionId: paymentResult.transactionId, requesttype: requesttype});
    } catch (error) {
        console.error('pay.js: Error', error);
        return res.status(400).json({status: 'error', message: error.toString()});
    }
}
