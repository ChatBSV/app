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
    const newUserMessage = {
      id: nanoid(),
      role: 'user',
      message: userMessage,
      tokens: userMessage.split(' ').length,
    };

    setChat((prevChat) => {
      localStorage.setItem('chat', JSON.stringify([...prevChat, newUserMessage]));
      return [...prevChat, newUserMessage];
    });

    setIsLoading(true);
    setIsError(false);

    try {
      const response = await axios.post('/.netlify/functions/getChatReply', {
        prompt: userMessage,
        lastUserMessage: chat.length > 0 ? chat[chat.length - 1].message : null,
        txid: '', // Set initial value of txid as an empty string
      });

      const assistantMessage = response.data.message;
      const totalTokens = response.data.totalTokens;
      const txid = response.data.txid; // Extract the txid from the response

      const newAssistantMessage = {
        id: nanoid(),
        role: 'assistant',
        message: assistantMessage,
        tokens: totalTokens,
        txid: txid, // Assign the extracted txid
      };

      setChat((prevChat) => {
        localStorage.setItem('chat', JSON.stringify([...prevChat, newAssistantMessage]));
        return [...prevChat, newAssistantMessage];
      });

      setIsLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setIsError(true);
      setIsLoading(false);
    }
  }

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
