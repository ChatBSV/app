// components/ChatMessage.js
import React from 'react';
import styles from './ChatMessage.module.css';

function ChatMessage({ message }) {
  return (
    <div className={`${styles.messageContainer} ${message.role === 'user' ? styles.userMessage : styles.assistantMessage}`}>
      <div className={styles.messageContent}>
        {message.txid && (
          <a href={`https://whatsonchain.com/tx/${message.txid}`} target="_blank" rel="noopener noreferrer">
            <span className={styles.txid}>TxID: {message.txid}</span>
          </a>
        )}
        <div>{message.message}</div>
        <div className={styles.messageTokens}>{message.tokens} tokens</div>
      </div>
    </div>
  );
}

export default ChatMessage;
