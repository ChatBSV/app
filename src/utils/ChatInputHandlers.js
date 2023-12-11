// src/utils/ChatInputHandlers.js

import { nanoid } from 'nanoid';

export const handlePaymentError = (errorResult, prompt, setPaymentResult, addErrorMessageToChat) => {
    const error = new Error(errorResult.error || "An unexpected error occurred.");
    setPaymentResult({ status: 'error', message: error.message });
    addErrorMessageToChat(error.message);
};

export const processPaymentResult = (
    paymentResult,
    prompt,
    requestType,
    setTxid,
    setPaymentResult,
    
) => {
    if (paymentResult?.status === 'sent') {
        localStorage.setItem('txid', paymentResult.transactionId);
        setTxid(paymentResult.transactionId);
        processSuccessfulPayment(prompt, paymentResult.transactionId, requestType, paymentResult.tokens);
    } else {
        setPaymentResult(paymentResult);
    }
};

export const processSuccessfulPayment = async (
    prompt,
    transactionId,
    requestType,
    tokens,
    handleSubmit,
    inputRef,
    setPaymentResult
) => {
    // Process submission after payment
    await handleSubmit(prompt, transactionId, requestType, tokens);
    inputRef.current.value = '';
    setPaymentResult({ status: 'none' });
};

export const processPaymentError = (error, setPaymentResult, addErrorMessageToChat) => {
    const errorMessage = error.message || "An unexpected network error occurred.";
    setPaymentResult({ status: 'error', message: errorMessage });
    addErrorMessageToChat(errorMessage);
};

export const addErrorMessageToChat = (message, addMessageToChat) => {
    addMessageToChat({
        id: nanoid(),
        role: 'error',
        content: message,
        txid: '',
    });
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
