// pages/api/get-chat-reply.js

import { handleOpenAIRequest } from './openai';
import { handleDalleRequest } from './dalle';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
    externalResolver: true,
  },
};

export default async function handler(req, res) {
  const { prompt, history } = req.body;
  const requestType = req.headers['request-type'];

  try {
    if (requestType === 'image') {
      if (!prompt) {
        throw new Error('Prompt is required for image generation');
      }
      const { imageUrl } = await handleDalleRequest({ prompt });
      res.status(200).json({ imageUrl, tokens: 10000 }); 
    } else {
      const { message, tokens } = await handleOpenAIRequest(prompt, history);
      res.status(200).json({ message, tokens });
    }
  } catch (error) {
    console.error('Error in get-chat-reply:', error);

    if (error.response) {
      console.error('Error response data:', error.response.data);
      console.error('Error response status:', error.response.status);
    }

    res.status(500).json({
      error: 'An error occurred during processing.',
      details: error.response ? error.response.data : error.message,
    });
  }
}
