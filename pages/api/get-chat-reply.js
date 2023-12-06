// pages/api/get-chat-reply.js

import { handleOpenAIRequest } from './openai';
import { handleDalleRequest } from './dalle';
import { handleDalle2Request } from './dalle2'; // Import handler for DALL-E 2
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
  const selectedModel = req.body.model || 'gpt-3.5-turbo'; // Default to GPT
  const selectedDalleModel = req.body.model || 'dall-e-3'; // Default to DALL-E 3
  let imageUrl = ''; // Declare imageUrl here

  try {
    switch (requestType) {
      case 'image':
        if (!prompt) {
          throw new Error('Prompt is required for image generation');
        }

        if (selectedModel === 'dall-e-2') {
          // Route to DALL-E 2 handler
          const result = await handleDalle2Request({ prompt, model: selectedModel });
          imageUrl = result.imageUrl;
        } else {
          // Route to DALL-E 3 handler
          const result = await handleDalleRequest({ prompt, model: selectedModel });
          imageUrl = result.imageUrl;
        }
        res.status(200).json({ imageUrl, tokens: 10000, model: selectedModel });
        break;

      case 'meme':
        if (!prompt) {
          throw new Error('Text is required for meme generation');
        }
        const memeResult = await handleMemeRequest({ text: prompt });
        imageUrl = memeResult.imageUrl;
        res.status(200).json({ imageUrl, model: selectedModel });
        break;

      default:
        // Handle GPT requests
        const { message, tokens } = await handleOpenAIRequest(prompt, history, selectedModel); // Pass selectedModel here
        res.status(200).json({ message, tokens, model: selectedModel });
        break;
    }
  } catch (error) {
    console.error('Error in get-chat-reply:', error);
    let detailedErrorMessage = getErrorMessage(error);
    if (error.response && error.response.data) {
      detailedErrorMessage = `OpenAI Error: ${getErrorMessage(error.response.data)}`;
    }
    res.status(500).json({
      error: 'An error occurred during processing.',
      details: detailedErrorMessage,
    });
  }
}
