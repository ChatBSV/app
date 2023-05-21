import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ChatBody from '../components/ChatBody';
import ChatInput from '../components/ChatInput';
import Header from '../components/Header';
import Head from 'next/head';
import './global.css';

const IndexPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const corePrompt = process.env.CORE_PROMPT || ''; // Fetch the core prompt from the environment
  const [chat, setChat] = useState([{ message: corePrompt, isUser: false }]);
  const [sessionId, setSessionId] = useState('');

  useEffect(() => {
    // Generate a new session ID
    const newSessionId = generateSessionId();
    setSessionId(newSessionId);
  }, []);

  const generateSessionId = () => {
    // Logic to generate a unique session ID
    // Replace this with your own session ID generation logic
    return Math.random().toString(36).substring(2, 10);
  };

  const handleSubmit = async (prompt) => {
    setChat((prevChat) => [...prevChat, { message: prompt, isUser: true }]);
    setIsLoading(true);
    setIsError(false);

    try {
      const response = await axios.post('/.netlify/functions/getChatReply', {
        sessionId: sessionId,
        corePrompt: prevChat[prevChat.length - 1].message,
        prompt
      });

      setIsLoading(false);

      if (response.status === 200) {
        const output = response.data.message;
        setChat((prevChat) => [...prevChat, { message: output, isUser: false }]);
      } else {
        setIsError(true);
      }
    } catch (error) {
      console.error('Error:', error);
      setIsLoading(false);
      setIsError(true);
    }
  };

  return (
    <div style={{ color: '#555', backgroundColor: '#f1f1f1', flexDirection: 'column', fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '16px', fontWeight: 400, lineHeight: '22px', display: 'flex', position: 'fixed', top: 0, bottom: 0, left: 0, right: 0 }}>
      <Head>
        {/* Add your meta tags here */}
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
        <link rel="apple-touch-icon" href="https://uploads-ssl.webflow.com/646064abf2ae787ad9c35019/6469d331b39363e2e343ad07_AL-favicon.png" />
        <meta property="og:title" content="Hi there, I am AIfred." />
        <meta property="og:image" content="https://uploads-ssl.webflow.com/646064abf2ae787ad9c35019/6469d331b39363e2e343ad1a_AL-og.png" />
        <title>Hi there, I am AIfred.</title>
      </Head>
      <Header />
      <ChatBody chat={chat} isLoading={isLoading} isError={isError} />
      <ChatInput handleSubmit={handleSubmit} />
    </div>
  );
};

export default IndexPage;
