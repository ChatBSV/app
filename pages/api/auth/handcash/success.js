// pages/api/handcash/success.js

import {v4 as uuidv4} from 'uuid';
import AuthTokenRepository from "../../../../src/repositories/AuthTokenRepository";
import HandCashService from "../../../../src/services/HandCashService";
import SessionTokenRepository from "../../../../src/repositories/SessionTokenRepository";

export default async function handler(req, res) {
    const { authToken, state } = req.query; // Ensure authToken is correctly extracted from req.query
    let prompt = '';

    if (state && state.startsWith('prompt=')) {
        prompt = decodeURIComponent(state.split('=')[1]);
    }

    const { publicProfile } = await new HandCashService(authToken).getProfile(); // authToken is used here

    const payload = {
        sessionId: uuidv4(),
        user: {
            handle: publicProfile.handle,
            displayName: publicProfile.displayName,
            avatarUrl: publicProfile.avatarUrl,
        },
    };
    const sessionToken = SessionTokenRepository.generate(payload);
    AuthTokenRepository.setAuthToken(authToken, payload.sessionId);
    res.setHeader('Set-Cookie', `sessionToken=${sessionToken}; Path=/; HttpOnly; SameSite=Strict`);

    return res.redirect(`/?prompt=${encodeURIComponent(prompt)}`);
}
