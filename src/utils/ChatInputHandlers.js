// ChatInputHandlers.js

import { nanoid } from 'nanoid';

export const handleFormSubmit = async (event, prompt, storedTxid, requestType, handleSubmit, setPaymentResult, inputRef) => {
  event.preventDefault();
  if (prompt) {
    // Ensure handleSubmit is called with the correct txid
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

  const requestType = prompt.toLowerCase().startsWith('/imagine') ? 'image' :
                      prompt.toLowerCase().startsWith('/meme') ? 'meme' : 'text';

  let selectedModel;
  if (requestType === 'image') {
    selectedModel = localStorage.getItem('selectedDalleModel') || 'dall-e-3';
  } else if (requestType === 'meme') {
    selectedModel = 'meme';
  } else {
    selectedModel = localStorage.getItem('selectedModel') || 'gpt-3.5-turbo';
  }

  const headers = {
    'Authorization': `Bearer ${sessionToken}`,
    'Content-Type': 'application/json',
    'requesttype': requestType,
    'model': selectedModel
  };

  setPaymentResult({ status: 'pending' });
  try {
    const response = await fetch('/api/pay', { method: "POST", headers });
    if (!response.ok) {
      const errorResult = await response.json();
      if (response.status === 401) {
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
      // Store the txid after successful payment
      localStorage.setItem('txid', paymentResult.transactionId);
      // Set the txid in state and call handleSubmit
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
