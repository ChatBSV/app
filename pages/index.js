// index.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ChatBody from '../components/ChatBody';
import ChatInput from '../components/ChatInput';
import Header from '../components/Header';
import Head from 'next/head';
import './global.css';

const IndexPage = () => {
  const [chat, setChat] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [corePrompt, setCorePrompt] = useState('');

  useEffect(() => {
    // Fetch the core prompt from the server
    fetchCorePrompt();
  }, []);

  const fetchCorePrompt = async () => {
    try {
      const response = await axios.get('/.netlify/functions/getCorePrompt');
      const corePrompt = response.data.corePrompt;
      setCorePrompt(corePrompt);
    } catch (error) {
      console.error('Error:', error);
      setIsError(true);
    }
  };

  const handleSubmit = async (prompt) => {
    setChat((prevChat) => [...prevChat, { message: prompt, isUser: true }]);
    setIsLoading(true);
    setIsError(false);

    const response = await getChatReply(prompt);

    setIsLoading(false);

    if (response) {
      const output = response.data.message;
      setChat((prevChat) => [...prevChat, { message: output, isUser: false }]);
    } else {
      setIsError(true);
    }
  };

  const getChatReply = async (prompt) => {
    try {
      const response = await axios.post('/.netlify/functions/getChatReply', { corePrompt, prompt });
      return response;
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  };

  return (
    <div style={{ color: '#555', backgroundColor: '#f1f1f1', flexDirection: 'column', fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '16px', fontWeight: 400, lineHeight: '22px', display: 'flex', position: 'fixed', top: 0, bottom: 0, left: 0, right: 0 }}>
      <Head>
        {/* Head tags */}
      </Head>
      <Header />
      <ChatBody chat={chat} isLoading={isLoading} isError={isError} />
      <div className="chat-footer">
        <ChatInput handleSubmit={handleSubmit} />
      </div>
    </div>
  );
};

export default IndexPage;
