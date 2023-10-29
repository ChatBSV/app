// index.js

import React, { useState, useEffect } from 'react';
import { nanoid } from 'nanoid';
import ChatBody from '../components/ChatBody';
import ChatInput from '../components/ChatInput';
import Header from '../components/Header';
import Head from 'next/head';
import './global.css';

import HandCashService from "../src/services/HandCashService";
import SessionTokenRepository from "../src/repositories/SessionTokenRepository";

export function getServerSideProps({query, req}) {
    const cookies = req.headers.cookie || '';
    let sessionTokenFromCookie;

    try {
        sessionTokenFromCookie = cookies
            .split('; ')
            .find(row => row.startsWith('sessionToken='))
            ?.split('=')[1];
    } catch (error) {
        console.error('Error while parsing cookies:', error);
        return {
            props: {
                redirectionUrl: new HandCashService().getRedirectionUrl(),
                sessionToken: false,
                user: false,
            },
        };
    }
    
    const sessionToken = sessionTokenFromCookie;
    const redirectionUrl = new HandCashService().getRedirectionUrl();
    
    // Check if session token is valid
    let decodedSession = null;
    let validToken = false;
    if (sessionToken) {
        try {
            decodedSession = SessionTokenRepository.verify(sessionToken);
            validToken = true;
        } catch (error) {
            console.error('Invalid or expired session token:', error);
            validToken = false;
        }
    } else {
        console.log("No session token found.");
    }
    
    return {
        props: {
            redirectionUrl,
            sessionToken: validToken ? sessionToken : false,
            user: validToken ? decodedSession.user : false,
        },
    };
}


function IndexPage({ tokens, redirectionUrl, sessionToken, user }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [chat, setChat] = useState([]);
  const [txid, setTxid] = useState('');

  useEffect(() => {
    if (window.location.search.includes('reload=true')) {
      window.location.href = '/';
    }
  }, []);
  
  const getDalleImage = async (prompt, format, txid) => {
    try {
      const response = await fetch('/api/dalle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt, format }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      const imageUrl = data.imageUrl;
  
      const newDalleMessage = {
        id: nanoid(),
        role: 'dalle-image',
        content: imageUrl,
        txid: txid,
      };
  
      setChat((prevChat) => {
        const updatedChat = [...prevChat, newDalleMessage];
        localStorage.setItem('chat', JSON.stringify(updatedChat));
        return updatedChat;
      });
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching DALLE image:', error);
    }
  };
  

  const getAssistantReply = async (prompt, chatHistory) => {
    console.log('getAssistantReply', prompt, chatHistory)
    try {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), 30000);
  
      const response = await fetch('/api/get-chat-reply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
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
      return { message: '408 Request Timeout', tokens: 0 };
    }
  };
  
  
  const handleSubmit = async (userMessage, txid) => {
    const newUserMessage = {
      id: nanoid(),
      role: 'user',
      content: userMessage,
      txid: txid,
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
      if (userMessage.startsWith('/imagine ')) {
        const prompt = userMessage.replace('/imagine ', '');
        await getDalleImage(prompt, '1024x1024', txid);
      } else {
        const assistantResponse = await getAssistantReply(userMessage, chat);
  
        const newAssistantMessage = {
          id: nanoid(),
          role: 'assistant',
          content: assistantResponse.message,
          tokens: assistantResponse.tokens,
          txid: txid && !isLoading ? txid : null,
        };
  
        setChat((prevChat) => {
          const updatedChat = [...prevChat, newAssistantMessage];
          if (newAssistantMessage.content !== '408 Request Timeout') {
            localStorage.setItem('chat', JSON.stringify(updatedChat));
            localStorage.setItem('tokens', assistantResponse.tokens);
          }
          return updatedChat;
        });
  
        setIsLoading(false);}
    } catch (error) {
      console.error('Error:', error);
      setIsError(true);
      setErrorMessage(error.message || 'An error occurred');
      setIsLoading(false);
    }
  };  

  useEffect(() => {
    console.log('IndexPage: useEffect, sessionToken:', sessionToken);
    const storedChat = localStorage.getItem('chat');
    if (storedChat) {
      const parsedChat = JSON.parse(storedChat);
      setChat(parsedChat);
    }
  }, []);

  const resetChat = () => {
    localStorage.removeItem('chat');
    localStorage.removeItem('txid');
    localStorage.removeItem('tokens');
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
        <meta name="theme-color" content="#37C078"></meta>
        <meta property="og:title" content="ChatBSV - OpenAI on Bitcoin" />
        <meta
          property="og:description"
          content="Ask me anything! Micro transactions at their best. Pay per use OpenAI tokens."
        />
        <meta
          property="og:image"
          content="https://uploads-ssl.webflow.com/646064abf2ae787ad9c35019/64f5b1e609cfeef5f1198151_ChatBSV_openGraph.jpg"
        />
        <meta property="twitter:title" content="ChatBSV - OpenAI on Bitcoin" />
        <meta
          property="twitter:description"
          content="Ask me anything! Micro transactions at their best. Pay per use OpenAI tokens."
        />
        <meta
          property="twitter:image"
          content="https://uploads-ssl.webflow.com/646064abf2ae787ad9c35019/64f5b1e609cfeef5f1198151_ChatBSV_openGraph.jpg"
        />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <link
          rel="icon"
          href="https://uploads-ssl.webflow.com/646064abf2ae787ad9c35019/64f5b1e6fa8e0eb88fceaf82_chatbsv_favicon.png"
        />
        <link
          rel="apple-touch-icon"
          href="https://uploads-ssl.webflow.com/646064abf2ae787ad9c35019/64f5b1e72ee859647da0aa56_ChatBSV_webclip.png"
        />
       </Head>
      <Header resetChat={resetChat} redirectionUrl={redirectionUrl} sessionToken={sessionToken} user={user} />
      <ChatBody chat={chat} isLoading={isLoading} isError={isError} errorMessage={errorMessage} />
      <ChatInput handleSubmit={handleSubmit} sessionToken={sessionToken} redirectionUrl={redirectionUrl} />
    </div>
  );
}

export default IndexPage;