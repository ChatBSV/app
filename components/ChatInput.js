import { useState } from 'react';
import axios from 'axios';

const ChatInput = () => {
  const [input, setInput] = useState('');

  const renderMessage = (sender, message, isUser) => {
    const messageDiv = document.createElement('div');
    messageDiv.className = isUser ? 'chat-message user-message' : 'chat-message assistant-message';
    messageDiv.innerHTML = `<strong>${sender}</strong> ${message}`;
    chatContainer.appendChild(messageDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const prompt = input.trim();

    if (prompt !== '') {
      renderMessage('', prompt, true);
      try {
        const response = await axios.post('/.netlify/functions/getChatReply', { prompt });
        const output = response.data.message;
        renderMessage('', output, false);
      } catch (error) {
        console.error('Error:', error);
      }
      setInput('');
    }
  };

  const handleInputChange = (event) => setInput(event.target.value);

  return (
    <form onSubmit={handleSubmit} className="input-form">
      <input
        type="text"
        value={input}
        onChange={handleInputChange}
        className="input-field"
        placeholder="Enter your prompt here"
      />
      <button type="submit" className="submit-button">
        Submit
      </button>
    </form>
  );
};

export default ChatInput;
