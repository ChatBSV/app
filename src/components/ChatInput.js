// src/components/ChatInput.js

import React, { useState, useRef, useEffect } from 'react';
import styles from './ChatInput.module.css';
import { handleFormSubmit, pay } from '../utils/ChatInputHandlers';
import ChatInputForm from './ChatInputForm';
import helpContent from '../../content/help.html';

const ChatInput = ({ handleSubmit, sessionToken, redirectionUrl, addMessageToChat, user, threads, setCurrentThread, clearThreadMessages }) => {
  const [txid, setTxid] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);
  const [paymentResult, setPaymentResult] = useState({ status: 'none' });
  const [isConnected, setIsConnected] = useState(true);
  const [currentThreadId, setCurrentThreadId] = useState(null);

  useEffect(() => {
    setCurrentThreadId(typeof window !== 'undefined' ? localStorage.getItem('currentThreadId') : null);
  }, []);
  
  useEffect(() => {
    setIsConnected(!!sessionToken);

    const pendingPromptJSON = localStorage.getItem('pendingPrompt');
    const urlParams = new URLSearchParams(window.location.search);
    const reloadParam = urlParams.get('reload');

    if (pendingPromptJSON && (!reloadParam || reloadParam === 'false')) {
      const pendingPrompt = JSON.parse(pendingPromptJSON);
      if (pendingPrompt && pendingPrompt.content) {
        inputRef.current.value = pendingPrompt.content;
        submitPrompt(pendingPrompt.content, currentThreadId);
        localStorage.removeItem('pendingPrompt');
      }
    }

    console.log('Threads:', threads);
    console.log('Current Thread ID:', currentThreadId);
  }, [sessionToken, isConnected, redirectionUrl, setPaymentResult, addMessageToChat, helpContent, setTxid, handleSubmit, threads, setCurrentThread, currentThreadId]);

  const submitPrompt = async (inputValue, currentThreadId) => {
    console.log('Received currentThreadId in submitPrompt:', currentThreadId);

    if (!isConnected || paymentResult.status === 'error') {
      const requestType = inputValue.toLowerCase().startsWith('/imagine') ? 'image' :
        inputValue.toLowerCase().startsWith('/meme') ? 'meme' : 'text';

      if (requestType === 'text' || requestType === 'image' || requestType === 'meme' ) {
        const pendingPrompt = JSON.stringify({ type: requestType, content: inputValue, currentThreadId: currentThreadId });
        localStorage.setItem('pendingPrompt', pendingPrompt);
      }

      window.location.href = redirectionUrl;
    } else {
      const threadIdToUse = currentThreadId;
      const paymentResponse = await pay(
        inputRef,
        isConnected,
        redirectionUrl,
        sessionToken,
        setPaymentResult,
        addMessageToChat,
        helpContent,
        setTxid,
        handleSubmit,
        threadIdToUse,
        currentThreadId 
      );

      if (paymentResponse && paymentResponse.status === 'sent' && currentThreadId) {
        const thread = threads.find((thread) => thread.id === currentThreadId);
        if (thread && thread.messages && Array.isArray(thread.messages)) {
          const updatedMessages = [...thread.messages, paymentResponse.reply];
          const updatedThreads = threads.map((t) =>
            t.id === currentThreadId ? { ...t, messages: updatedMessages } : t
          );
          setCurrentThread({ ...thread, messages: updatedMessages });
          localStorage.setItem('threads', JSON.stringify(updatedThreads));
        } else {
          console.error('Current thread is not set or currentThread.messages is not iterable');
        }
      }

      localStorage.removeItem('pendingPrompt');
    }
  };

  const buttonText = () => {
    if (paymentResult?.status === 'pending') return 'Sending...';
    return isConnected ? 'Send' : 'Connect';
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      submitPrompt(inputRef.current.value, currentThreadId); 
    }
  };

  return (
    <div className={styles.chatFooter}>
      <ChatInputForm
        isConnected={isConnected}
        inputRef={inputRef}
        buttonText={buttonText()}
        handleKeyDown={handleKeyDown}
        handleFormSubmit={(event) => handleFormSubmit(event, inputRef.current.value, handleSubmit, setPaymentResult, currentThreadId)}
        handleButtonClick={() => submitPrompt(inputRef.current.value, currentThreadId)}
        user={user}
        currentThreadId={currentThreadId}
      />
    </div>
  );
};

export default ChatInput;
