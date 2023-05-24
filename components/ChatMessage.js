// components/ChatMessage.js

import React from 'react';
import styles from './ChatMessage.module.css';

function ChatMessage({ message, role, tokens, txid }) {
  const isAssistantMessage = role === 'assistant';
  const isUserMessage = role === 'user';
  const isLoadingMessage = role === 'loading';
  const isIntroMessage = role === 'intro';
  const messageStyle = {
    fontSize: '16pt !important',
  };
  const linkStyle = {
    fontSize: '14pt !important',
  };

  return (
    <div
      className={`${styles.chatMessage} ${
        isAssistantMessage ? styles.assistantMessage : ''
      } ${isUserMessage ? styles.userMessage : ''} ${
        isLoadingMessage ? styles.loadingMessage : ''
      } ${isIntroMessage ? styles.introMessage : ''}`}
    >
      <div>
        <span className={styles.message} style={isAssistantMessage ? messageStyle : { fontSize: '16pt' }}>
          <span style={{ fontSize: '16px' }}>{message}</span>
        </span>
      </div>
      {isAssistantMessage && (
        <div>
          <a
            href={`https://whatsonchain.com/tx/${txid}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src="/link-icon.png" alt="Link Icon" />
          </a>
          <span style={{ fontSize: '14px', color: 'gray' }}>{txid}</span>
          <span style={{ fontSize: '14px', color: 'gray' }}>{tokens} Tokens</span>
        </div>
      )}
    </div>
  );
}

export default ChatMessage;
