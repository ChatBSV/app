import styles from './ChatBody.module.css';

function ChatBody({ chat }) {
  return (
    <div id="chat-container" className={styles.chatBody}>
      {chat.map((message, index) => (
        <div key={index} className={`chat-message ${message.isUser ? 'user-message' : 'assistant-message'}`}>
          <strong>{message.sender}</strong> {message.message}
        </div>
      ))}
    </div>
  );
}

export default ChatBody;
