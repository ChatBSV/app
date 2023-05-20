// components/ChatBody.js

import React, { useEffect } from 'react';
import styles from './ChatBody.module.css';
import ChatMessage from './ChatMessage';

function ChatBody({ chat, fakeAssistantMessage }) {
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
    </div>
  );
}

export default ChatBody;
