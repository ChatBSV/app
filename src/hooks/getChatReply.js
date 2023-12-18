// getChatReply.js

import { nanoid } from 'nanoid';
import getErrorMessage from '../lib/getErrorMessage';
import tokenizeChatHistory from './tokenizeChatHistory';

const getChatReply = async (prompt, chatHistory, requestType, selectedModel, setIsLoading, setIsError, setErrorMessage, addMessageToChat) => {
  setIsLoading(true);
  setIsError(false);
  setErrorMessage('');

  try {
    const filteredChatHistory = chatHistory.filter(
      (message) => !['help', 'loading', 'error', 'image'].includes(message.role)
    );

    const tokenizedHistory = await tokenizeChatHistory(filteredChatHistory);

    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 298000);
    console.log(`Request Type: ${requestType}`);
    console.log(`Model: ${requestType === 'meme' ? 'meme' : selectedModel}`);
    console.log(`Prompt: ${prompt}`);


    const response = await fetch('/api/get-chat-reply', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'request-type': requestType,
      },
      body: JSON.stringify({ prompt, history: tokenizedHistory, model: selectedModel }),
      signal: controller.signal,
    });

    clearTimeout(id);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error!`);
    }

    const data = await response.json();
    console.log('System Response:', data);
    return data;
  } catch (error) {
    console.error('Error in getChatReply:', error);
    setIsError(true);
    const errorText = getErrorMessage(error);
    setErrorMessage(errorText);
    addMessageToChat({
      id: nanoid(),
      role: 'error',
      content: errorText,
      txid: '',
    });
    return null;
  } finally {
    setIsLoading(false);
  }
};

export default getChatReply;
