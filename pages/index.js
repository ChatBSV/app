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
      const response = await axios.post('/.netlify/functions/getChatReply', { prompt });
      return response;
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  };

  useEffect(() => {
    
    const metaTags = [
      { name: 'description', content: 'Your local friendly interface to OpenAI. Ask me anything!' },
      { property: 'og:title', content: 'Hi there, I am AIfred.' },
      { property: 'og:description', content: 'Your local friendly interface to OpenAI. Ask me anything!' },
      { property: 'og:image', content: '/images/AL-og.png' },
      { property: 'twitter:title', content: 'Hi there, I am AIfred.' },
      { property: 'twitter:description', content: 'Your local friendly interface to OpenAI. Ask me anything!' },
      { property: 'twitter:image', content: '/images/AL-og.png' },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' }
    ];

    metaTags.forEach(meta => {
      const metaElement = document.createElement('meta');
      Object.entries(meta).forEach(([key, value]) => {
        metaElement.setAttribute(key, value.replace("'", "&apos;"));
      });
      document.head.appendChild(metaElement);
    });


    const favicon = document.createElement('link');
    favicon.rel = 'icon';
    favicon.href = '/images/AL-favicon.png';
    document.head.appendChild(favicon);

    const webclip = document.createElement('link');
    webclip.rel = 'apple-touch-icon';
    webclip.href = '/images/AL-webclip.png';
    document.head.appendChild(webclip);
  }, []);

  return (
    <div style={{ color: '#555', backgroundColor: '#f1f1f1', flexDirection: 'column', fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '16px', fontWeight: 400, lineHeight: '22px', display: 'flex', position: 'fixed', top: 0, bottom: 0, left: 0, right: 0 }}>
      <Head>
        <title>Hi there, I am AIfred.</title>
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
