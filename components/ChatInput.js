// components/ChatInput.js

import React, { useState, useEffect, useRef } from 'react';
import styles from './ChatInput.module.css';

const ChatInput = ({ handleSubmit }) => {
  const [input, setInput] = useState('');

  const handleInputChange = (event) => setInput(event.target.value);

  const handlePayment = (payment) => {
    const prompt = input.trim();
    if (prompt !== '') {
      handleSubmit(prompt);
      setInput('');
    }
  };

  const chatButtonRef = useRef(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://www.moneybutton.com/moneybutton.js';
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      const moneyButtonOptions = {
        to: '3332',
        amount: '0.0099',
        currency: 'USD',
        buttonData: input,
        type: 'tip',
        onPayment: handlePayment
      };
      
      // Check if the moneyButton global object is available
      if (typeof moneyButton !== 'undefined') {
        moneyButton.render(chatButtonRef.current, moneyButtonOptions);
      }
    };

    return () => {
      document.body.removeChild(script);
    };
  }, [input]);

  const handleFormSubmit = (event) => {
    event.preventDefault();
    const prompt = input.trim();

    if (prompt !== '') {
      handleSubmit(prompt);
      setInput('');
    }
  };

  return (
    <div className={`${styles.chatFooter}`}>
      <form onSubmit={handleFormSubmit} className={styles.inputForm}>
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          className={styles.inputField}
          placeholder="Enter your prompt"
        />
      </form>
      <div ref={chatButtonRef} className="moneyButton"></div>
    </div>
  );
};

export default ChatInput;
