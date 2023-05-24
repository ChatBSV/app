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
        {!isLoading && chat.map((message) => (
          <ChatMessage
            key={message.id}
            message={message.message}
            user={message.role === 'user'}
            tokens={message.tokens}
            txid={message.txid}
          />
        ))}
        {isLoading && (
          <ChatMessage
            message="Counting satoshis, please hold..."
            user={false}
            tokens={null}
            txid={null}
          />
        )}
        {isError && (
          <ChatMessage
            message="OpenAI error. Please try again or come back later."
            user={false}
            tokens={null}
            txid={null}
          />
        )}
        <div className={styles.spacer}></div>
      </div>
    </div>
  );
}

export default ChatBody;
