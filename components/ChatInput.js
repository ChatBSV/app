// components/ChatInput.js

import React, { useState, useEffect, useRef } from 'react';
import styles from './ChatInput.module.css';

const ChatInput = ({ handleSubmit }) => {
  const [input, setInput] = useState('');
  const [moneyButtonInput, setMoneyButtonInput] = useState('');
  const inputRef = useRef(null);

  const handleInputChange = (event) => {
    const value = event.target.value;
    setInput(value);
    setMoneyButtonInput(value);
  };

  const handlePayment = (payment) => {
    const prompt = input.trim();
    if (prompt !== '') {
      handleSubmit(prompt);
      setInput('');
    }
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    const prompt = input.trim();

    if (prompt !== '') {
      handleSubmit(prompt);
      setInput('');
    }
  };

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://www.moneybutton.com/moneybutton.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.value = input;
    }
  }, [input]);

  return (
    <div className={`${styles.chatFooter}`}>
      <form onSubmit={handleFormSubmit} className={styles.inputForm}>
        <input
          ref={inputRef}
          type="text"
          onChange={handleInputChange}
          className={styles.inputField}
          placeholder="Enter your prompt"
        />
      </form>
      {typeof moneyButton !== 'undefined' && (
        <div
          className="moneyButton mb"
          data-to="3332"
          data-amount="0.0099"
          data-currency="USD"
          data-button-data={moneyButtonInput}
          data-type="tip"
          onPayment={handlePayment}
        ></div>
      )}
    </div>
  );
};

export default ChatInput;
