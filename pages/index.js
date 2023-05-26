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
  const [chat, setChat] = useState([]);
  const [txid, setTxid] = useState('');

  const handleSubmit = async (userMessage, userTokens, userTxid) => {
    const newUserMessage = {
      id: nanoid(),
      role: 'user',
      message: userMessage,
      tokens: userTokens,
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
      });

      const assistantMessage = response.data.message;
      const totalTokens = response.data.totalTokens;

      const newAssistantMessage = {
        id: nanoid(),
        role: 'assistant',
        message: assistantMessage,
        tokens: totalTokens,
        txid: userTxid,
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
        {/* Meta tags */}
      </Head>
      <Header resetChat={resetChat} />
      <ChatBody chat={chat} isLoading={isLoading} isError={isError} />
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
