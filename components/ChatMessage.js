// components/ChatMessage.js

import React from 'react';
import styles from './ChatMessage.module.css';

function ChatMessage({ message, role, tokens, txid }) {
  const isAssistantMessage = role === 'assistant';
  const isUserMessage = role === 'user';
  const isLoadingMessage = role === 'loading';
  const isIntroMessage = role === 'intro';
  const messageStyle = {
    fontSize: '16pt',
  };
  const linkStyle = {
    fontSize: '14pt',
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
        <span
          className={styles.message}
          style={isAssistantMessage ? messageStyle : { fontSize: '16pt' }}
        >
          <span style={{ fontSize: '16px' }}>{message}</span>
        </span>
      </div>
      {isAssistantMessage && (
        <div>
          <a
            href={`https://whatsonchain.com/tx/${txid}`} // Update the link to include the txid
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
          >
            <img
              src="https://uploads-ssl.webflow.com/646064abf2ae787ad9c35019/646073c8892d47d06848b9c2_share.svg"
              alt="Transaction Link"
            />
          </a>
          <span style={{ fontSize: '14px', color: 'gray' }}>{txid}</span> {/* Display txid */}
          <span style={{ fontSize: '14px', color: 'gray' }}>{tokens} Tokens</span>
        </div>
      )}
    </div>
  );
}

export default ChatMessage;
