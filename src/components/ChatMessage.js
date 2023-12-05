// src/components/ChatMessage.js

/**
 * Renders a chat message based on the role.
 *
 * @param {Object} props - The props for the ChatMessage component.
 * @param {string} props.user - The user associated with the message.
 * @param {string} props.content - The content of the message.
 * @param {string} props.role - The role of the message (e.g., 'assistant', 'user', 'dalle-image').
 * @param {Array} props.tokens - The tokens associated with the message.
 * @param {string} props.txid - The transaction ID of the message.
 * @param {boolean} props.isNewMessage - Indicates whether the message is new.
 * @param {Function} props.onImageLoad - The callback function to handle image load.
 * @returns {React.Element|null} The rendered chat message component.
 */

import React from 'react';
import AssistantMessage from './AssistantMessage';
import UserMessage from './UserMessage';
import DalleImageMessage from './DalleImageMessage';
import MemeImageMessage from './MemeImageMessage';
import LoadingMessage from './LoadingMessage';
import IntroMessage from './IntroMessage';
import ErrorMessage from './ErrorMessage';
import HelpMessage from './HelpMessage';

function ChatMessage({ user, content, role, tokens, txid, isNewMessage, onImageLoad }) {
  switch (role) {
    case 'assistant':
      return <AssistantMessage content={content} txid={txid} tokens={tokens} isNewMessage={isNewMessage} />;
    case 'user':
      return <UserMessage user={user} content={content} />;
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
      return <HelpMessage content={content} />; 
    default:
      return null; 
  }
}

export default ChatMessage;

