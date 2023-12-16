// src/utils/sessionUtils.js

import HandCashService from "../services/HandCashService";
import SessionTokenRepository from "../repositories/SessionTokenRepository";
import { CURRENT_SESSION_VERSION } from "../utils/constants";

export function getSessionProps({ req, res }) {
    const cookies = req.headers.cookie || '';
    let sessionTokenFromCookie;
    let redirectionUrl = '';
    let userDecoded = null;

    console.log('getSessionProps: Starting to process session props.');

    try {
        // Extract the session token from the cookies
        sessionTokenFromCookie = cookies
            .split('; ')
            .find(row => row.startsWith('sessionToken='))
            ?.split('=')[1];
        console.log('getSessionProps: Retrieved sessionTokenFromCookie:', sessionTokenFromCookie);

        // Fetch redirection URL server-side
        redirectionUrl = new HandCashService().getRedirectionUrl();
        console.log('getSessionProps: Retrieved redirectionUrl:', redirectionUrl);

        // Decode user data from the session token
        if (sessionTokenFromCookie) {
            const decodedToken = SessionTokenRepository.decode(sessionTokenFromCookie);
            userDecoded = decodedToken.user;
            console.log('getSessionProps: Decoded user from token:', userDecoded);

            // If the version does not match, reset the sessionToken
            if (decodedToken.version !== CURRENT_SESSION_VERSION) {
                const newSessionToken = SessionTokenRepository.generate({ user: userDecoded, version: CURRENT_SESSION_VERSION });
                res.setHeader('Set-Cookie', `sessionToken=${newSessionToken}; Path=/; HttpOnly; SameSite=Strict`);
                console.log('getSessionProps: Session token version updated and new token set in cookie.');
            }
        } else {
            console.log('getSessionProps: No session token found in cookies.');
        }
    } catch (error) {
        console.error('getSessionProps: Error:', error);
    }

    // Return the session token and user data as props
    return {
        props: {
            redirectionUrl,
            sessionToken: sessionTokenFromCookie || null,
            user: userDecoded || null,
        },
    };
}
