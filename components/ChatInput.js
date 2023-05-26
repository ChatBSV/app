// components/ChatInput.js

import React, { useState, useEffect, useRef } from 'react';
import styles from './ChatInput.module.css';

const ChatInput = ({ handleSubmit }) => {
  const [moneyButtonLoaded, setMoneyButtonLoaded] = useState(false);
  const [txid, setTxid] = useState('');
  const moneyButtonContainerRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const moneyButtonScript = document.createElement('script');
    moneyButtonScript.src = 'https://www.moneybutton.com/moneybutton.js';
    moneyButtonScript.async = true;
    moneyButtonScript.onload = () => setMoneyButtonLoaded(true);
    document.body.appendChild(moneyButtonScript);

    return () => {
      document.body.removeChild(moneyButtonScript);
    };
  }, []);

  const handleFormSubmit = async () => {
    const prompt = inputRef.current.value.trim();
    if (prompt !== '') {
      try {
        const response = await fetch('/.netlify/functions/getChatReply', {
          method: 'POST',
          body: JSON.stringify({ prompt, lastUserMessage: null, txid }),
        });
  
        if (response.ok) {
          const data = await response.json();
          const assistantResponse = data.message;
          handleSubmit(prompt, data.tokens, data.txid);
          inputRef.current.value = '';
        } else {
          console.error('Error:', response.status);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    } else {
      console.log('Prompt is empty. No request sent.');
    }
  };
  
  

  const handleMoneyButtonPayment = (payment) => {
    const { txid } = payment;
    console.log('Transaction ID:', txid);
    setTxid(txid);
  };
  
 
  useEffect(() => {
    if (txid) handleFormSubmit();
  }, [txid]);
  

  useEffect(() => {
    if (moneyButtonLoaded && moneyButtonContainerRef.current) {
      const moneyButtonContainer = moneyButtonContainerRef.current;
      moneyButtonContainer.innerHTML = '';

      const moneyButton = window.moneyButton.render(moneyButtonContainer, {
        to: '3332',
        amount: '0.0099',
        currency: 'USD',
        data: { input: inputRef.current.value },
        onPayment: handleMoneyButtonPayment,
      });

      return () => {
        moneyButton.unmount();
      };
    }
  }, [moneyButtonLoaded]);

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
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
          <div ref={moneyButtonContainerRef} className={styles.moneyButton}></div>
        </div>
      </form>
    </div>
  );
};

export default ChatInput;
