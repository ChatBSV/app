// pages/api/get-chat-reply.js

/**
 * Handles the API request to get a chat reply.
 * @param {Object} req - The request object.
 * @param {Object} req.body - The request body.
 * @param {string} req.body.prompt - The prompt for generating the chat reply.
 * @param {string[]} req.body.history - The chat history.
 * @param {Object} req.headers - The request headers.
 * @param {string} req.headers['request-type'] - The type of request ('image', 'meme', or any other value).
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves when the chat reply is generated and sent as a response.
 * @throws {Error} - If the prompt is missing or if an error occurs during processing.
 */

import { handleOpenAIRequest } from './openai';
import { handleDalleRequest } from './dalle';
import { handleMemeRequest } from './meme';
import getErrorMessage from '../../src/lib/getErrorMessage';

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
    let imageUrl;

    switch (requestType) {
      case 'image':
        if (!prompt) {
          throw new Error('Prompt is required for image generation');
        }
        ({ imageUrl } = await handleDalleRequest({ prompt })); 
        res.status(200).json({ imageUrl, tokens: 10000 });
        break;

      case 'meme':
        if (!prompt) {
          throw new Error('Text is required for meme generation');
        }
        ({ imageUrl } = await handleMemeRequest({ text: prompt }));
        res.status(200).json({ imageUrl });
        break;

      default:
        const { message, tokens } = await handleOpenAIRequest(prompt, history);
        res.status(200).json({ message, tokens });
    }
  } catch (error) {
    console.error('Error in get-chat-reply:', error);

    let detailedErrorMessage = getErrorMessage(error);
    if (error.response && error.response.data) {
      console.error('OpenAI Error Response:', error.response.data);
      detailedErrorMessage = `OpenAI Error: ${getErrorMessage(error.response.data)}`;
    }

    res.status(500).json({
      error: 'An error occurred during processing.',
      details: detailedErrorMessage,
    });
  }
}
