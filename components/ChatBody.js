// filepath/components/ChatBody.js

import React, { useEffect, useRef } from 'react';
import styles from './ChatBody.module.css';
import ChatMessage from './ChatMessage';

function ChatBody({ chat, isLoading, isError }) {
  const chatContainerRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [chat, isLoading, isError]);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  const errorMessage = chat.find(message => message.role === "error")?.content || "OpenAI error. Please try again or come back later.";

  return (
    <div className={styles.chatBody} ref={chatContainerRef}>
      <div className={styles.chatContainer}>
        <ChatMessage
          content="Welcome to ChatBSV!
          <br /><br /> Chat with OpenAI or type /imagine to generate an image with DALLE."
          role="intro"
          className={styles.introMessage}
        />
        <ChatMessage
          content="Try these examples:
          <br />What is the distance between the Earth and the Sun? (OpenAI, $0.0099)
          <br />/Imagine a watercolor of Times Square, NYC, at night (DALLE, $0.099)"
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
            content="Processing..."
            role="loading"
            className={styles.loadingMessage}
          />
        )}

        {/* Displaying the dynamic error message */}
        {isError && (
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
