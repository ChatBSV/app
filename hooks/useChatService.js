// hooks/useChatService.js

import { useState, useEffect } from 'react';
import { nanoid } from 'nanoid';
import getErrorMessage from '../lib/getErrorMessage';

export const useChatService = ({ tokens, redirectionUrl, sessionToken, user }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [chat, setChat] = useState([]);
  const [txid, setTxid] = useState('');

  useEffect(() => {
    const storedChat = localStorage.getItem('chat');
    if (storedChat) {
      // Filter out error messages from the stored chat
      const filteredChat = JSON.parse(storedChat).filter(message => message.role !== 'error');
      setChat(filteredChat);
    }
  }, []);

  const addMessageToChat = (message) => {
    setChat((prevChat) => {
      const updatedChat = [...prevChat, message];
      // Save to local storage without error messages
      const chatWithoutErrors = updatedChat.filter(msg => msg.role !== 'error');
      localStorage.setItem('chat', JSON.stringify(chatWithoutErrors));
      return updatedChat;
    });
  };

  const getChatReply = async (prompt, chatHistory, requestType) => {
    setIsLoading(true);
    setIsError(false);
    setErrorMessage('');
    try {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), 298000);

      const response = await fetch('/api/get-chat-reply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'request-type': requestType
        },
        body: JSON.stringify({ prompt, history: chatHistory }),
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
      setErrorMessage(getErrorMessage(error));
      return null; // Return null to indicate an error occurred
    } finally {
      setIsLoading(false);
    }
  };

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
      const newMessage = {
        id: nanoid(),
        role: requestType === 'image' ? 'dalle-image' : 'assistant',
        content: requestType === 'image' ? chatReply.imageUrl : chatReply.message,
        tokens: chatReply.tokens || 0,
        txid: txid,
      };

      addMessageToChat(newMessage);
    }

    setIsLoading(false);
  };

  return { isLoading, isError, errorMessage, chat, txid, handleSubmit };
};

export default useChatService;