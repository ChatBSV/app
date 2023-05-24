// components/ChatBody.js

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

  return (
    <div className={styles.chatBody} ref={chatContainerRef}>
      <div className={styles.chatContainer}>
        <ChatMessage
          message="Welcome to ChatBSV. Create a MoneyButton account if you don't have one yet."
          role="intro"
          className={styles.introMessage}
        />

        {chat.map((message, index) => (
          <ChatMessage
            key={index}
            message={message.message}
            role={message.role}
            tokens={message.tokens} // Corrected prop name
            txid={message.txid} // Pass txid as a prop
          />
        ))}

        {isLoading && (
          <ChatMessage
            message="Counting satoshis, please hold..."
            role="loading"
            className={styles.loadingMessage}
          />
        )}

        {isError && (
          <ChatMessage
            message="OpenAI error. Please try again or come back later."
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
