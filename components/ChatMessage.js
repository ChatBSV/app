// components/ChatMessage.js

import styles from './ChatMessage.module.css';

function ChatMessage({ message, user, sender }) {
  return (
    <div className={`${styles.chatMessage} ${user ? styles.userMessage : styles.assistantMessage}`}>
      <p className='paragraph'>{message}</p>
      {sender && <span className={styles.sender}>{sender}</span>}
    </div>
  );
}

export default ChatMessage;
