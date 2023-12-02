export default (req, res) => {
    res.setHeader('Set-Cookie', `sessionToken=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0`);
    res.status(200).end();
};