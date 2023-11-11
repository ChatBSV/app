// src/context/AuthContext.js

import React, { createContext, useState, useEffect } from 'react';
import { getCookieValue } from '../helpers/cookies'; // Adjust the import path as necessary

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [sessionToken, setSessionToken] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = getCookieValue('sessionToken'); // Retrieve the session token from cookies
        if (token) {
            setSessionToken(token);
            setIsAuthenticated(true);
        }
    }, []);

    const contextValue = {
        sessionToken,
        isAuthenticated,
        setSessionToken,
        setIsAuthenticated
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

