// src/hooks/HandleSubmit.js

import { nanoid } from 'nanoid';
import fetchChatReply from './FetchChatReply';

export const handleSubmit = (
  currentThread, // Ensure currentThread is being passed in correctly
  addMessageToChat,
  setIsLoading,
  setIsError,
  setErrorMessage,
  setTxid,
  saveThreadMessages // This function will save messages to the current thread
) => async (userMessage, txid, requestType) => {
  setIsLoading(true);
  setIsError(false);
  setErrorMessage('');

  // Logging currentThread details for debugging
  console.log('Current Thread in handleSubmit:', currentThread);

  // Check if there is a current thread selected before adding a new user message
  if (currentThread && Array.isArray(currentThread.messages)) {
    const newUserMessage = {
      id: nanoid(),
      role: 'user',
      content: userMessage,
      txid: txid,
    };

    // Add the new user message to the chat
    addMessageToChat(newUserMessage);
    // Save the message to the current thread's messages
    saveThreadMessages(currentThread.id, [...currentThread.messages, newUserMessage]);

    const chatReply = await fetchChatReply(userMessage, currentThread.messages, requestType, setIsLoading, setIsError, setErrorMessage, addMessageToChat);
    if (chatReply) {
      let newMessage;
      if (requestType === 'image') {
        newMessage = {
          id: nanoid(),
          role: 'dalle-image',
          content: chatReply.imageUrl,
          txid: txid,
        };
      } else if (requestType === 'meme') {
        newMessage = {
          id: nanoid(),
          role: 'meme-image',
          content: chatReply.imageUrl,
          txid: txid,
        };
      } else {
        newMessage = {
          id: nanoid(),
          role: 'assistant',
          content: chatReply.message,
          tokens: chatReply.tokens || 0,
          txid: txid,
        };
      }

      // Add the chat reply message to the chat
      addMessageToChat(newMessage);
      // Save the chat reply message to the current thread's messages as well
      saveThreadMessages(currentThread.id, [...currentThread.messages, newMessage]);
      setTxid(txid);
    }
  } else {
    // If currentThread or currentThread.messages is not defined or not an array, throw an error or handle appropriately
    console.error('Current thread is not set or currentThread.messages is not iterable');
  }

  setIsLoading(false);
};

export default handleSubmit;
