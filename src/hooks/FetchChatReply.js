// src/hooks/FetchChatReply.js

import getErrorMessage from '../lib/getErrorMessage';

export async function fetchChatReply(prompt, tokenizedHistory, requestType) {
  try {
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

    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    throw new Error(getErrorMessage(error));
  }
}
