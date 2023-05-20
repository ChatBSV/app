// components/ChatMessage.js

import styles from './ChatMessage.module.css';

function ChatMessage({ message, user, sender }) {
  return (
    <div className={`${styles.chatMessage} ${user ? styles.userMessage : styles.assistantMessage}`}>
      <span className='paragraph'>{message}</span>
      {sender && <span className={styles.sender}>{sender}</span>}
    </div>
  );
}

export default ChatMessage;
