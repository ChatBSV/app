// components/ChatInput.js

import React, { useState, useRef, useEffect } from 'react';
import styles from './ChatInput.module.css';
import ButtonIcon from './ButtonIcon';

const ChatInput = ({ handleSubmit, sessionToken, redirectionUrl }) => {
  const [txid, setTxid] = useState('');
  const inputRef = useRef(null);
  const [paymentResult, setPaymentResult] = useState({status: 'none'});
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    if (sessionToken) {
      setIsConnected(true);
    } else {
      setIsConnected(false);
    }
  }, [sessionToken]);

  const buttonText = () => {
    if (paymentResult?.status === 'pending') return 'Sending...';
    if (!isConnected) return 'Connect';
    return 'Send';
  };

  const handleFormSubmit = async () => {
    const prompt = inputRef.current.value.trim();
    if (prompt !== '') {
      const storedTxid = localStorage.getItem('txid');
      const isDalle = prompt.startsWith('/imagine');
      await handleSubmit(prompt, storedTxid, isDalle);
      inputRef.current.value = '';
    } else {
      console.log('Prompt is empty. No request sent.');
    }
  };

  const pay = async () => {
    console.log('ChatInput: pay, sessionToken:', sessionToken);
    localStorage.removeItem('txid');

    const prompt = inputRef.current.value.trim();
    const isDalle = prompt.startsWith('/imagine');
    const api = '/api/pay';
    const headers = {
      'Authorization': `Bearer ${sessionToken}`,
      'requestType': isDalle ? 'image' : 'text' // set request type
    };

    setPaymentResult({status: 'pending'});
    try {
      const response = await fetch(api, {
        method: "POST",
        headers: headers
      });
      const paymentResult = await response.json();
      if (paymentResult.status === 'sent') {
        const { transactionId } = paymentResult;
        localStorage.setItem('txid', transactionId);
        setTxid(transactionId);
        await handleFormSubmit();
      }
      if (paymentResult.status === 'error') {
        console.log('Error:', paymentResult.message);
        localStorage.removeItem('txid');  
      }
      setPaymentResult(paymentResult);
    } catch (error) {
      console.log('An error occurred:', error);
      localStorage.removeItem('txid');  
    }
  };

  return (
    <div className={styles.chatFooter}>
      <form onSubmit={handleFormSubmit} className={styles.inputForm}>
        <input
          type="text"
          onKeyDown={handleKeyDown}
          className={styles.inputField}
          placeholder="Enter your prompt..."
          ref={inputRef}
        />
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
