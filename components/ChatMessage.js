// components/ChatMessage.js

import React from 'react';
import styles from './ChatMessage.module.css';

function ChatMessage({ message, role, totalTokens, txid }) {
  const isUserMessage = role === 'user';
  const isAssistantMessage = role === 'assistant';

  return (
    <div className={`${styles.chatMessage} ${isUserMessage ? styles.userMessage : ''} ${isAssistantMessage ? styles.assistantMessage : ''}`}>
      <span className={styles.message} style={{ fontSize: '16pt', margin: 0 }}>{message}</span>
      {isAssistantMessage && (
        <div className={styles.link}>
          <a href={`https://whatsonchain.com/tx/${txid}`} target="_blank" rel="noopener noreferrer" className={styles.linkIcon}>
            <img src="/link-icon.png" alt="Link Icon" />
          </a>
          <span className={styles.txid}>{txid}</span>
          <span className={styles.tokens}>{totalTokens} Tokens</span>
        </div>
      )}
    </div>
  );
}




export default ChatMessage;