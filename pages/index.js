// index.js

// index.js

import React, { useState } from 'react';
import ChatBody from '../components/ChatBody';
import ChatInput from '../components/ChatInput';
import Header from '../components/Header';
import './global.css';

const IndexPage = () => {
  const [chat, setChat] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleSubmit = (prompt) => {
    setChat((prevChat) => [...prevChat, { message: prompt, isUser: true }]);
    // Add your logic for processing the user's input here
  };

  const loadingAssistantMessage = {
    message: 'Loading.. Please wait...',
    isUser: false,
    isFake: false,
    sender: 'Assistant',
  };

  return (
    <div style={{ color: '#555', backgroundColor: '#f1f1f1', flexDirection: 'column', fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '16px', fontWeight: 400, lineHeight: '22px', display: 'flex', position: 'fixed', top: 0, bottom: 0, left: 0, right: 0 }}>
      <Header />
      <ChatBody chat={chat} />

      {isLoading && <ChatBody chat={[loadingAssistantMessage]} />}

      {isError && (
        <ChatBody chat={[{ message: 'Ooops. Something went wrong. Please try again or come back later.', isUser: false, isFake: false }]} />
      )}

      <div className="chat-footer">
        <ChatInput handleSubmit={handleSubmit} />
      </div>
    </div>
  );
};

export default IndexPage;
