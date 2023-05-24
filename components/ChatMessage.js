// components/ChatMessage.js

import React from 'react';
import styles from './ChatMessage.module.css';

function ChatMessage({ message, user, tokens, txid }) {
  const isAssistantMessage = !user;
  const isAssistantMessageReal = isAssistantMessage && txid;

  return (
    <div className={`${styles.chatMessage} ${user ? styles.userMessage : ''} ${isAssistantMessageReal ? styles.assistantMessageReal : ''}`}>
      {isAssistantMessage ? (
        <div>
          <span className={styles.message}>{message}</span>
          {isAssistantMessageReal && (
            <div className={styles.link}>
              <a href={`https://whatsonchain.com/tx/${txid}`} target="_blank" rel="noopener noreferrer" className={styles.linkIcon}>
                <img src="x_link-icon" alt="Link Icon" />
              </a>
              <span className={styles.txid}>{txid}</span>
              <span className={styles.tokens}>{tokens} Tokens</span>
            </div>
          )}
        </div>
      ) : (
        <span className={styles.message}>{message}</span>
      )}
    </div>
  );
}

export default ChatMessage;
