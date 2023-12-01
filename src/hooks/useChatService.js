// src/hooks/useChatService.js

import { useState, useEffect, useCallback } from 'react';
import { nanoid } from 'nanoid';
import getErrorMessage from '../lib/getErrorMessage';
import helpContent from '../../help.html';

export const useChatService = ({ tokens, redirectionUrl, sessionToken, user }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [chat, setChat] = useState([]);
  const [txid, setTxid] = useState('');

  useEffect(() => {
    const storedChat = localStorage.getItem('chat');
    if (storedChat) {
      const existingChat = JSON.parse(storedChat).map(message => ({ ...message, isNew: false }));
      setChat(existingChat);
    }
  }, []);

  const addMessageToChat = useCallback((message, isNew = true) => {
    setChat((prevChat) => {
      const newMessage = { ...message, isNew };
      const updatedChat = [...prevChat, newMessage];
      const chatWithoutErrors = updatedChat.filter(msg => msg.role !== 'error');
      localStorage.setItem('chat', JSON.stringify(chatWithoutErrors));
      return updatedChat;
    });
  }, []);

  const tokenizeChatHistory = async (chatHistory) => {
    try {
      const response = await fetch('/api/tokenizer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ chatHistory })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const { processedHistory } = await response.json();
      // Reconstruct the array of message objects from the processed history
      return processedHistory.split('\n').map(content => ({ role: 'user', content }));
    } catch (error) {
      console.error('Error in tokenizing chat history:', error);
      throw error; // Rethrow error to be handled in the caller function
    }
  };

  const getChatReply = async (prompt, chatHistory, requestType) => {
    setIsLoading(true);
    setIsError(false);
    setErrorMessage('');

    try {
      // Tokenize and trim the chat history
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

  const handleHelpRequest = useCallback((helpCommand) => {
    addMessageToChat({
      id: nanoid(),
      role: 'help',
      content: helpContent.message,
      txid: ''
    }, false);
  }, [addMessageToChat]);

  const handleSubmit = async (userMessage, txid, requestType) => {
    setIsLoading(true);
    setIsError(false);
    setErrorMessage('');

    const newUserMessage = {
      id: nanoid(),
      role: 'user',
      content: userMessage,
      txid: txid,
    };

    addMessageToChat(newUserMessage);

    const chatReply = await getChatReply(userMessage, chat, requestType);
    if (chatReply) {
      let newMessage;
      if (requestType === 'meme') {
        newMessage = {
          id: nanoid(),
          role: 'meme', // Adjust to 'meme' to match with ChatMessage component
          content: chatReply.imageUrl, // Expecting a single image URL
          txid: txid,
        };
      } else if (requestType === 'meme') {
        newMessage = {
          id: nanoid(),
          role: 'meme-image', // New role for meme images
          content: chatReply.memes, // Array of meme URLs
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

      addMessageToChat(newMessage);
    }

    setIsLoading(false);
  };

  return { isLoading, isError, errorMessage, chat, addMessageToChat, txid, handleSubmit, handleHelpRequest };
};

export default useChatService;