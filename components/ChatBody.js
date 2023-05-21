// components/ChatBody.js

import React, { useEffect } from 'react';
import styles from './ChatBody.module.css';
import ChatMessage from './ChatMessage';

function ChatBody({ chat, isLoading, isError }) {
  useEffect(() => {
    const chatContainer = document.getElementById('chat-container');
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }, [chat]);

  return (
    <div className={styles.chatBody}>
      <div className={styles.chatContainer} id="chat-container">
      <ChatMessage
        message="Welcome back Master Bruce. How can I help you today, sir?"
        user={false}
        className={styles.introMessage}
      />

      {chat.map((message, index) => (
        <ChatMessage
          key={index}
          message={message.message}
          user={message.isUser}
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
    <div>className={styles.spacer}</div>
    </div></div>
  );
}

export default ChatBody;
