// src/hooks/FetchChatReply.js

/**
 * Fetches a chat reply from the server.
 * 
 * @param {string} prompt - The prompt for the chat reply.
 * @param {Array} chatHistory - The chat history.
 * @param {string} currentThread - The current thread.
 * @param {string} requestType - The request type.
 * @param {function} setIsLoading - The function to set the loading state.
 * @param {function} setIsError - The function to set the error state.
 * @param {function} setErrorMessage - The function to set the error message.
 * @param {function} addMessageToChat - The function to add a message to the chat.
 * @returns {Promise} - A promise that resolves to the chat reply data or null if there was an error.
 */

import getErrorMessage from '../lib/getErrorMessage';
import { tokenizeChatHistory } from './ChatTokenizer';
import { nanoid } from 'nanoid';

export const fetchChatReply = async (prompt, chatHistory, currentThread, requestType, setIsLoading, setIsError, setErrorMessage, addMessageToChat) => {
  setIsLoading(true);
  setIsError(false);
  setErrorMessage('');

  try {
    const tokenizedHistory = await tokenizeChatHistory(chatHistory.map(m => m.content).join('\n'));

    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 298000);

    const response = await fetch('/api/get-chat-reply', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'request-type': requestType
      },
      body: JSON.stringify({ prompt, history: tokenizedHistory }),
      signal: controller.signal,
    });

    clearTimeout(id);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
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

export default fetchChatReply;
