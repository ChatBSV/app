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

  return (
    <div
      className={`${styles.chatMessage} ${
        isAssistantMessage ? styles.assistantMessage : ''
      } ${isUserMessage ? styles.userMessage : ''} ${
        isLoadingMessage ? styles.loadingMessage : ''
      } ${isIntroMessage ? styles.introMessage : ''}`}
    >
      <div>
        <span className={styles.message} style={isAssistantMessage ? messageStyle : {}}>
          {message}
        </span>
      </div>
      {isAssistantMessage && (
        <div>
          {txid && (
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
          )}
          <span style={{ fontSize: '14px', color: 'gray' }}>
            {tokens} Tokens
          </span>
        </div>
      )}
    </div>
  );
}

export default ChatMessage;
