// useChatService.js

import { useState, useEffect, useCallback } from 'react';
import { nanoid } from 'nanoid';
import getErrorMessage from '../lib/getErrorMessage';
import helpContent from '../../content/help.html';

export const useChatService = ({ tokens, redirectionUrl, sessionToken, user }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [chat, setChat] = useState([]);
  const [paymentInfo, setPaymentInfo] = useState({ txid: '', tokens: 0 });

  useEffect(() => {
    const storedChat = localStorage.getItem('chat');
    if (storedChat) {
      const existingChat = JSON.parse(storedChat).map(message => ({
        ...message,
        isNew: false
      }));
      setChat(existingChat);
    }
  }, []);

  const addMessageToChat = useCallback((message, isNew = true) => {
    const newMessage = { ...message, isNew };
    setChat(prevChat => {
      const updatedChat = [...prevChat, newMessage];
      if (message.role !== 'error') {
        localStorage.setItem('chat', JSON.stringify(updatedChat));
      }
      return updatedChat;
    });
  }, []);

  const tokenizeChatHistory = async (chatHistory) => {
    try {
      const response = await fetch('/api/tokenizer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ chatHistory }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error!`);
    }
    

      const { processedHistory } = await response.json();
      return processedHistory.split('\n').map(content => ({ role: 'user', content }));
    } catch (error) {
      console.error('Error in tokenizeChatHistory:', error);
      throw error;
    }
  };

  const getChatReply = async (prompt, chatHistory, requestType, selectedModel) => {
    setIsLoading(true);
    setIsError(false);
    setErrorMessage('');

    try {
      const filteredChatHistory = chatHistory.filter(
        (message) => !['help', 'loading', 'error', 'image'].includes(message.role)
      );

      const tokenizedHistory = await tokenizeChatHistory(filteredChatHistory.map(m => m.content).join('\n'));

      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), 298000);
      console.log(`User to ${selectedModel}: ${prompt}`);

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
  
    const selectedModel = localStorage.getItem('selectedModel') || 'gpt-3.5-turbo';
    const selectedDalleModel = localStorage.getItem('selectedDalleModel') || 'dall-e-3';
  
    const newUserMessage = {
      id: nanoid(),
      role: 'user',
      content: userMessage,
      txid: txid,
      model: requestType === 'image' ? selectedDalleModel : (requestType === 'meme' ? 'meme' : selectedModel),
    };
  
    addMessageToChat(newUserMessage);
  
    const chatReply = await getChatReply(userMessage, chat, requestType, 
      requestType === 'image' ? selectedDalleModel : selectedModel);
  
    if (chatReply) {
      let newMessage;
      if (requestType === 'image') {
        newMessage = {
          id: nanoid(),
          role: 'dalle-image',
          content: chatReply.imageUrl,
          txid: txid,
          model: selectedDalleModel, 
        };
      } else if (requestType === 'meme') {
        newMessage = {
          id: nanoid(),
          role: 'meme-image',
          content: chatReply.imageUrl,
          txid: txid,
          model: 'meme'
        };
      } else {
        newMessage = {
          id: nanoid(),
          role: 'assistant',
          content: chatReply.message,
          tokens: chatReply.tokens || 0,
          txid: txid,
          model: selectedModel,
        };
      }
  
      addMessageToChat(newMessage);
    }
  
    setIsLoading(false);
  };

  return { isLoading, isError, errorMessage, chat, addMessageToChat, handleSubmit, handleHelpRequest };
};

export default useChatService;
