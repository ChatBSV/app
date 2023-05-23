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
    const prompt = input.trim();

    if (prompt !== '') {
      handleSubmit(prompt);
      setInput('');
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.value = input;
    }
  }, [input]);

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
