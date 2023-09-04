// components/ChatInput.js

import React, { useState, useRef } from 'react';
import styles from './ChatInput.module.css';
import ButtonIcon from './ButtonIcon';

const ChatInput = ({ handleSubmit, sessionToken, redirectionUrl }) => {
  const [txid, setTxid] = useState('');
  const inputRef = useRef(null);

  const handleFormSubmit = () => {
    const prompt = inputRef.current.value.trim();
    if (prompt !== '') {
      const storedTxid = localStorage.getItem('txid');
      handleSubmit(prompt, storedTxid);
      inputRef.current.value = '';
    } else {
      console.log('Prompt is empty. No request sent.');
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      pay().then(handleFormSubmit);
    }
  };

  const [paymentResult, setPaymentResult] = useState({status: 'none'});

  const pay = async () => {
    console.log('pay');
    if (!sessionToken) {
      console.log('No session token.');
      window.location.href = redirectionUrl;
      return;
    }
    setPaymentResult({status: 'pending'});
    const response = await fetch('/api/pay', {
      method: "POST",
      headers: {
        'Authorization': `Bearer ${sessionToken}`,
      },
    });
    const paymentResult = await response.json();
    console.log('payResult', paymentResult);
    if (paymentResult.status === 'sent') {
      const { transactionId } = paymentResult;
      console.log('Transaction ID:', transactionId);
      localStorage.setItem('txid', transactionId);
      setTxid(transactionId);
      handleFormSubmit();
    }
    if (paymentResult.status === 'error') {
      console.log('Error:', paymentResult.message);
    }
    setPaymentResult(paymentResult);
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
            text={paymentResult?.status === 'pending' ? 'Sending...' : 'Send'}             
            onClick={paymentResult?.status === 'pending' ? null : pay}
          />
        </div>
      </form>
    </div>
  );
};

export default ChatInput;
