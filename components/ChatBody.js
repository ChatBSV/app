// components/ChatBody.js

import React, { useEffect, useRef } from 'react';
import styles from './ChatBody.module.css';
import ChatMessage from './ChatMessage';

function ChatBody({ chat, isLoading, isError, errorMessage }) {
  const chatContainerRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [chat, isLoading, isError]);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  return (
    <div className={styles.chatBody} ref={chatContainerRef}>
      <div className={styles.chatContainer}>
        <ChatMessage
          content={`<span style="font-weight:500;">Welcome Home, Master Bruce.`}
          role="intro"
          className={styles.introMessage}
        />
        <ChatMessage
          content={`Type /imagine to generate an image with DALLE, or type anything else to chat with OpenAI.
          
          <span style="font-size:13px; font-weight:500;">GPT 3.5 Turbo, $0.01 per Message</span>
          <span style="font-size:13px; font-weight:500;">DALL-E, 512x512, $0.05 per Image</span>`}
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
        {isError && errorMessage && (
          <ChatMessage
            content={errorMessage}
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
