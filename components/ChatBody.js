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

  console.log(chat);


  return (
    <div className={styles.chatBody} ref={chatContainerRef}>
      <div className={styles.chatContainer}>
        <ChatMessage
          message="Welcome to ChatBSV. Ask me anything."
          role="intro"
          className={styles.introMessage}
        />

        {chat.map((message) => (
          <ChatMessage
            key={message.id}
            message={message.message}
            role={message.role}
            tokens={message.role === 'assistant' ? message.tokens : 0}
            txid={message.txid}
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