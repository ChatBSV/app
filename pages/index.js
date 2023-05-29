// index.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { nanoid } from 'nanoid';
import ChatBody from '../components/ChatBody';
import ChatInput from '../components/ChatInput';
import Header from '../components/Header';
import Head from 'next/head';
import './global.css';

function IndexPage({ tokens }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [chat, setChat] = useState([]);

  const handleSubmit = async (userMessage, userTxid) => {
    const newUserMessage = {
      role: 'user',
      content: userMessage,
      txid: userTxid,
    };

    // Update chat state immediately with the user message
    setChat((prevChat) => {
      const updatedChat = [...prevChat, newUserMessage];
      localStorage.setItem('chat', JSON.stringify(updatedChat));
      return updatedChat;
    });
    

    setIsError(false);
    setIsLoading(true); 

    try {
      const response = await axios.post('/.netlify/functions/getChatReply', {
        prompt: userMessage, 
        history: chat, 
      });

      const assistantMessage = response.data.message;
      const responseTokens = response.data.tokens;
      console.log('Tokens:', responseTokens); 

      const newAssistantMessage = {
        id: nanoid(),
        role: 'assistant',
        message: assistantMessage,
        tokens: responseTokens,
        txid: userTxid,
      };

    
      setChat((prevChat) => [...prevChat, newAssistantMessage]);
      localStorage.setItem('chat', JSON.stringify([...chat, newUserMessage, newAssistantMessage]));

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
      const parsedChat = JSON.parse(storedChat);
      setChat(parsedChat);
    }
  }, []);

  const resetChat = () => {
    localStorage.removeItem('chat');
    window.location.reload();
  };

  return (
    <div className="viewport">
      <Head>
        <title>ChatBSV - OpenAI on Bitcoin</title>
        <meta
          name="description"
          content="Ask me anything! Micro transactions at their best. Pay per use OpenAI tokens."
        />
        <meta property="og:title" content="ChatBSV - OpenAI on Bitcoin" />
        <meta
          property="og:description"
          content="Ask me anything! Micro transactions at their best. Pay per use OpenAI tokens."
        />
        <meta
          property="og:image"
          content="https://uploads-ssl.webflow.com/646064abf2ae787ad9c35019/646c5d9aee77d85408f3b04e_ChatBSV_openGraph.png"
        />
        <meta property="twitter:title" content="ChatBSV - OpenAI on Bitcoin" />
        <meta
          property="twitter:description"
          content="Ask me anything! Micro transactions at their best. Pay per use OpenAI tokens."
        />
        <meta
          property="twitter:image"
          content="https://uploads-ssl.webflow.com/646064abf2ae787ad9c35019/646c5d9aee77d85408f3b04e_ChatBSV_openGraph.png"
        />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <link
          rel="icon"
          href="https://uploads-ssl.webflow.com/646064abf2ae787ad9c35019/646c5d9af32cc531d70618d3_ChatBSV_favicon.png"
        />
        <link
          rel="apple-touch-icon"
          href="https://uploads-ssl.webflow.com/646064abf2ae787ad9c35019/646c5d9a07b99fb15443b97e_ChatBSV_webclip.png"
        />
      </Head>
      <Header resetChat={resetChat} />
      <ChatBody chat={chat} isLoading={isLoading} isError={isError} errorMessage={errorMessage} />
      <ChatInput handleSubmit={handleSubmit} />
    </div>
  );
}

export async function getStaticProps() {
  const tokens = 100;

  return {
    props: {
      tokens,
    },
  };
}

export default IndexPage;
