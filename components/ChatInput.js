// components/ChatInput.js

import React, { useState, useEffect, useRef } from 'react';
import styles from './ChatInput.module.css';

const ChatInput = ({ handleSubmit }) => {
  const [input, setInput] = useState('');
  const inputRef = useRef(null);

  const handleInputChange = (event) => {
    const value = event.target.value;
    setInput(value);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    // Prevent form submission if the input is empty
    if (input.trim() === '') {
      return;
    }
    handleSubmit(input.trim());
    setInput('');
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.value = input;
    }
  }, [input]);

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
    if (typeof moneyButton !== 'undefined' && inputRef.current) {
      moneyButton.render(inputRef.current, {
        to: '3332',
        amount: '0.0099',
        currency: 'USD',
        onPayment: (payment) => {
          handleSubmit(input.trim());
          setInput('');
        },
        buttonData: input.trim(),
        type: 'tip',
      });
    }
  }, [input, handleSubmit]);

  return (
    <div className={styles.chatFooter}>
      <form onSubmit={handleFormSubmit} className={styles.inputForm}>
        <input
          ref={inputRef}
          type="text"
          onChange={handleInputChange}
          className={styles.inputField}
          placeholder="Enter your prompt"
        />
      </form>
    </div>
  );
};

export default ChatInput;
