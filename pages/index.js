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
  const [txid, setTxid] = useState('');

  const getAssistantReply = async (prompt, chatHistory) => {
    try {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), 20000);
  
      const response = await fetch('/.netlify/functions/getChatReply', {
        method: 'POST',
        body: JSON.stringify({ prompt, history: chatHistory }),
        signal: controller.signal,
      });
  
      clearTimeout(id);
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      return { message: data.message, tokens: data.tokens };
    } catch (error) {
      console.error('Error:', error);
      return { message: 'An error occurred during processing.', tokens: 0 };
    }
  };
  
  
  const handleSubmit = async (userMessage, userTxid) => {
    const newUserMessage = {
      id: nanoid(),
      role: 'user',
      content: userMessage,
      txid: userTxid,
    };
  
    setChat((prevChat) => {
      const updatedChat = [...prevChat, newUserMessage];
      if (newUserMessage.role !== 'error' && newUserMessage.role !== 'loading') {
        localStorage.setItem('chat', JSON.stringify(updatedChat));
      }
      return updatedChat;
    });
  
    setIsError(false);
    setIsLoading(true);
  
    try {
      const storedChat = localStorage.getItem('chat');
      const parsedChat = storedChat ? JSON.parse(storedChat) : [];
  
      const assistantResponse = await getAssistantReply(userMessage, parsedChat);
  
      const newAssistantMessage = {
        id: nanoid(),
        role: 'assistant',
        content: assistantResponse.message,
        tokens: assistantResponse.tokens,
        txid: userTxid && !isLoading ? userTxid : null,
      };
  
      setChat((prevChat) => {
        const updatedChat = [...prevChat, newAssistantMessage];
        if (newAssistantMessage.content !== 'An error occurred during processing.') {
          localStorage.setItem('chat', JSON.stringify(updatedChat));
          localStorage.setItem('tokens', assistantResponse.tokens);
        }
        return updatedChat;
      });
  
      setIsLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setIsError(true);
      setErrorMessage(error.message || 'An error occurred');
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
    localStorage.removeItem('txid');
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