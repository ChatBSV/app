// pages/api/getChatReply.js

import { handleOpenAIRequest } from './openai';
import { handleDalleRequest } from './dalle';

export default async function handler(req, res) {
  const { prompt, history } = req.body;
  const { requesttype } = req.headers;

  console.log('getChatReply.js: Request type:', requesttype);

  try {
    if (prompt.startsWith('/imagine')) {
      const { imageUrl } = await handleDalleRequest(req.body, req.headers);
      res.status(200).json({ imageUrl, tokens: 10000 });
    } else {
      const { message, tokens } = await handleOpenAIRequest(req.body, req.headers);
      res.status(200).json({ message, tokens });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred during processing.' });
  }
}