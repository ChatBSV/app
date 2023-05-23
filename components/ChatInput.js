// components/ChatInput.js

import React, { useState, useEffect, useRef } from 'react';
import styles from './ChatInput.module.css';

const ChatInput = ({ handleSubmit }) => {
  const [input, setInput] = useState('');
  const [moneyButtonLoaded, setMoneyButtonLoaded] = useState(false);
  const moneyButtonRef = useRef(null);

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

  const handleFormSubmit = (event) => {
    event.preventDefault();
    const prompt = input.trim();

    if (prompt !== '') {
      handleSubmit(prompt);
      setInput('');
    }
  };

  const handleInputChange = (event) => setInput(event.target.value);

  const handleMoneyButtonPayment = (payment) => {
    const { txid } = payment;
    console.log('Transaction ID:', txid);

    // Fetch additional data or perform any necessary actions
  };

  useEffect(() => {
    if (moneyButtonLoaded && moneyButtonRef.current) {
      const moneyButton = window.moneyButton.render(moneyButtonRef.current, {
        to: '3332',
        amount: '0.0099',
        currency: 'USD',
        onPayment: handleMoneyButtonPayment
      });
    }
  }, [moneyButtonLoaded]);

  return (
    <div className={styles.chatFooter}>
      <form onSubmit={handleFormSubmit} className={styles.inputForm}>
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          className={styles.inputField}
          placeholder="Enter your prompt..."
        />
        <div ref={moneyButtonRef} className={styles.moneyButton}></div>
      </form>
    </div>
  );
};

export default ChatInput;
