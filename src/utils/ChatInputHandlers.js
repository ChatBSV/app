// src/utils/ChatInputHandlers.js

import { nanoid } from 'nanoid';

export const handleFormSubmit = async (event, prompt, storedTxid, requestType, handleSubmit, setPaymentResult, inputRef) => {
  event.preventDefault();
  if (prompt) {
    await handleSubmit(prompt, storedTxid, requestType);
    inputRef.current.value = '';
    setPaymentResult({ status: 'none' });
  }
};

export const pay = async (inputRef, isConnected, redirectionUrl, sessionToken, setPaymentResult, addMessageToChat, helpContent, setTxid, handleSubmit) => {
  const prompt = inputRef.current.value.trim();

  if (!isConnected) {
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
      if (response.status === 401) {
        // Handle 401 Unauthorized response by redirecting for reauthorization
        const requestType = prompt.toLowerCase().startsWith('/imagine') ? 'image' : 'text';
        const pendingPrompt = JSON.stringify({ type: requestType, content: prompt });
        localStorage.setItem('pendingPrompt', pendingPrompt);

        window.location.href = redirectionUrl;
        return;
      }
      setPaymentResult({ status: 'error', message: errorResult.error });
      addMessageToChat({
        id: nanoid(),
        role: 'error',
        content: errorResult.error || "An unexpected error occurred.",
        txid: '',
      });
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
    content: helpContent,
    txid: '',
  });
};
