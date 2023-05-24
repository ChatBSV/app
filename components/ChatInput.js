// /Components/ChatInput.js

import React, { useState, useEffect, useRef, useCallback } from 'react';
import styles from './ChatInput.module.css';

const ChatInput = ({ handleSubmit }) => {
  const [moneyButtonLoaded, setMoneyButtonLoaded] = useState(false);
  const [txid, setTxid] = useState('');
  const moneyButtonContainerRef = useRef(null);

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

  const handleFormSubmit = useCallback(async () => {
    const prompt = document.getElementById('input').value.trim();
    if (prompt !== '') {
      try {
        const response = await fetch('/.netlify/functions/getChatReply', {
          method: 'POST',
          body: JSON.stringify({ prompt, lastUserMessage: null, txid }),
        });

        if (response.ok) {
          const data = await response.json();
          const assistantResponse = data.message;
          console.log('Assistant Response:', assistantResponse);
          handleSubmit(prompt);
        } else {
          console.error('Error:', response.status);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    } else {
      console.log('Prompt is empty. No request sent.');
    }
  }, [handleSubmit, txid]);

  const handleMoneyButtonPayment = useCallback((payment) => {
    const { txid } = payment;
    console.log('Transaction ID:', txid);
    setTxid(txid);
    handleFormSubmit();
  }, [handleFormSubmit]);

  useEffect(() => {
    if (moneyButtonLoaded && moneyButtonContainerRef.current) {
      const moneyButtonContainer = moneyButtonContainerRef.current;
      moneyButtonContainer.innerHTML = '';

      const moneyButton = window.moneyButton.render(moneyButtonContainer, {
        to: '3332',
        amount: '0.0099',
        currency: 'USD',
        data: { input: document.getElementById('input').value },
        onPayment: handleMoneyButtonPayment,
      });

      return () => {
        moneyButtonContainer.innerHTML = '';
        moneyButton.destroy();
      };
    }
  }, [moneyButtonLoaded, handleMoneyButtonPayment]);

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
          id="input"
        />
        {moneyButtonLoaded && (
          <div ref={moneyButtonContainerRef} className={styles.moneyButton}></div>
        )}
      </form>
    </div>
  );
};

export default ChatInput;
