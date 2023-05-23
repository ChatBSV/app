// components/ChatInput.js

import React, { useState } from 'react';
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

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
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

  return (
    <div className={`${styles.chatFooter}`}>
      <form onSubmit={handleFormSubmit} className={styles.inputForm}>
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className={styles.inputField}
          placeholder="Enter your prompt"
        />
      </form>
      <div
        className="moneyButton"
        data-to="3332"
        data-amount="0.0099"
        data-currency="USD"
        data-button-data={input}
        data-type="tip"
        onPayment={handlePayment}
      ></div>
    </div>
  );
};

export default ChatInput;
