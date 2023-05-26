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

  const handleSubmit = async (userMessage, userTokens, userTxid) => {
    const newUserMessage = {
      id: nanoid(),
      role: 'user',
      message: userMessage,
      tokens: userTokens,
      txid: userTxid,
    };

    // Update chat state immediately with the user message
    setChat((prevChat) => [...prevChat, newUserMessage]);
    localStorage.setItem('chat', JSON.stringify([...chat, newUserMessage]));

    setIsError(false); // Reset error state before making the API request
    setIsLoading(true); // Set loading state to true before making the API request

    try {
      const response = await axios.post('/.netlify/functions/getChatReply', {
        prompt: userMessage,
        lastUserMessage: chat.length > 0 ? chat[chat.length - 1].message : null,
        history: chat, // include the chat history in the request body
      });

      const assistantMessage = response.data.message;
      const responseTokens = response.data.tokens;
      console.log('Tokens:', responseTokens); // Log the tokens value

      const newAssistantMessage = {
        id: nanoid(),
        role: 'assistant',
        message: assistantMessage,
        tokens: responseTokens,
        txid: userTxid,
      };

      // Update chat state with the assistant message
      setChat((prevChat) => [...prevChat, newAssistantMessage]);
      localStorage.setItem('chat', JSON.stringify([...chat, newUserMessage, newAssistantMessage]));

      // Save the txid in local storage
      setTxid(userTxid);
      localStorage.setItem('txid', userTxid);

      setIsLoading(false); // Set loading state to false after receiving the assistant's response
    } catch (error) {
      console.error('Error:', error);
      setIsError(true); // Set error state to true if there is an error
      setIsLoading(false); // Set loading state to false if there is an error
    }
  };

  useEffect(() => {
    const storedChat = localStorage.getItem('chat');
    const storedTxid = localStorage.getItem('txid');
    if (storedChat) {
      const parsedChat = JSON.parse(storedChat);
      setChat(parsedChat);
    }
    if (storedTxid) {
      setTxid(storedTxid);
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
  // Fetch the tokens from an API or any other source
  const tokens = 100;

  return {
    props: {
      tokens,
    },
  };
}

export default IndexPage;
