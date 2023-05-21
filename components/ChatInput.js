// components/ChatInput.js

import { useState } from 'react';
import styles from './ChatInput.module.css';

const ChatInput = ({ handleSubmit }) => {
  const [input, setInput] = useState('');

  const handleFormSubmit = (event) => {
    event.preventDefault();
    const prompt = input.trim();

    if (prompt !== '') {
      handleSubmit(prompt);
      setInput('');
    }
  };

  const handleInputChange = (event) => setInput(event.target.value);

  return (
    <div className={styles.chatFooter}>
      <form onSubmit={handleFormSubmit} className={styles.inputForm}>
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          className={styles.inputField}
          placeholder="Enter your prompt here"
        />
        <button type="submit" className={styles.submit}></button>
      </form>
    </div>
  );
};

export default ChatInput;
