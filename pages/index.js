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
    const addMetaTag = (name, content) => {
      const metaElement = document.createElement('meta');
      metaElement.name = name;
      metaElement.content = content;
      document.head.appendChild(metaElement);
    };

    const addLinkTag = (rel, href) => {
      const linkElement = document.createElement('link');
      linkElement.rel = rel;
      linkElement.href = href;
      document.head.appendChild(linkElement);
    };

    addMetaTag('description', 'Your local friendly interface to OpenAI. Ask me anything!');
    addMetaTag('og:title', 'Hi there, I am AIfred.');
    addMetaTag('og:description', 'Your local friendly interface to OpenAI. Ask me anything!');
    addMetaTag('og:image', '/images/AL-og.png');
    addMetaTag('twitter:title', 'Hi there, I am AIfred.');
    addMetaTag('twitter:description', 'Your local friendly interface to OpenAI. Ask me anything!');
    addMetaTag('twitter:image', '/images/AL-og.png');
    addMetaTag('og:type', 'website');
    addMetaTag('twitter:card', 'summary_large_image');

    addLinkTag('icon', '/images/AL-favicon.png');
    addLinkTag('apple-touch-icon', '/images/AL-webclip.png');
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
