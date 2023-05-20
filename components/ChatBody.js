// components/ChatBody.js

import React, { useEffect } from 'react';
import styles from './ChatBody.module.css';
import ChatMessage from './ChatMessage';

function ChatBody({ chat, fakeAssistantMessage, isLoading, isError }) {
  useEffect(() => {
    const chatContainer = document.getElementById('chat-container');
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }, [chat]);

  return (
    <div id="chat-container" className={styles.chatBody}>
      {chat.map((message, index) => (
        <ChatMessage
          key={index}
          message={message.message}
          user={message.isUser}
          sender={message.sender}
        />
      ))}
      {chat.length === 0 && fakeAssistantMessage && (
        <ChatMessage
          message={fakeAssistantMessage}
          user={false}
          sender="Assistant"
        />
      )}
      {isLoading && (
        <ChatMessage
          message="Loading.. Please wait..."
          user={false}
          sender="Assistant"
        />
      )}
      {isError && (
        <ChatMessage
          message="Ooops. Something went wrong. Please try again or come back later."
          user={false}
          sender="Assistant"
        />
      )}
    </div>
  );
}

export default ChatBody;
