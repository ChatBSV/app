// src/components/ChatBody.js

import React from 'react';
import styles from './ChatBody.module.css';
import ChatMessage from './ChatMessage';
import loadingMessages from '../../loadingMessages.json';
import useScrollToBottom from '../hooks/useScrollToBottom';
import introMessage1 from '../../content/introMessage1.html';
import introMessage2 from '../../content/introMessage2.html';
import helpContent from '../../content/help.html'; // Ensure this path is correct

function ChatBody({ chat, isLoading, isError, errorMessage }) {
  const chatContainerRef = useScrollToBottom([chat]);

  const renderMessage = (message) => {
    if (message.role === 'help') {
      // Special handling for /help message
      return (
        <ChatMessage
          key={message.id}
          content={helpContent}
          role="help"
          dangerouslySetInnerHTML={{ __html: helpContent }}
        />
      );
    } else {
      // Regular chat messages
      return (
        <ChatMessage
          key={message.id}
          content={message.content}
          role={message.role}
          tokens={message.role === 'assistant' ? message.tokens : 0}
          txid={message.txid}
          onImageLoad={() => chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight}
          isNewMessage={message.isNew}
        />
      );
    }
  };

  // Determine a random loading message
  const randomLoadingContent = isLoading
    ? loadingMessages[Math.floor(Math.random() * loadingMessages.length)]
    : '';

  return (
    <div className={styles.chatBody} ref={chatContainerRef}>
      <div className={styles.chatContainer}>
        <ChatMessage content={introMessage1} role="intro" />
        <ChatMessage content={introMessage2} role="intro" />

        {chat.map(renderMessage)}

        {isLoading && (
          <ChatMessage
            content={randomLoadingContent}
            role="loading"
          />
        )}

        {isError && errorMessage && (
          <ChatMessage
            content={errorMessage}
            role="error"
          />
        )}

        <div className={styles.spacer}></div>
      </div>
    </div>
  );
}

export default ChatBody;