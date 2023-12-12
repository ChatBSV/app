// src/components/ChatBody.js

import React, { useState, useEffect } from 'react';
import styles from './ChatBody.module.css';
import ChatMessage from './ChatMessage';
import loadingMessages from '../../../loadingMessages.json';
import useScrollToBottom from '../../hooks/useScrollToBottom';
import introMessage1 from '../../../content/intro-Message1.html';
import introMessage2 from '../../../content/intro-Message2.html';
import helpContent from '../../../content/help.html';


function ChatBody({ chat, isLoading, isError, errorMessage, user }) {
  const [randomLoadingMessage, setRandomLoadingMessage] = useState('');
  const chatContainerRef = useScrollToBottom([chat]);

  useEffect(() => {
    if (isLoading) {
      setRandomLoadingMessage(loadingMessages[Math.floor(Math.random() * loadingMessages.length)]);
    }
  }, [isLoading]);

  const renderMessage = (message) => {
    // Determine the avatar URL based on the message role
    let avatarUrl = '/icon-192x192.png'; // System avatar for system messages
    if (message.role === 'user' && user) {
      avatarUrl = user.avatarUrl; // User's avatar for user messages
    }
    
    // Special handling for 'help' message to use dangerous HTML
    if (message.role === 'help') {
      return (
        <ChatMessage 
          key={message.id} 
          content={helpContent} 
          role="help" 
          dangerouslySetInnerHTML={{ __html: helpContent }} 
          avatarUrl={avatarUrl}
        />
      );
    }

    return (
      <ChatMessage 
        key={message.id} 
        content={message.content} 
        role={message.role} 
        tokens={message.tokens} 
        txid={message.txid} 
        isNewMessage={message.isNewMessage} 
        avatarUrl={avatarUrl}
      />
    );
  };

  return (
    <div className={styles.chatBody} ref={chatContainerRef}>
      <div className={styles.chatContainer}>
        <ChatMessage content={introMessage1} role="intro" avatarUrl="/icon-192x192.png" />
        <ChatMessage content={introMessage2} role="intro" avatarUrl="/icon-192x192.png" />
        {chat.map(renderMessage)}
        {isLoading && <ChatMessage content={randomLoadingMessage} role="loading" avatarUrl="/icon-192x192.png" />}
        {isError && errorMessage && <ChatMessage content={errorMessage} role="error" avatarUrl="/icon-192x192.png" />}
        <div className={styles.spacer}></div>
      </div>
    </div>
  );
}

export default ChatBody;
