// components/ChatInput.js

import React, { useState } from 'react';
import styles from './ChatInput.module.css';
import MoneyButton from '@moneybutton/react-money-button';
import '@moneybutton/react-money-button/dist/moneybutton.css';


const ChatInput = ({ handleSubmit }) => {
  const [input, setInput] = useState('');

  const handleFormSubmit = (event) => {
    event.preventDefault();
    // Submission now managed by MoneyButton onPayment
  };

  const handleInputChange = (event) => setInput(event.target.value);

  const handlePayment = (payment) => {
    const prompt = input.trim();
    if (prompt !== '') {
      handleSubmit(prompt);
      setInput('');
    }
  };

  return (
    <div className={styles.chatFooter}>
      <div className="moneyButton">
        <form onSubmit={handleFormSubmit} className={styles.inputForm}>
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            className={styles.inputField}
            placeholder="Enter your prompt"
          />
          <MoneyButton
            to="3332"
            amount="0.0099"
            currency="USD"
            onPayment={handlePayment}
          />
        </form>
      </div>
    </div>
  );
};

export default ChatInput;
