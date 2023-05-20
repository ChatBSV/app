import React, { useState } from 'react';
import axios from 'axios';
import ChatBody from '../components/ChatBody';
import ChatInput from '../components/ChatInput';
import Header from '../components/Header';
import './global.css';


const IndexPage = () => {
  const [chat, setChat] = useState([]);

  const handleSubmit = async (prompt) => {
    const { OPENAI_API_KEY, CORE_PROMPT } = process.env;
  
    const fullPrompt = [
      {
        role: 'system',
        content: CORE_PROMPT,
      },
      {
        role: 'user',
        content: prompt,
      },
    ];
  
      setChat([...chat, { message: prompt, isUser: true }]);
  
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: fullPrompt,
        },
        {
          headers: {
            Authorization: `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );
  
      const output = response.data.choices[0].message.content;
  
     
      setChat([...chat, { message: output, isUser: false }]);
    } catch (error) {
      console.error('Error:', error);
    }
  };


  return (
    <div style={{ color: '#555', backgroundColor: '#f1f1f1', flexDirection: 'column', fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '16px', fontWeight: 400, lineHeight: '22px', display: 'flex', position: 'fixed', top: 0, bottom: 0, left: 0, right: 0 }}>
      <Header />
      <ChatBody chat={chat} />
      <div className="chat-footer">
      <ChatInput handleSubmit={handleSubmit} />
    </div>
    </div>
  );
};

export default IndexPage;
