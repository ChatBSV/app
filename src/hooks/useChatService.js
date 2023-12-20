// src/hooks/useChatService.js

import { useState, useEffect, useCallback } from 'react';
import { nanoid } from 'nanoid';
import getErrorMessage from '../lib/getErrorMessage';
import handleHelpRequest from './handleHelpRequest';
import getChatReply from './getChatReply';
import useThreadManager from './ThreadManager';

// Function to fetch core prompt
async function fetchCorePrompt() {
  try {
    const response = await fetch('/api/prompts/core');
    const data = await response.json();
    return data.corePrompt;
  } catch (error) {
    console.error('Error fetching core prompt:', error);
    return 'Default core prompt if not set in env';
  }
}

export const useChatService = ({ tokens, redirectionUrl, sessionToken, user }) => {
  // Existing state variables
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [chat, setChat] = useState([]);
  const [txid, setTxid] = useState('');

  // Thread manager hooks
  const { 
    threads, 
    createThread, 
    deleteThread, 
    deleteAllThreads, 
    selectThread, 
    currentThread, 
    saveThreadMessages, 
    saveThreadTitle 
  } = useThreadManager();

  // Effect for initializing and updating the chat
  useEffect(() => {
    fetchCorePrompt().then(corePrompt => {
      const updateChatWithCorePrompt = (storedChat) => {
        let chatData = storedChat ? JSON.parse(storedChat) : [];
        if (!chatData.length || chatData[0].role !== 'system') {
          chatData = [{ id: '0', role: 'system', content: corePrompt, timestamp: Date.now() }, ...chatData];
        }
        return chatData;
      };

      if (currentThread) {
        const storedChat = localStorage.getItem(`thread_${currentThread.id}`);
        setChat(updateChatWithCorePrompt(storedChat));
      } else {
        const storedChat = localStorage.getItem('chat');
        setChat(updateChatWithCorePrompt(storedChat));
      }
    });
  }, [currentThread]);

  // Function to add messages to chat
  const addMessageToChat = useCallback((message) => {
    setChat((prevChat) => {
      const timestampedMessage = { ...message, timestamp: Date.now() };
      let updatedChat = [...prevChat, timestampedMessage];

      if (updatedChat.length === 1 && updatedChat[0].id === '0') {
        updatedChat = [timestampedMessage];
      }
      const chatWithoutErrors = updatedChat.filter(msg => msg.role !== 'error');

      if (currentThread) {
        localStorage.setItem(`thread_${currentThread.id}`, JSON.stringify(chatWithoutErrors));
      } else {
        localStorage.setItem('chat', JSON.stringify(chatWithoutErrors));
      }

      return updatedChat;
    });
  }, [currentThread]);

  // Handle submit function
  const handleSubmit = async (userMessage, requestType) => {
    setIsLoading(true);
    setIsError(false);
    setErrorMessage('');

    try {
      const authCheckResult = await fetch('/api/auth/handcash/auth-check', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${sessionToken}` },
      });

      if (!authCheckResult.ok) {
        const errorData = await authCheckResult.json();
        setIsError(true);
        setErrorMessage(getErrorMessage(errorData));
        if (authCheckResult.status === 401) {
          const pendingPrompt = JSON.stringify({ type: requestType, content: userMessage });
          localStorage.setItem('pendingPrompt', pendingPrompt);
          window.location.href = `${errorData.redirectUrl}?reload=false`;
          return;
        }
      }

      addMessageToChat({
        id: nanoid(),
        role: 'user',
        content: userMessage,
        txid: ''
      });

      const selectedModel = requestType === 'image' ?
        (localStorage.getItem('selectedDalleModel') || 'dall-e-3') :
        (localStorage.getItem('selectedModel') || 'gpt-3.5-turbo');

      const chatReply = await getChatReply(
        userMessage,
        chat,
        requestType,
        selectedModel,
        setIsLoading,
        setIsError,
        setErrorMessage,
        addMessageToChat
      );

      const tokensFromReply = chatReply.tokens || 0;

      const paymentResult = await fetch('/api/pay', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${sessionToken}`,
          'Content-Type': 'application/json',
          'requesttype': requestType,
          'model': selectedModel
        },
        body: JSON.stringify({ tokens: tokensFromReply })
      });

      if (!paymentResult.ok) {
        const errorData = await paymentResult.json();
        setIsError(true);
        setErrorMessage(getErrorMessage(errorData));
        setIsLoading(false);
        return;
      }

      const { transactionId } = await paymentResult.json();
      setTxid(transactionId);

      let newMessage;
      if (requestType === 'image') {
        newMessage = {
          id: nanoid(),
          role: 'dalle-image',
          content: chatReply.imageUrl,
          txid: transactionId,
          model: selectedModel,
        };
      } else if (requestType === 'meme') {
        newMessage = {
          id: nanoid(),
          role: 'meme-image',
          content: chatReply.imageUrl,
          txid: transactionId,
          model: 'meme',
        };
      } else {
        newMessage = {
          id: nanoid(),
          role: 'assistant',
          content: chatReply.message,
          tokens: tokensFromReply,
          txid: transactionId,
          model: selectedModel,
        };
      }
      addMessageToChat(newMessage);
      if (currentThread) {
        saveThreadMessages(currentThread.id, [...currentThread.messages, newMessage]);
      }
    } catch (error) {
      setIsError(true);
      const errorMessage = getErrorMessage(error) || "An unexpected network error occurred.";
      setErrorMessage(errorMessage);
      addMessageToChat({
        id: nanoid(),
        role: 'error',
        content: errorMessage,
        txid: '',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleHelpRequestWithChat = useCallback(handleHelpRequest(addMessageToChat), [addMessageToChat]);

  return {
    isLoading,
    isError,
    errorMessage,
    chat,
    addMessageToChat,
    txid,
    handleSubmit,
    handleHelpRequest: handleHelpRequestWithChat,
    threads,
    createThread,
    deleteThread,
    deleteAllThreads,
    selectThread,
    currentThread,
    saveThreadMessages,
    saveThreadTitle
  };
};

export default useChatService;