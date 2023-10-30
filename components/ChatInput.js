// components/ChatInput.js

import React, { useState, useRef, useEffect } from 'react';
import styles from './ChatInput.module.css';
import ButtonIcon from './ButtonIcon';

const handleTextareaChange = (e) => {
  const textarea = e.target;
  textarea.style.height = 'auto';
  textarea.style.height = `${textarea.scrollHeight}px`;
};

const onDisconnect = async () => {
  await fetch('/api/logout', {
    method: 'POST',
  });
  window.location.href = "/";
};



const ChatInput = ({ handleSubmit, sessionToken, redirectionUrl, resetChat, onDisconnect }) => {
  const [txid, setTxid] = useState('');
  const inputRef = useRef(null);
  const [paymentResult, setPaymentResult] = useState({status: 'none'});
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    setIsConnected(!!sessionToken);
  }, [sessionToken]);

  const buttonText = () => {
    if (paymentResult?.status === 'pending') return 'Sending...';
    return isConnected ? 'Send' : 'Connect';
  };

  const handleFormSubmit = async () => {
    const prompt = inputRef.current.value.trim();
    if (prompt) {
      const storedTxid = localStorage.getItem('txid');
      const isDalle = prompt.toLowerCase().startsWith('/imagine');
      await handleSubmit(prompt, storedTxid, isDalle);
      inputRef.current.value = '';
    }
  };

  const handleKeyDown = async (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      await pay();
    }
  };

  const pay = async () => {
    if (!isConnected) {
      window.location.href = redirectionUrl;
      return;
    }

    localStorage.removeItem('txid');
    const prompt = inputRef.current.value.trim();
    const isDalle = prompt.toLowerCase().startsWith('/imagine');
    const headers = {
      'Authorization': `Bearer ${sessionToken}`,
      'requestType': isDalle ? 'image' : 'text'
    };

    setPaymentResult({status: 'pending'});
    try {
      const response = await fetch('/api/pay', { method: "POST", headers });
      const paymentResult = await response.json();
      if (paymentResult.status === 'sent') {
        localStorage.setItem('txid', paymentResult.transactionId);
        setTxid(paymentResult.transactionId);
        await handleFormSubmit();
      }
      setPaymentResult(paymentResult);
    } catch (error) {
      localStorage.removeItem('txid');
    }
  };

  return (
    <div className={styles.chatFooter}>
      <form onSubmit={handleFormSubmit} className={styles.inputForm}>
        <button className={`${styles.actionButton} ${styles.resetButtonMobile}`} onClick={resetChat}></button>
        <button className={`${styles.actionButton} ${styles.logoutButtonMobile}`} onClick={onDisconnect}></button>      
        <textarea
          onKeyDown={handleKeyDown}
          className={styles.inputField}
          placeholder="Enter your prompt or /imagine"
          ref={inputRef}
          onChange={handleTextareaChange}
        ></textarea>
        <div className={styles.mbWrapper}>
          <ButtonIcon 
            icon="https://uploads-ssl.webflow.com/646064abf2ae787ad9c35019/64f5b1e66dcd597fb1af816d_648029610832005036e0f702_hc%201.svg" 
            text={buttonText()}
            onClick={paymentResult?.status === 'pending' ? null : pay}
          />
        </div>
      </form>
    </div>
  );
};

export default ChatInput;
