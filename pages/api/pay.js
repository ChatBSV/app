// pay.js

import AuthTokenRepository from "../../src/repositories/AuthTokenRepository";
import HandCashService from "../../src/services/HandCashService";
import SessionTokenRepository from "../../src/repositories/SessionTokenRepository";

export default async function handler(req, res) {
    console.log('pay.js: Entered handler');
    if (req.method !== 'POST') {
        return res.status(404).json({error: 'Not a POST request'});
    }
    try {
        
        const {authorization} = req.headers;
        console.log('pay.js: Authorization header:', authorization);
        
        const sessionToken = authorization.split(' ')[1];
        if (!sessionToken) {
            return res.status(401).json({error: 'Missing authorization.'});
        }

        const {sessionId, user} = SessionTokenRepository.verify(sessionToken);
        const authToken = AuthTokenRepository.getById(sessionId);
        if (!authToken) {
            return res.status(401).json({status: 'error', error: 'Expired authorization.'});
        }
        const paymentResult = await new HandCashService(authToken).pay({
            destination: process.env.DEST, 
            amount: process.env.AMOUNT, 
            currencyCode: process.env.CURRENCY, 
            description: 'ChatBSV payment'
        });
        return res.status(200).json({status: 'sent', transactionId: paymentResult.transactionId});
    } catch (error) {
        console.error('pay.js: Error', error);
        return res.status(400).json({status: 'error', message: error.toString()});
    }
}
