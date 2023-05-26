// components/ChatBody.js

import React, { useEffect, useRef } from 'react';
import styles from './ChatBody.module.css';
import ChatMessage from './ChatMessage';

function ChatBody({ chat, isLoading, isError }) {
  const chatContainerRef = useRef(null);

  useEffect(() => {
    console.log('Tokens:', tokens);
    console.log('Txid:', txid);
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
          message="Welcome to ChatBSV. Ask me anything."
          className={styles.introMessage}
        />

        {chat.map((message) => (
          <ChatMessage
            key={message.id}
            message={message.message}
            role={message.role}
            tokens={message.tokens}
            txid={message.txid}
          />
        ))}

        {isLoading ? (
          <ChatMessage
            message="Counting satoshis, please hold..."
            role="loading"
            className={styles.loadingMessage}
            tokens={null} // Remove tokens prop for loading message
            txid={null} // Remove txid prop for loading message
          />
        ) : null}

        {isError ? (
          <ChatMessage
            message="OpenAI error. Please try again or come back later."
            role="error"
            className={styles.errorMessage}
            tokens={null} // Remove tokens prop for error message
            txid={null} // Remove txid prop for error message
          />
        ) : null}

        <div className={styles.spacer}></div>
      </div>
    </div>
  );
}

export default ChatBody;
