import jwt from "jsonwebtoken";

const jwtSecret = process.env.jwt_secret;

export default class SessionTokenRepository {
    static generate(payload) {
        return jwt.sign(payload, jwtSecret);
    };

    static verify(token) {
        try {
            jwt.verify(token, jwtSecret);
            return true;
        } catch(err) {
            return false;
        }
    }

    static decode(token) {
        return jwt.decode(token);
    }
}
