// components/ChatMessage.js

import React from 'react';
import styles from './ChatMessage.module.css';

function ChatMessage({ message, user, tokens }) {
  return (
    <div className={`${styles.chatMessage} ${user ? styles.userMessage : styles.assistantMessage}`}>
      <span style={{ fontSize: '16px' }}>{message}</span>
      {tokens && !user && (
        <div>
          <span style={{ width: '100%', fontSize: '14px', color: 'gray' }}>
            {tokens} Tokens
          </span>
        </div>
      )}
    </div>
  );
}

export default ChatMessage;
