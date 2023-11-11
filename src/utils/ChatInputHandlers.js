// src/utils/ChatInputHandlers.js

import { nanoid } from 'nanoid';
import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export const handleFormSubmit = async (event, prompt, storedTxid, requestType, handleSubmit, setPaymentResult, inputRef) => {
  event.preventDefault();
  if (prompt) {
    await handleSubmit(prompt, storedTxid, requestType);
    inputRef.current.value = '';
    setPaymentResult({ status: 'none' });
  }
};

export const pay = async (inputRef, redirectionUrl, setPaymentResult, addMessageToChat, helpContent, setTxid, handleSubmit) => {
  const { isAuthenticated, sessionToken } = useContext(AuthContext);
  const prompt = inputRef.current.value.trim();

  if (!isAuthenticated) {
    window.location.href = redirectionUrl;
    return;
  }

  if (prompt.toLowerCase().startsWith('/help')) {
    handleHelpRequest(prompt, addMessageToChat, helpContent);
    return;
  }

  localStorage.removeItem('txid');
  const requestType = prompt.toLowerCase().startsWith('/imagine') ? 'image' : 'text';

  const headers = new Headers({
    'Authorization': `Bearer ${sessionToken}`,
    'Content-Type': 'application/json',
    'requesttype': requestType
  });

  setPaymentResult({ status: 'pending' });
  try {
    const response = await fetch('/api/pay', { method: "POST", headers });
    if (!response.ok) {
      const errorResult = await response.json();
      setPaymentResult({ status: 'error', message: errorResult.error });
      addMessageToChat({
        id: nanoid(),
        role: 'error',
        content: errorResult.error || "An unexpected error occurred.",
        txid: '',
      });

      // Check if the error is due to expired or invalid token
      if (errorResult.error.includes('Expired authorization')) {
        // Store the prompt
        localStorage.setItem('pendingPrompt', prompt);
        // Redirect for re-authentication
        window.location.href = `${redirectionUrl}?prompt=${encodeURIComponent(prompt)}`;
      }
      return;
    }

    const paymentResult = await response.json();
    if (paymentResult.status === 'sent') {
      localStorage.setItem('txid', paymentResult.transactionId);
      setTxid(paymentResult.transactionId);
      handleFormSubmit(new Event('submit'), prompt, paymentResult.transactionId, requestType, handleSubmit, setPaymentResult, inputRef);
    } else {
      setPaymentResult(paymentResult);
    }
  } catch (error) {
    const errorMessage = error.message || "An unexpected network error occurred.";
    setPaymentResult({ status: 'error', message: errorMessage });
    addMessageToChat({
      id: nanoid(),
      role: 'error',
      content: errorMessage,
      txid: '',
    });
  }
};

export const handleHelpRequest = (helpCommand, addMessageToChat, helpContent) => {
  addMessageToChat({
    id: nanoid(),
    role: 'user',
    content: helpCommand,
    txid: '',
  });

  addMessageToChat({
    id: nanoid(),
    role: 'help',
    content: helpContent.message,
    txid: '',
  });
};
