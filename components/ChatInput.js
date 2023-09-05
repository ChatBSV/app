// components/ChatInput.js

import React, { useState, useRef } from 'react';
import styles from './ChatInput.module.css';
import ButtonIcon from './ButtonIcon';

const ChatInput = ({ handleSubmit, sessionToken, redirectionUrl }) => {
  const [txid, setTxid] = useState('');
  const inputRef = useRef(null);
  const [paymentResult, setPaymentResult] = useState({status: 'none'});
  const [isConnected, setIsConnected] = useState(true); // Add this line

  useEffect(() => {
    if (sessionToken) {
      setIsConnected(true);
    } else {
      setIsConnected(false);
    }
  }, [sessionToken]);

  const buttonText = () => {
    if (paymentResult?.status === 'pending') return 'Sending...';
    if (!isConnected) return 'Connect'; // Add this line
    return 'Send';
  };

  const handleFormSubmit = async () => {
    const prompt = inputRef.current.value.trim();
    if (prompt !== '') {
      const storedTxid = localStorage.getItem('txid');
      await handleSubmit(prompt, storedTxid);
      inputRef.current.value = '';
    } else {
      console.log('Prompt is empty. No request sent.');
    }
  };

  const handleKeyDown = async (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      await pay();  
    }
  };

  const pay = async () => {
    console.log('ChatInput: pay, sessionToken:', sessionToken); // Log sessionToken
    localStorage.removeItem('txid');

    if (!sessionToken) {
      console.log('No session token.');
      window.location.href = redirectionUrl;
      return;
    }
    setPaymentResult({status: 'pending'});
    try {
      const response = await fetch('/api/pay', {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${sessionToken}`,
        },
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
            text={buttonText()} // Update this line           
            onClick={paymentResult?.status === 'pending' ? null : pay}
          />
        </div>
      </form>
    </div>
  );
};

export default ChatInput;
