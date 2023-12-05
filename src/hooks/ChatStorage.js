// src/hooks/ChatStorage.js

import { useState, useCallback } from 'react';

export function useChatStorage() {
  const [chat, setChat] = useState([]);

  const loadChatFromStorage = useCallback(() => {
    const storedChat = localStorage.getItem('chat');
    if (storedChat) {
      const existingChat = JSON.parse(storedChat).map(message => ({ ...message, isNew: false }));
      setChat(existingChat);
    }
  }, []);

  const addMessageToChat = useCallback((message, isNew = true) => {
    setChat((prevChat) => {
      const newMessage = { ...message, isNew };
      const updatedChat = [...prevChat, newMessage];
      const chatWithoutErrors = updatedChat.filter(msg => msg.role !== 'error');
      localStorage.setItem('chat', JSON.stringify(chatWithoutErrors));
      return updatedChat;
    });
  }, []);

  return { chat, loadChatFromStorage, addMessageToChat };
}
