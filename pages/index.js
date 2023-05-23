// index.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { nanoid } from 'nanoid';
import ChatBody from '../components/ChatBody';
import ChatInput from '../components/ChatInput';
import Header from '../components/Header';
import Head from 'next/head';
import './global.css';

function IndexPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [chat, setChat] = useState([]);

  const handleSubmit = async (userMessage) => {
    // Append user's message to chat immediately
    const newUserMessage = { 
      id: nanoid(), 
      role: 'user', 
      message: userMessage, 
      tokens: userMessage.split(' ').length 
    };
    
    setChat(prevChat => {
      localStorage.setItem('chat', JSON.stringify([...prevChat, newUserMessage]));
      return [...prevChat, newUserMessage];
    });
    
    setIsLoading(true);
    setIsError(false);
    
    try {
      const response = await axios.post('/.netlify/functions/getChatReply', {
        prompt: userMessage,
        lastUserMessage: chat.length > 0 ? chat[chat.length - 1].message : null
      });
  
      const assistantMessage = response.data.message;
      const totalTokens = response.data.totalTokens;
  
      const newAssistantMessage = { 
        id: nanoid(), 
        role: 'assistant', 
        message: assistantMessage, 
        tokens: totalTokens 
      };
  
      // Append assistant's message to chat after response
      setChat(prevChat => {
        localStorage.setItem('chat', JSON.stringify([...prevChat, newAssistantMessage]));
        return [...prevChat, newAssistantMessage];
      });
  
      setIsLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setIsError(true);
      setIsLoading(false);
    }
  };
  

  useEffect(() => {
    const storedChat = localStorage.getItem('chat');
    if (storedChat) {
      setChat(JSON.parse(storedChat));
    }
  }, []);

  return (
    <div style={{ color: '#555', backgroundColor: '#f1f1f1', flexDirection: 'column', fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '16px', fontWeight: 400, lineHeight: '22px', display: 'flex', position: 'fixed', top: 0, bottom: 0, left: 0, right: 0 }}>
      <Head>
        <title>Hi there, I am AIfred.</title>
        <meta name="description" content="Your local friendly interface to OpenAI. Ask me anything!" />
        <meta property="og:title" content="Hi there, I am AIfred." />
        <meta property="og:description" content="Your local friendly interface to OpenAI. Ask me anything!" />
        <meta property="og:image" content="https://uploads-ssl.webflow.com/646064abf2ae787ad9c35019/6469d331b39363e2e343ad1a_AL-og.png" />
        <meta property="twitter:title" content="Hi there, I am AIfred." />
        <meta property="twitter:description" content="Your local friendly interface to OpenAI. Ask me anything!" />
        <meta property="twitter:image" content="https://uploads-ssl.webflow.com/646064abf2ae787ad9c35019/6469d331b39363e2e343ad1a_AL-og.png" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="icon" href="https://uploads-ssl.webflow.com/646064abf2ae787ad9c35019/6469d331b39363e2e343ad07_AL-favicon.png" />
        <link rel="apple-touch-icon" href="https://uploads-ssl.webflow.com/646064abf2ae787ad9c35019/6469d33188cfb0d03f9067f7_AL-webclip.png" />
      </Head>
      <Header />
      <ChatBody chat={chat} isLoading={isLoading} isError={isError} />
      <ChatInput handleSubmit={handleSubmit} />
    </div>
  );
};

export default IndexPage;
