// components/ChatBody.js

import React, { useEffect, useState } from 'react';
import styles from './ChatBody.module.css';
import ChatMessage from './ChatMessage';

function ChatBody({ chat, isLoading, isError }) {
  const [hasIntroductionMessage, setHasIntroductionMessage] = useState(false);

  useEffect(() => {
    const chatContainer = document.getElementById('chat-container');
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }, [chat]);

  useEffect(() => {
    if (chat.length > 0) {
      const lastMessage = chat[chat.length - 1];
      if (lastMessage.isUser) {
        setHasIntroductionMessage(true);
      }
    }
  }, [chat]);

  return (
    <div id="chat-container" className={styles.chatBody}>
      {!hasIntroductionMessage && (
        <div className={`${styles.chatMessage} ${styles.assistantMessage}`}>
          <p>Hi there! I am Lillo.</p>
        </div>
      )}

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
