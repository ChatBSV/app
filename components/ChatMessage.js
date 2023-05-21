// components/ChatMessage.js

import styles from './ChatMessage.module.css';

function ChatMessage({ message, user, totalTokens }) {
  return (
    <div className={`${styles.chatMessage} ${user ? styles.userMessage : styles.assistantMessage}`}>
      <span style={{ fontSize: '16px' }}>{message}</span>
      {totalTokens && !user && <span style={{ fontSize: '14px', color: 'gray' }}>Tokens used: {totalTokens}</span>}
    </div>
  );
}

export default ChatMessage;
