// pages/api/handcash/success.js

import {v4 as uuidv4} from 'uuid';
import AuthTokenRepository from "../../../../src/repositories/AuthTokenRepository";
import HandCashService from "../../../../src/services/HandCashService";
import SessionTokenRepository from "../../../../src/repositories/SessionTokenRepository";
import { CURRENT_SESSION_VERSION } from "../../../../src/utils/constants";


export default async function handler(req, res) {
    const { authToken } = req.query;

    const { publicProfile } = await new HandCashService(authToken).getProfile();

    const payload = {
        sessionId: uuidv4(),
        user: {
            handle: publicProfile.handle,
            displayName: publicProfile.displayName,
            avatarUrl: publicProfile.avatarUrl,
            version: CURRENT_SESSION_VERSION,

        },
    };
    const sessionToken = SessionTokenRepository.generate(payload);
    AuthTokenRepository.setAuthToken(authToken, payload.sessionId);
    res.setHeader('Set-Cookie', `sessionToken=${sessionToken}; Path=/; HttpOnly; SameSite=Lax`);

    // Redirect to the root or a default route
    return res.redirect('/?reload=true');
}