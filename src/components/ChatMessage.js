// src/components/ChatMessage.js

import React from 'react';
import AssistantMessage from './AssistantMessage';
import UserMessage from './UserMessage';
import DalleImageMessage from './DalleImageMessage';
import MemeImageMessage from './MemeImageMessage';
import LoadingMessage from './LoadingMessage';
import IntroMessage from './IntroMessage';
import ErrorMessage from './ErrorMessage';
import HelpMessage from './HelpMessage'; // Import the HelpMessage component

function ChatMessage({ content, role, tokens, txid, isNewMessage, onImageLoad }) {
  switch (role) {
    case 'assistant':
      return <AssistantMessage content={content} txid={txid} tokens={tokens} isNewMessage={isNewMessage} />;
    case 'user':
      return <UserMessage content={content} />;
    case 'dalle-image':
      return <DalleImageMessage content={content} txid={txid} onImageLoad={onImageLoad} />;
    case 'meme-image':
      return <MemeImageMessage content={content} txid={txid} onImageLoad={onImageLoad} />;
    case 'loading':
      return <LoadingMessage content={content} />;
    case 'intro':
      return <IntroMessage content={content} />;
    case 'error':
      return <ErrorMessage error={content} />;
    case 'help':
      return <HelpMessage content={content} />; // Use the HelpMessage component
    default:
      return null; // or some default message component
  }
}

export default ChatMessage;

