// utils/sessionUtils.js

import HandCashService from "../services/HandCashService";
import SessionTokenRepository from "../repositories/SessionTokenRepository";

export function getSessionProps({query, req}) {
    const cookies = req.headers.cookie || '';
    let sessionTokenFromCookie;

    try {
        sessionTokenFromCookie = cookies
            .split('; ')
            .find(row => row.startsWith('sessionToken='))
            ?.split('=')[1];
    } catch (error) {
        console.error('Error while parsing cookies:', error);
        return {
            props: {
                redirectionUrl: new HandCashService().getRedirectionUrl(),
                sessionToken: false,
                user: false,
            },
        };
    }
    
    const sessionToken = sessionTokenFromCookie;
    const redirectionUrl = new HandCashService().getRedirectionUrl();
    
    // Check if session token is valid
    let decodedSession = null;
    let validToken = false;
    if (sessionToken) {
        try {
            decodedSession = SessionTokenRepository.verify(sessionToken);
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
            sessionToken: validToken ? sessionToken : false,
            user: validToken ? decodedSession.user : false,
        },
    };
}