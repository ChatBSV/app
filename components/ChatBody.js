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
    <div id="chat-container" className={styles.chatBody}>
      <div className={`${styles.chatMessage} ${styles.assistantMessage}`}>
        <p>Hi there! I am Lillo.</p>
      </div>

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
        />
      )}
      {isError && (
        <ChatMessage
          message="Ooops. Something went wrong. Please try again or come back later."
          user={false}
        />
      )}
    </div>
  );
}

export default ChatBody;
