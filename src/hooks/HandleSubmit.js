// src/hooks/HandleSubmit.js

import { nanoid } from 'nanoid';
import { fetchChatReply } from './FetchChatReply';
import { tokenizeChatHistory } from './ChatTokenizer'; // Import the tokenizeChatHistory function

export function handleSubmit(addMessageToChat, chat) {
  return async (userMessage, txid, requestType) => {
    const newUserMessage = {
      id: nanoid(),
      role: 'user',
      content: userMessage,
      txid: txid,
    };

    addMessageToChat(newUserMessage);

    const tokenizedHistory = await tokenizeChatHistory(chat.map(m => m.content).join('\n'));
    const chatReply = await fetchChatReply(userMessage, tokenizedHistory, requestType);
    
    if (chatReply) {
      let newMessage;
      if (requestType === 'image') {
        newMessage = {
          id: nanoid(),
          role: 'dalle-image',
          content: chatReply.imageUrl,
          txid: txid,
        };
      } else if (requestType === 'meme') {
        newMessage = {
          id: nanoid(),
          role: 'meme-image',
          content: chatReply.imageUrl,
          txid: txid,
        };
      } else {
        newMessage = {
          id: nanoid(),
          role: 'assistant',
          content: chatReply.message,
          tokens: chatReply.tokens || 0,
          txid: txid,
        };
      }

      addMessageToChat(newMessage);
    }
  };
}
