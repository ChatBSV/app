// index.js

import React, { useState } from 'react';
import axios from 'axios';
import ChatBody from '../components/ChatBody';
import ChatInput from '../components/ChatInput';
import Header from '../components/Header';
import './global.css';

const IndexPage = () => {
  const [chat, setChat] = useState([]);

  const handleSubmit = async (prompt) => {
    const response = await getChatReply(prompt);
    const output = response.data.message;
    setChat([...chat, { message: prompt, isUser: true }, { message: output, isUser: false }]);
  };

  const getChatReply = async (prompt) => {
    try {
      const response = await axios.post('/.netlify/functions/getChatReply', { prompt });
      return response;
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  };

  return (
    <div style={{ color: '#555', backgroundColor: '#f1f1f1', flexDirection: 'column', fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '16px', fontWeight: 400, lineHeight: '22px', display: 'flex', position: 'fixed', top: 0, bottom: 0, left: 0, right: 0 }}>
      <Header />
      <ChatBody chat={chat} />
      <div className="chat-footer">
        <ChatInput handleSubmit={handleSubmit} />
      </div>
    </div>
  );
};

export default IndexPage;

