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
          message="Hi there, welcome to ChatBSV! Create a MoneyButton account if you don't have one yet."
          user={false}
          className={styles.introMessage}
        />

{chat.map((message, index) => (
  <ChatMessage
    key={index}
    message={message.message}
    user={message.role === 'user'}
    totalTokens={message.totalTokens}
  />
))}


        {isLoading && (
          <ChatMessage
            message="Please wait, I'm counting satoshis on a BitCoin..."
            user={false}
            className={styles.loadingMessage}
          />
        )}

        {isError && (
          <ChatMessage
            message="OpenAI returned an error. Please try again or come back later."
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
