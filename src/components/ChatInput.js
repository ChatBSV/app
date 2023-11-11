// src/components/ChatInput.js

import React, { useState, useRef, useEffect } from 'react';
import styles from './ChatInput.module.css';
import ButtonIcon from './ButtonIcon';
import { handleTextareaChange, onDisconnect } from '../utils/ChatInputUtils';
import { handleFormSubmit, pay } from '../utils/ChatInputHandlers';
import helpContent from '../../help.json';

const ChatInput = ({ handleSubmit, sessionToken, redirectionUrl, resetChat, addMessageToChat, initialPrompt }) => {
  const [txid, setTxid] = useState('');
  const inputRef = useRef(null);
  const [paymentResult, setPaymentResult] = useState({ status: 'none' });
  const [isConnected, setIsConnected] = useState(!!sessionToken);

  useEffect(() => {
    setIsConnected(!!sessionToken);

    const handleCallback = () => {
        setIsConnected(!!sessionToken); // Force update the isConnected state after returning from the callback
    };

    window.addEventListener('popstate', handleCallback); // Add event listener for handling callback scenario

    if (initialPrompt) {
        inputRef.current.value = initialPrompt;
        handleFormSubmit(new Event('submit'), initialPrompt, '', 'text', handleSubmit, setPaymentResult, inputRef);
    }

    return () => window.removeEventListener('popstate', handleCallback); // Cleanup event listener
  }, [sessionToken, initialPrompt]);

  const buttonText = () => {
    if (paymentResult?.status === 'pending') return 'Sending...';
    return isConnected ? 'Send' : 'Connect';
  };

  const handleButtonClick = () => {
    if (paymentResult?.status === 'pending') return;

    if (!isConnected || !sessionToken) {
      const prompt = inputRef.current.value.trim();
      const customParams = `state=prompt=${encodeURIComponent(prompt)}`;
      window.location.href = `${redirectionUrl}&${customParams}`;
      return;
    }

    pay(inputRef, isConnected, redirectionUrl, sessionToken, setPaymentResult, addMessageToChat, helpContent, setTxid, handleSubmit);
  };

  return (
    <div className={styles.chatFooter}>
      <form onSubmit={(event) => handleFormSubmit(event, inputRef.current.value.trim(), txid, 'text', handleSubmit, setPaymentResult, inputRef)} className={styles.inputForm}>
        <textarea
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
              event.preventDefault();
              handleButtonClick();
            }
          }}
          className={styles.inputField}
          placeholder="Enter your prompt or /imagine"
          ref={inputRef}
          onChange={handleTextareaChange}
        ></textarea>
        <div className={styles.mbWrapper}>
          {isConnected && <button className={`${styles.actionButton} ${styles.logoutButtonMobile}`} onClick={() => onDisconnect(resetChat)}></button>}
          <ButtonIcon
            icon="https://uploads-ssl.webflow.com/646064abf2ae787ad9c35019/64f5b1e66dcd597fb1af816d_648029610832005036e0f702_hc%201.svg"
            text={buttonText()}
            onClick={handleButtonClick}
          />
          <button className={`${styles.actionButton} ${styles.resetButtonMobile}`} onClick={() => resetChat()}></button>
        </div>
      </form>
    </div>
  );
};

export default ChatInput;
