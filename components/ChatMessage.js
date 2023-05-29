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
  style={{
    textDecoration: 'none',
  }}
>
  <img
    className={styles.copyIcon}
    src="https://uploads-ssl.webflow.com/646064abf2ae787ad9c35019/6474a9bf4a0547694b83498c_linked.svg"
    alt="Transaction Link"
  />
  <span
    style={{
      fontSize: '12px',
      color: 'gray',
      marginRight: '10px',
      textDecoration: 'none',
    }}
  >
    TXID: {txid.slice(0, 5)}
  </span>
</a>
          <a
            className={`${styles.copyButton} copyButton`}
            onClick={() => handleCopy(content)}
          >
            <img
              className={styles.copyIcon}
              src="https://uploads-ssl.webflow.com/646064abf2ae787ad9c35019/6474a7ac96040b5fe425c4f8_copy-two-paper-sheets-interface-symbol.svg"
              alt="Copy"
            />
            <span style={{ fontSize: '12px', color: 'gray' }}>{copyButtonText}</span>
          </a>
          <img
              className={styles.copyIcon}
              src="https://uploads-ssl.webflow.com/646064abf2ae787ad9c35019/6474a81e31e9c343912ede78_coins.svg"
              alt="Token Count"
            />
          <span style={{ fontSize: '12px', color: 'gray' }}>
          Tokens: {tokens} 
          </span>
        </div>
      )}
    </div>
  );
}

export default ChatMessage;