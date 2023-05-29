// components/ChatMessage.js

import React, { useState } from 'react';
import styles from './ChatMessage.module.css';

function ChatMessage({ content, role, tokens, txid }) {
  const isAssistantMessage = role === 'assistant';
  const isUserMessage = role === 'user';
  const isLoadingMessage = role === 'loading';
  const isIntroMessage = role === 'intro';
  const messageStyle = {
    fontSize: isAssistantMessage ? '16pt' : '16px',
  };

  const [copyButtonText, setCopyButtonText] = useState('Copy');

  const handleCopy = (message) => {
    navigator.clipboard.writeText(message);
    setCopyButtonText('Copied!');
    setTimeout(() => {
      setCopyButtonText('Copy');
    }, 2000);
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
          style={isAssistantMessage ? messageStyle : { fontSize: '16pt' }}
        >
          <span style={{ fontSize: '16px' }}>{content}</span>
        </span>
      </div>
      {isAssistantMessage && !isLoadingMessage && (
        <div className={styles.chatLink}>
          <a
            href={`https://whatsonchain.com/tx/${txid}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              className={styles.linkIcon}
              src="https://uploads-ssl.webflow.com/646064abf2ae787ad9c35019/646073c8892d47d06848b9c2_share.svg"
              alt="Transaction Link"
            /><span style={{ fontSize: '14px', color: 'gray', textDecoration: 'none', marginRight: '10px'}}>
            TXID: {txid.slice(0,5)} </span>
          </a>
          <a
            className={`${styles.copyButton} copyButton`}
            onClick={() => handleCopy(content)}
          >
            <img
              className={styles.copyIcon}
              src="https://uploads-ssl.webflow.com/646064abf2ae787ad9c35019/64749990f6f6166ad5087ad7_Copy-Icon-SVG-098567.svg"
              alt="Copy"
            />
            <span style={{ fontSize: '14px', color: 'gray' }}>{copyButtonText}</span>
          </a>
          <span style={{ fontSize: '14px', color: 'gray' }}>
          Tokens: {tokens} 
          </span>
        </div>
      )}
    </div>
  );
}

export default ChatMessage;