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
  const [txid, setTxid] = useState('');
  const [totalTokens, setTotalTokens] = useState(0);

  const handleSubmit = async (userMessage, assistantMessage, tokens, txid) => {
    const newUserMessage = {
      id: nanoid(),
      role: 'user',
      message: userMessage,
      tokens,
    };

    setChat((prevChat) => {
      const updatedChat = [...prevChat, newUserMessage];
      localStorage.setItem('chat', JSON.stringify(updatedChat));
      return updatedChat;
    });

    setIsLoading(true);
    setIsError(false);

    const newAssistantMessage = {
      id: nanoid(),
      role: 'assistant',
      message: assistantMessage,
      tokens,
      txid,
    };

    setChat((prevChat) => {
      const updatedChat = [...prevChat, newAssistantMessage];
      localStorage.setItem('chat', JSON.stringify(updatedChat));
      return updatedChat;
    });

    setTxid(txid);
    setTotalTokens(tokens);

    setIsLoading(false);
  };

  useEffect(() => {
    const storedChat = localStorage.getItem('chat');
    if (storedChat) {
      setChat(JSON.parse(storedChat));
    }
  }, []);

  const resetChat = () => {
    localStorage.removeItem('chat');
    window.location.reload();
  };

  return (
    <div class="viewport">
      <Head>
        <title>ChatBSV - OpenAI on Bitcoin</title>
        <meta name="description" content="Ask me anything! Micro transactions at their best. Pay per use OpenAI tokens." />
        <meta property="og:title" content="ChatBSV - OpenAI on Bitcoin" />
        <meta property="og:description" content="Ask me anything! Micro transactions at their best. Pay per use OpenAI tokens." />
        <meta property="og:image" content="https://uploads-ssl.webflow.com/646064abf2ae787ad9c35019/646c5d9aee77d85408f3b04e_ChatBSV_openGraph.png" />
        <meta property="twitter:title" content="ChatBSV - OpenAI on Bitcoin" />
        <meta property="twitter:description" content="Ask me anything! Micro transactions at their best. Pay per use OpenAI tokens." />
        <meta property="twitter:image" content="https://uploads-ssl.webflow.com/646064abf2ae787ad9c35019/646c5d9aee77d85408f3b04e_ChatBSV_openGraph.png" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="icon" href="https://uploads-ssl.webflow.com/646064abf2ae787ad9c35019/646c5d9af32cc531d70618d3_ChatBSV_favicon.png" />
        <link rel="apple-touch-icon" href="https://uploads-ssl.webflow.com/646064abf2ae787ad9c35019/646c5d9a07b99fb15443b97e_ChatBSV_webclip.png" />
      </Head>
      <Header resetChat={resetChat} />
      <ChatBody chat={chat} isLoading={isLoading} isError={isError} />
      <ChatInput handleSubmit={handleSubmit} />
    </div>
  );
}

export default IndexPage;
