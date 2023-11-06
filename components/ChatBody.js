// filepath/components/ChatBody.js

import React, { useEffect, useRef } from 'react';
import styles from './ChatBody.module.css';
import ChatMessage from './ChatMessage';
import getErrorMessage from '../lib/getErrorMessage'; // Import the getErrorMessage function

function ChatBody({ chat, isLoading, isError, error }) { // Include an error prop
  const chatContainerRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [chat, isLoading, isError]);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  // Use getErrorMessage to parse the error object and get a user-friendly message
  const errorMessage = isError ? getErrorMessage(error) : '';

  return (
    <div className={styles.chatBody} ref={chatContainerRef}>
      <div className={styles.chatContainer}>
        <ChatMessage
          content={`<span style="font-weight:600;">Welcome Home, Master Bruce.`}
          role="intro"
          className={styles.introMessage}
        />
        <ChatMessage
          content={`<span style="font-size:13px; font-weight:600;">GPT 4, $0.05 / Message</span>
          <span style="font-size:13px; font-weight:600;">DALL-E, 1024x1024, $0.1 / Image</span>`}
          role="intro"
          className={styles.introMessage}
        />
        
        {chat.map((message) => (
          <ChatMessage
            key={message.id}
            content={message.content}
            role={message.role}
            tokens={message.role === 'assistant' ? message.tokens : 0}
            txid={message.txid}
          />
        ))}
  
        {isLoading && (
          <ChatMessage
            content="Processing, please wait..."
            role="loading"
            className={styles.loadingMessage}
          />
        )}

        {/* Displaying the dynamic error message */}
        {isError && (
        <ChatMessage
          content={errorMessage} // Assume error is already a string
          role="error"
          className={styles.errorMessage}
        />
        )}
  
        <div className={styles.spacer}></div>
      </div>
    </div>
  );
}

export default ChatBody;
