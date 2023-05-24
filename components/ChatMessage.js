// components/ChatMessage.js

import React from 'react';
import styles from './ChatMessage.module.css';

function ChatMessage({ message, role, tokens, txid }) {
  const isAssistantMessage = role === 'assistant';

  return (
    <div className={`${styles.chatMessage} ${isAssistantMessage ? styles.assistantMessage : styles.userMessage}`}>
      <p className={styles.message} style={{ fontSize: '16pt', margin: '0' }}>{message}</p>
      {isAssistantMessage && (
        <div className={styles.chatLink}>
          <a href={`https://whatsonchain.com/tx/${txid}`} target="_blank" rel="noopener noreferrer">
            <img src="/link-icon.png" alt="Link Icon" className={styles.linkIcon} />
            <span className={styles.tokens}>{tokens} Tokens</span>
          </a>
        </div>
      )}
    </div>
  );
}

export default ChatMessage;
