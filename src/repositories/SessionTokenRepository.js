// src/repositories/SessionTokenRepository.js

import jwt from "jsonwebtoken";

// Ensuring that environment variables are loaded correctly
import dotenv from 'dotenv';
dotenv.config();

const jwtSecret = process.env.jwt_secret;

export default class SessionTokenRepository {
    static generate(payload) {
        return jwt.sign(payload, jwtSecret);
    };

    static verify(token) {
        try {
            return jwt.verify(token, jwtSecret); 
        } catch(err) {
            console.error("Token verification error:", err.message); // More detailed error logging
            return false;
        }
    }

    static decode(token) {
        return jwt.decode(token);
    }
}
