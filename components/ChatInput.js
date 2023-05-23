// components/ChatInput.js
import React, { useState } from 'react';
import styles from './ChatInput.module.css';

function ChatInput({ handleSubmit }) {
  const [userMessage, setUserMessage] = useState('');

  const handleChange = (event) => {
    setUserMessage(event.target.value);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const handleSendMessage = () => {
    if (userMessage.trim() !== '') {
      handleSubmit(userMessage);
      setUserMessage('');
    }
  };

  return (
    <div className={styles.inputContainer}>
      <textarea
        className={styles.textarea}
        value={userMessage}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Type your message..."
      />
      <button className={styles.sendButton} onClick={handleSendMessage}>
        Send
      </button>
    </div>
  );
}

export default ChatInput;
