// components/ChatMessage.js

import styles from './ChatMessage.module.css';

function ChatMessage({ message, user }) {
    return (
        <div className={`${styles.chatMessage} ${user ? styles.userMessage : styles.assistantMessage}`}>
            <p>{message}</p>
        </div>
    );
}

export default ChatMessage;
