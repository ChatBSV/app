import styles from './ChatBody.module.css';

function ChatBody({ children }) {
    return (
        <div id="chat-container" className={styles.chatBody}>
            {children}
        </div>
    );
}

export default ChatBody;
