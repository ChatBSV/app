// src/components/ChatBody.js

/**
 * Renders the chat body component.
 *
 * @param {Object} props - The component props.
 * @param {Object} props.user - The user object.
 * @param {Array} props.chat - The array of chat messages.
 * @param {boolean} props.isLoading - Indicates if the chat is currently loading.
 * @param {boolean} props.isError - Indicates if an error occurred while loading the chat.
 * @param {string} props.errorMessage - The error message, if any.
 * @param {string} props.currentThreadId - The ID of the current thread.
 * @returns {JSX.Element} The rendered chat body component.
 */

import React from 'react';
import styles from './ChatBody.module.css';
import ChatMessage from './ChatMessage';
import useScrollToBottom from '../hooks/useScrollToBottom';
import loadingMessages from '../../content/loadingMessages.json';
import introMessage1 from '../../content/introMessage1.html';
import introMessage2 from '../../content/introMessage2.html';
import helpContent from '../../content/help.html';
import { nanoid } from 'nanoid';

function ChatBody({ user, chat, isLoading, isError, errorMessage, currentThreadId }) { // Ensure currentThreadId is destructured here
  const chatContainerRef = useScrollToBottom([chat]);

  const introKey1 = React.useMemo(() => `${currentThreadId}-${nanoid()}`, [currentThreadId]);
  const introKey2 = React.useMemo(() => `${currentThreadId}-${nanoid()}`, [currentThreadId]);
  const loadingKey = React.useMemo(() => `${currentThreadId}-${nanoid()}`, [currentThreadId]);
  const errorKey = React.useMemo(() => `${currentThreadId}-${nanoid()}`, [currentThreadId]);



  const renderMessage = (message) => {
    if (message.role === 'help') {

      return (
        <ChatMessage
          key={message.id}
          content={helpContent}
          role="help"
          dangerouslySetInnerHTML={{ __html: helpContent }}
        />
      );
    } else {

      return (
        <ChatMessage
          key={message.id}
          content={message.content}
          role={message.role}
          tokens={message.role === 'assistant' ? message.tokens : 0}
          txid={message.txid}
          onImageLoad={() => chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight}
          isNewMessage={message.isNew}
          user={user}
        />
      );
    }
  };


  const randomLoadingContent = isLoading
    ? loadingMessages[Math.floor(Math.random() * loadingMessages.length)]
    : '';

  return (
    <div className={styles.chatBody} ref={chatContainerRef}>
      <div className={styles.chatContainer}>
        <ChatMessage key={introKey1} content={introMessage1} role="intro" />
        <ChatMessage key={introKey2} content={introMessage2} role="intro" />

        {chat.map(renderMessage)}

        {isLoading && (
          <ChatMessage
            key={loadingKey}
            content={randomLoadingContent}
            role="loading"
          />
        )}

        {isError && errorMessage && (
          <ChatMessage
            key={errorKey}
            content={errorMessage}
            role="error"
          />
        )}

        <div className={styles.spacer}></div>
      </div>
    </div>
  );
}

export default ChatBody;