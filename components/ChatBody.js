// components/ChatBody.js

import React, { useLayoutEffect, useRef } from 'react';
import styles from './ChatBody.module.css';
import ChatMessage from './ChatMessage';

function ChatBody({ chat, isLoading, isError }) {
  const chatContainerRef = useRef(null);

  useLayoutEffect(() => {
    scrollToBottom();
  }, [chat]);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  return (
    <div className={styles.chatBody} ref={chatContainerRef}>
      <div className={styles.chatContainer}>
        {chat.map((message, index) => (
          <ChatMessage
            key={index}
            message={message.message}
            user={message.isUser}
            totalTokens={message.totalTokens}
          />
        ))}

        {isLoading && (
          <ChatMessage
            message="Loading.. Please wait..."
            user={false}
            className={styles.loadingMessage}
          />
        )}

        {isError && (
          <ChatMessage
            message="Ooops. Something went wrong. Please try again or come back later."
            user={false}
            className={styles.errorMessage}
          />
        )}
        <div className={styles.spacer}></div>
      </div>
    </div>
  );
}

export default ChatBody;
