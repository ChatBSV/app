// netlify/functions/renderMessage.js

export const renderMessage = (sender, message, isUser) => {
  const messageDiv = document.createElement('div');
  messageDiv.className = isUser ? 'chat-message user-message' : 'chat-message assistant-message';
  messageDiv.innerHTML = `<strong>${sender}</strong> ${message}`;
  const chatContainer = document.getElementById('chat-container');
  chatContainer.appendChild(messageDiv);
  chatContainer.scrollTop = chatContainer.scrollHeight;
};
