// useChatService.js

import { useState, useEffect, useCallback } from 'react';
import { nanoid } from 'nanoid';
import getErrorMessage from '../lib/getErrorMessage';
import helpContent from '../../content/help.html';

export const useChatService = ({sessionToken}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [chat, setChat] = useState([]);
  const [txid, setTxid] = useState(''); // Add txid state


  useEffect(() => {
    const storedChat = localStorage.getItem('chat');
    if (storedChat) {
      const existingChat = JSON.parse(storedChat).map(message => ({ ...message, isNewMessage: false }));
      setChat(existingChat);
    }
  }, []);

  const addMessageToChat = useCallback((message, isNewMessage = true) => {
    setChat((prevChat) => {
      const newMessage = { ...message, isNewMessage };
      const updatedChat = [...prevChat, newMessage];
      const chatWithoutErrors = updatedChat.filter(msg => msg.role !== 'error');
      localStorage.setItem('chat', JSON.stringify(chatWithoutErrors));
      return updatedChat;
    });
  }, []);


  const tokenizeChatHistory = async (chatHistory, tokenLimit) => {
    try {
      // Iterate through each message and trim its content to fit within the token limit
      const trimmedMessages = chatHistory.map((message) => {
        // Calculate the maximum number of characters allowed for this message
        const maxChars = tokenLimit * 4; // Assuming 4 bytes per token (roughly 3 characters)
  
        // Trim the content of the message if it exceeds the maximum character limit
        if (message.content.length > maxChars) {
          message.content = message.content.substring(0, maxChars);
        }
  
        return message;
      });
  
      // Send the trimmed chat history as an array
      const response = await fetch('/api/tokenizer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ chatHistory: trimmedMessages }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error!`);
      }
  
      const { processedHistory } = await response.json();
      return processedHistory; // Return the processed history as a single string
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
  
      const tokenizedHistory = await tokenizeChatHistory(filteredChatHistory);
  
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
    const chatReply = await getChatReply(userMessage, chat, requestType, selectedModel);

    if (!chatReply) {
        setIsError(true);
        setErrorMessage('Failed to get chat reply');
        setIsLoading(false);
        return;
    }

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

return { isLoading, isError, errorMessage, chat, addMessageToChat, txid, handleSubmit, handleHelpRequest };
};

export default useChatService;

