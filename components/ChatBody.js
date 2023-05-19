// /components/ChatBody.js

import styles from './ChatBody.module.css';

function ChatBody({ chat }) {
  const renderMessage = (sender, message, isUser) => {
    const messageDiv = document.createElement('div');
    messageDiv.className = isUser ? 'chat-message user-message' : 'chat-message assistant-message';
    messageDiv.innerHTML = `<strong>${sender}</strong> ${message}`;
    const chatContainer = document.getElementById('chat-container');
    chatContainer.appendChild(messageDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
  };

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
