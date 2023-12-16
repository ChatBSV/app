// useChatService.js

import { useState, useEffect, useCallback } from 'react';
import { nanoid } from 'nanoid';
import getErrorMessage from '../lib/getErrorMessage';
import handleHelpRequest from './handleHelpRequest';
import getChatReply from './getChatReply'; // Importing the extracted module

export const useChatService = ({ sessionToken }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [chat, setChat] = useState([]);
  const [txid, setTxid] = useState('');

  useEffect(() => {
    const storedChat = localStorage.getItem('chat');
    if (storedChat) {
      const existingChat = JSON.parse(storedChat).map(message => ({ ...message, isNewMessage: false }));
      setChat(existingChat);
    } else {
      fetch('/api/prompts/core')
        .then(response => response.json())
        .then(data => {
          const corePrompt = data.corePrompt;
          setChat([{ id: '0', role: 'system', content: corePrompt }]);
          localStorage.setItem('chat', JSON.stringify([{ id: '0', role: 'system', content: corePrompt }]));
        })
        .catch(error => console.error('Failed to fetch CORE_PROMPT:', error));
    }
  }, []);

  const addMessageToChat = useCallback((message, isNewMessage = true) => {
    setChat((prevChat) => {
      const newMessage = { ...message, isNewMessage };
      let updatedChat = [...prevChat, newMessage];
      if (updatedChat.length === 1 && updatedChat[0].id === '0') {
        updatedChat = [newMessage];
      }
      const chatWithoutErrors = updatedChat.filter(msg => msg.role !== 'error');
      localStorage.setItem('chat', JSON.stringify(chatWithoutErrors));
      return updatedChat;
    });
  }, []);

  const handleSubmit = async (userMessage, requestType) => {
    setIsError(false);
    setErrorMessage('');
    
    // Step 1: Authenticate and Get Balance
    const authCheckResult = await fetch('/api/auth/handcash/auth-check', {
      method: 'POST',
      headers: {
          'Authorization': `Bearer ${sessionToken}`,
      }
  });

  if (!authCheckResult.ok) {
      const errorData = await authCheckResult.json();
      setIsError(true);
      setErrorMessage(getErrorMessage(errorData));
      if (authCheckResult.status === 401) {
          const pendingPrompt = JSON.stringify({ type: requestType, content: userMessage });
          localStorage.setItem('pendingPrompt', pendingPrompt);
          window.location.href = `${errorData.redirectUrl}?reload=false`;
      }
      return;
  }

    // Add user message to chat here, after successful authentication and balance check
    addMessageToChat({
        id: nanoid(),
        role: 'user',
        content: userMessage,
        txid: ''
    });
    setIsLoading(true);

    // Determine the model based on the request type
    const selectedModel = requestType === 'image' ? 
        (localStorage.getItem('selectedDalleModel') || 'dall-e-3') :
        (localStorage.getItem('selectedModel') || 'gpt-3.5-turbo');

    // Step 2: Get Chat Reply and Tokens
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

    // Step 3: Process Payment
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
        if (paymentResult.status === 401) {
            const pendingPrompt = JSON.stringify({ type: requestType, content: userMessage });
            localStorage.setItem('pendingPrompt', pendingPrompt);
            window.location.href = `${errorData.redirectUrl}?reload=false`;
        }
        return;
    }

    const { transactionId } = await paymentResult.json();
    setTxid(transactionId);

    // Step 4: Add Message with txid and Tokens
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
            model: 'meme'
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

    setIsLoading(false);
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
};
};

export default useChatService;

