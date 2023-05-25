// components/ChatMessage.js

import React from 'react';
import styles from './ChatMessage.module.css';

function ChatMessage({ message, role, totalTokens, txid }) {
  const isAssistantMessage = role === 'assistant';
  const isUserMessage = role === 'user';
  const isLoadingMessage = role === 'loading';
  const isIntroMessage = role === 'intro';

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
          style={isAssistantMessage ? { fontSize: '16pt' } : { fontSize: '16pt' }}
        >
          {message}
        </span>
      </div>
      {isAssistantMessage && (
        <div>
          <a
            href={`https://whatsonchain.com/tx/${txid}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              width={20}
              src="https://uploads-ssl.webflow.com/646064abf2ae787ad9c35019/646073c8892d47d06848b9c2_share.svg"
              alt="Transaction Link"
            />
          </a>
          <span style={{ fontSize: '14pt', color: 'gray' }}>{totalTokens} Tokens</span>
        </div>
      )}
    </div>
  );
}

export default ChatMessage;
