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

  const getAssistantReply = async (prompt) => {
    try {
      const response = await fetch('/.netlify/functions/getChatReply', {
        method: 'POST',
        body: JSON.stringify({ prompt }),
      });
  
      if (response.ok) {
        const data = await response.json();
        return data.message;
      } else {
        console.error('Error:', response.status);
        return 'An error occurred during processing.';
      }
    } catch (error) {
      console.error('Error:', error);
      return 'An error occurred during processing.';
    }
  };

  const handleSubmit = (userMessage, userTokens, userTxid) => {
    const newUserMessage = {
      id: nanoid(),
      role: 'user',
      message: userMessage,
      tokens: userTokens,
      txid: userTxid,
    };
  
    // add the user's message to the chat immediately
    setChat((prevChat) => [...prevChat, newUserMessage]);
  
    setIsError(false); // Set error state to false before making the API request
    setIsLoading(true);
  
    try {
      const newAssistantMessage = {
        id: nanoid(),
        role: 'assistant',
        message: 'Loading...',
        tokens: responseTokens,
        txid: userTxid, // Pass the txid to the new assistant message
      };
  
      // update the chat with the assistant's message
      setChat((prevChat) => [...prevChat, newAssistantMessage]);
  
      // Fetch the assistant reply from OpenAI without sending the txid
      getAssistantReply(userMessage).then((assistantResponse) => {
        newAssistantMessage.message = assistantResponse;
  
        setChat((prevChat) => {
          const updatedChat = [...prevChat];
          const assistantIndex = updatedChat.findIndex((msg) => msg.id === newAssistantMessage.id);
          if (assistantIndex !== -1) {
            updatedChat.splice(assistantIndex, 1, newAssistantMessage);
          }
          return updatedChat;
        });
  
        setIsLoading(false); // Set loading state to false after receiving the assistant's response
      });
    } catch (error) {
      console.error('Error:', error);
      setIsError(true);
      setErrorMessage(error.message || 'An error occurred');
      setIsLoading(false); // Set loading state to false if there is an error
    }
  };
  

  useEffect(() => {
    const storedChat = localStorage.getItem('chat');
    if (storedChat) {
      const parsedChat = JSON.parse(storedChat);
      setChat(parsedChat);

      const lastAssistantMessage = parsedChat.find((message) => message.role === 'assistant');
      if (lastAssistantMessage) {
        setTxid(lastAssistantMessage.txid);
      }
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
