// src/utils/sessionUtils.js

import HandCashService from "../services/HandCashService";
import SessionTokenRepository from "../repositories/SessionTokenRepository";

export function getSessionProps({ query, req }) {
    const cookies = req.headers.cookie || '';
    let sessionTokenFromCookie;
    let redirectionUrl = '';

    try {
        sessionTokenFromCookie = cookies
            .split('; ')
            .find(row => row.startsWith('sessionToken='))
            ?.split('=')[1];

        redirectionUrl = new HandCashService().getRedirectionUrl(); // Fetch redirection URL server-side
    } catch (error) {
        console.error('Error while parsing cookies or fetching redirection URL:', error);
    }

    let decodedSession = null;
    let validToken = false;

    if (sessionTokenFromCookie) {
        try {
            decodedSession = SessionTokenRepository.verify(sessionTokenFromCookie);
            validToken = true;
        } catch (error) {
            console.error('Invalid or expired session token:', error);
            validToken = false;
        }
    } else {
        console.log("No session token found.");
    }

    return {
        props: {
            redirectionUrl,
            sessionToken: validToken ? sessionTokenFromCookie : false,
            user: validToken ? decodedSession.user : false,
        },
    };
}
