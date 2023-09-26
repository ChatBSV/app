import {v4 as uuidv4} from 'uuid';
import AuthTokenRepository from "../../../../src/repositories/AuthTokenRepository";
import HandCashService from "../../../../src/services/HandCashService";
import SessionTokenRepository from "../../../../src/repositories/SessionTokenRepository";


export default async function handler(req, res) {
    const {authToken} = req.query;

    const {publicProfile} = await new HandCashService(authToken).getProfile();

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
    // Definir o cookie
    res.setHeader('Set-Cookie', `sessionToken=${sessionToken}; Path=/; HttpOnly; SameSite=Strict`);

    // Redirecionar o usuário
    // return res.redirect('/');
    return res.redirect('/?reload=true');
    // return res.redirect(`/?sessionToken=${sessionToken}`);
}
