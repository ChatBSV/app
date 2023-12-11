// pages/api/get-chat-reply.js

import { handleOpenAIRequest3 } from './openai3';
import { handleOpenAIRequest4 } from './openai4';
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
    console.log(`get-chat-reply: Received model - ${selectedModel} for request type - ${requestType}`);
    console.log(`get-chat-reply: Received prompt - ${prompt}`);
    console.log(`get-chat-reply: Received history - ${history}`);

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
        console.log(`get-chat-reply: Image URL - ${imageUrl}`);
        res.status(200).json({ imageUrl, tokens: 10000, model: selectedModel });
        break;

      case 'meme':
        if (!prompt) {
          throw new Error('Text is required for meme generation');
        }
        const memeResult = await handleMemeRequest({ text: prompt });
        imageUrl = memeResult.imageUrl;
        console.log(`get-chat-reply: Meme Image URL - ${imageUrl}`);
        res.status(200).json({ imageUrl, model: selectedModel });
        break;

      default:
        let response;
        if (selectedModel === 'gpt-4') {
          response = await handleOpenAIRequest4(prompt, history, selectedModel); // Call GPT-4 handler
        } else {
          response = await handleOpenAIRequest3(prompt, history, selectedModel); // Call GPT-3.5 handler
        }
        console.log('get-chat-reply: Response from AI model:', response); // Log the AI response
        res.status(200).json(response);
        break;
    }
  } catch (error) {
    console.error('Error in get-chat-reply:', error);
    let detailedErrorMessage = getErrorMessage(error);
    if (error.response && error.response.data) {
      detailedErrorMessage = `OpenAI Error: ${getErrorMessage(error.response.data)}`;
    }
    console.error('get-chat-reply: Detailed Error Message -', detailedErrorMessage); // Log detailed error message
    res.status(500).json({
      error: 'An error occurred during processing.',
      details: detailedErrorMessage,
    });
  }
}
