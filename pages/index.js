// pages/index.js

import fetch from 'isomorphic-unfetch';
import { useState } from 'react';
import ChatInput from '../components/ChatInput';
import ChatBody from '../components/ChatBody';
import Header from '../components/Header';

export default function Home() {
  const [chat, setChat] = useState([]);

  const fetchAIResponse = async (prompt) => {
    const response = await fetch('/api/prompt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });
    const data = await response.json();
    return data.response;
  };

  const addChatMessage = (message, isUser) => {
    setChat([...chat, { message, isUser }]);
  };

  const handleSubmit = async (prompt) => {
    addChatMessage(prompt, true);
    const response = await fetchAIResponse(prompt);
    addChatMessage(response, false);
  };

  // Update the chat body with new messages
  const updateChatBody = (message, isUser) => {
    const updatedChat = [...chat, { message, isUser }];
    setChat(updatedChat);
  };

  return (
    <div>
      <Header />
      <ChatBody chat={chat} />
      <ChatInput handleSubmit={handleSubmit} updateChatBody={updateChatBody} />
    </div>
  );
}
