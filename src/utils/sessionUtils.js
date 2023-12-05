// src/utils/sessionUtils.js

/**
 * Retrieves session properties from the request object.
 * @param {Object} options - The options object.
 * @param {Object} options.req - The request object.
 * @returns {Object} - The session properties.
 */

import HandCashService from "../services/HandCashService";
import SessionTokenRepository from "../repositories/SessionTokenRepository";

export function getSessionProps({ req }) {
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
            userDecoded = SessionTokenRepository.decode(sessionTokenFromCookie).user;
            console.log('getSessionProps: Decoded user from token:', userDecoded);
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
