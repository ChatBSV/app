// pages/api/auth-check.js

import AuthTokenRepository from "../../../../src/repositories/AuthTokenRepository";
import HandCashService from "../../../../src/services/HandCashService";
import SessionTokenRepository from "../../../../src/repositories/SessionTokenRepository";
import getErrorMessage from '../../../../src/lib/getErrorMessage';

export default async function authCheckHandler(req, res) {
    if (req.method !== 'POST') {
        return res.status(404).json({ error: 'Not found' });
    }

    try {
        const { authorization } = req.headers;

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
        if (spendableBalance.spendableFiatBalance < 1) {
            const errorMessage = getErrorMessage(new Error('Low balance, please top up or increase your spending limit.'));
            return res.status(400).json({ error: errorMessage });
        }

        return res.status(200).json({ status: 'success', message: 'Authentication and balance check successful.' });
    } catch (error) {
        console.error(error);
        const errorMessage = getErrorMessage(error);
        return res.status(500).json({ error: errorMessage });
    }
}
