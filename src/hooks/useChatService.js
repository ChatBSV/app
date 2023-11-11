// src/hooks/useChatService.js

import { useState, useEffect, useCallback } from 'react';
import { nanoid } from 'nanoid';
import getErrorMessage from '../lib/getErrorMessage';
import helpContent from '../../help.json';


export const useChatService = ({ tokens, redirectionUrl, sessionToken, user }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [chat, setChat] = useState([]);
  const [txid, setTxid] = useState('');

  useEffect(() => {
    const storedChat = localStorage.getItem('chat');
    if (storedChat) {
      // Load existing messages and mark them as not new
      const existingChat = JSON.parse(storedChat).map(message => ({ ...message, isNew: false }));
      setChat(existingChat);
    }
  }, []);

  const addMessageToChat = useCallback((message, isNew = true) => {
    setChat((prevChat) => {
      const newMessage = { ...message, isNew }; // Mark new messages with the isNew flag
      const updatedChat = [...prevChat, newMessage];
      const chatWithoutErrors = updatedChat.filter(msg => msg.role !== 'error');
      localStorage.setItem('chat', JSON.stringify(chatWithoutErrors));
      return updatedChat;
    });
  }, []);


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
    // Add help message directly to the chat
    addMessageToChat({
      id: nanoid(),
      role: 'help',
      content: helpContent.message, // Assuming help.json has a message field
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

  return { isLoading, isError, errorMessage, chat, addMessageToChat, txid, handleSubmit, handleHelpRequest };
};

export default useChatService;
