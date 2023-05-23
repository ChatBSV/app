// components/ChatMessage.js

import React from 'react';
import styles from './ChatMessage.module.css';

function ChatMessage({ message, user }) {
  const messageClass = user ? styles.userMessage : styles.assistantMessage;

  return (
    <div className={`${styles.chatMessage} ${messageClass}`}>
      <span style={{ fontSize: '16px' }}>{message}</span>
    </div>
  );
}

export default ChatMessage;