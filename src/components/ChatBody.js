// src/components/ChatBody.js

import React, { useState, useEffect } from 'react';
import styles from './ChatBody.module.css';
import ChatMessage from './ChatMessage';
import loadingMessages from '../../loadingMessages.json';
import useScrollToBottom from '../hooks/useScrollToBottom';
import introMessage1 from '../../content/intro-Message1.html';
import introMessage2 from '../../content/intro-Message2.html';
import helpContent from '../../content/help.html';

function ChatBody({ chat, isLoading, isError, errorMessage }) {
  const [randomLoadingMessage, setRandomLoadingMessage] = useState('');
  const chatContainerRef = useScrollToBottom([chat]);

  useEffect(() => {
    if (isLoading) {
      setRandomLoadingMessage(loadingMessages[Math.floor(Math.random() * loadingMessages.length)]);
    }
  }, [isLoading]);

  const renderMessage = (message) => {
    switch (message.role) {
      case 'help':
        return <ChatMessage key={message.id} content={helpContent} role="help" dangerouslySetInnerHTML={{ __html: helpContent }} />;
      default:
        return <ChatMessage key={message.id} content={message.content} role={message.role} tokens={message.tokens} txid={message.txid} isNewMessage={message.isNewMessage} />;
    }
  };

  return (
    <div className={styles.chatBody} ref={chatContainerRef}>
      <div className={styles.chatContainer}>
        <ChatMessage content={introMessage1} role="intro" />
        <ChatMessage content={introMessage2} role="intro" />
        {chat.map(renderMessage)}
        {isLoading && <ChatMessage content={randomLoadingMessage} role="loading" />}
        {isError && errorMessage && <ChatMessage content={errorMessage} role="error" />}
        <div className={styles.spacer}></div>
      </div>
    </div>
  );
}

export default ChatBody;


