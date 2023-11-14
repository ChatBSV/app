// src/components/ChatBody.js

import React, { useEffect, useRef } from 'react';
import styles from './ChatBody.module.css';
import ChatMessage from './ChatMessage';
import loadingMessages from '../../loadingMessages.json';


function ChatBody({ chat, isLoading, isError, errorMessage }) {
  const chatContainerRef = useRef(null);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    // Function to scroll to the bottom
    const scrollToBottom = () => {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      }
    };

    // Set up a Mutation Observer to watch for changes in the chat container
    const observer = new MutationObserver(mutations => {
      for (let mutation of mutations) {
        if (mutation.type === 'childList' || mutation.type === 'attributes') {
          scrollToBottom();
          break;
        }
      }
    });

    if (chatContainerRef.current) {
      observer.observe(chatContainerRef.current, { 
        childList: true, 
        subtree: true,
        attributes: true,
        attributeFilter: ['style'] // observing style changes, as image loading affects the style attribute
      });
    }

    // Clean up the observer on component unmount
    return () => observer.disconnect();
  }, []);

  // Get a random loading message
  const randomLoadingMessage = isLoading
    ? loadingMessages[Math.floor(Math.random() * loadingMessages.length)]
    : '';

  return (
    <div className={styles.chatBody} ref={chatContainerRef}>
      <div className={styles.chatContainer}>
        <ChatMessage
          content={`<span style="font-weight:500;">Welcome Home, Master Bruce.`}
          role="intro"
          className={styles.introMessage}
        />
        <ChatMessage
  content={`Powerful AI microservices for tiny Bitcoin microtransactions.
  
  Commands:
    <strong>/help</strong> to Get information.
    <strong>[Enter]</strong> to Send.
    <strong>[Shift+Enter]</strong> for a Line Break or to Skip a Line.
    <strong>/imagine</strong> a description of your image.
    <strong>/imagine</strong> prompt <strong>--format</strong> 512, 1024, (Formats for DALL-E 2).
    <strong>/imagine</strong> prompt <strong>--format</strong> Horizontal, Vertical. (Formats for DALL-E 3).
    
    <span style="font-size:13px; font-weight:600;">GPT 3.5 Turbo, $0.01 / Message</span>
    <span style="font-size:13px; font-weight:600;">GPT 4, $0.05 / Message</span>
    <span style="font-size:13px; font-weight:600;">DALL-E 2: $0.05 per image | Default: 1024</span>
    <span style="font-size:13px; font-weight:600;">DALL-E 3: $0.10 per image | Default: Square</span>

    Connect your <strong>Handcash</strong> wallet and happy prompting.`}
  role="intro"
  className={styles.introMessage}
/>
        
        {chat.map((message) => {
  if (message.role === 'help') {
    // Render a special help message

    return (
      <ChatMessage
        key={message.id}
        content={message.content}
        role={message.role}
        // Add any other props necessary for help messages
        dangerouslySetInnerHTML={{ __html: message.content }}

      />
    );
  } else {
    // Render regular chat messages
    return (
      <ChatMessage
        key={message.id}
        content={message.content}
        role={message.role}
        tokens={message.role === 'assistant' ? message.tokens : 0}
        txid={message.txid}
        onImageLoad={scrollToBottom} // Pass the scrollToBottom function as a prop
        isNewMessage={message.isNew} // Assuming you have a way to set this flag

      />
    );
  }
})}

{isLoading && (
  <ChatMessage
    content={randomLoadingMessage}
    role="loading"
    className={styles.loadingMessage}
  />
)}

{isError && errorMessage && (
  <ChatMessage
    content={errorMessage}
    role="error"
    className={styles.errorMessage}
  />
)}

        <div className={styles.spacer}></div>
      </div>
    </div>
  );
}

export default ChatBody;

