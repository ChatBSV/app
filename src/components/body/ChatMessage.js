// src/components/ChatMessage.js

import React from 'react';
import AssistantMessage from '../messages/AssistantMessage';
import UserMessage from '../messages/UserMessage';
import DalleImageMessage from '../messages/DalleImageMessage';
import MemeImageMessage from '../messages/MemeImageMessage';
import LoadingMessage from '../messages/LoadingMessage';
import IntroMessage from '../messages/IntroMessage';
import ErrorMessage from '../messages/ErrorMessage';
import HelpMessage from '../messages/HelpMessage'; // Import the HelpMessage component

function ChatMessage({ content, role, tokens, txid, isNewMessage, onImageLoad, avatarUrl }) {
  switch (role) {
    case 'assistant':
      return <AssistantMessage content={content} txid={txid} tokens={tokens} isNewMessage={isNewMessage} avatarUrl={avatarUrl} />;
    case 'user':
      return <UserMessage content={content} avatarUrl={avatarUrl} />;
    case 'dalle-image':
      return <DalleImageMessage content={content} txid={txid} onImageLoad={onImageLoad} avatarUrl={avatarUrl} />;
    case 'meme-image':
      return <MemeImageMessage content={content} txid={txid} onImageLoad={onImageLoad} avatarUrl={avatarUrl} />;
    case 'loading':
      return <LoadingMessage content={content} avatarUrl={avatarUrl} />;
    case 'intro':
      return <IntroMessage content={content} avatarUrl={avatarUrl} />;
    case 'error':
      return <ErrorMessage error={{ message: content }} avatarUrl={avatarUrl} />;
    case 'help':
      return <HelpMessage content={content} avatarUrl={avatarUrl} />;
    default:
      return null; // or some default message component
  }
}

export default ChatMessage;
