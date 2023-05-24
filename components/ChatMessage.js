// components/ChatMessage.js

import React from 'react';
import styles from './ChatMessage.module.css';

function ChatMessage({ message, user, tokens, txid }) {
  return (
    <div className={`${styles.chatMessage} ${user ? styles.userMessage : styles.assistantMessage}`}>
      <p className={styles.paragraph}>{message}</p>
      {!user && tokens && (
        <div className={styles.tokens}>
          <span>{tokens} Tokens</span>
          {txid && (
            <div className={styles.chatLink}>
              <a href={`https://whatsonchain.com/tx/${txid}`} target="_blank" rel="noopener noreferrer">
                <img src="/link-icon.png" alt="Link Icon" className={styles.linkIcon} />
                {txid}
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ChatMessage;
