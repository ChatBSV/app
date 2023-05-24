// components/ChatMessage.js

import React from 'react';
import styles from './ChatMessage.module.css';

function ChatMessage({ message, role, tokens, txid }) {
  const isAssistantMessage = role === 'assistant';
  const isUserMessage = role === 'user';
  const isLoadingMessage = role === 'loading';
  const isIntroMessage = role === 'intro';

  return (
    <div className={`${styles.chatMessage} ${isAssistantMessage ? styles.assistantMessage : ''} ${isUserMessage ? styles.userMessage : ''} ${isLoadingMessage ? styles.loadingMessage : ''} ${isIntroMessage ? styles.introMessage : ''}`}>
      <span className={styles.message} style={{ fontSize: '16pt' }}>{message}</span>
      {isAssistantMessage && (
        <div className={styles.link}>
          <a href={`https://whatsonchain.com/tx/${txid}`} target="_blank" rel="noopener noreferrer" className={styles.linkIcon}>
            <img src="/link-icon.png" alt="Link Icon" />
          </a>
          <span className={styles.txid} style={{ fontSize: '14pt' }}>{txid}</span>
          <span className={styles.tokens} style={{ fontSize: '14pt' }}>{tokens} Tokens</span>
        </div>
      )}
    </div>
  );
}

export default ChatMessage;
