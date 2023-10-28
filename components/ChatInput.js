// components/ChatInput.js
import React, { useState, useRef, useEffect } from 'react';
import styles from './ChatInput.module.css';
import ButtonIcon from './ButtonIcon';

const ChatInput = ({ handleSubmit, sessionToken, redirectionUrl }) => {
  const [requestType, setRequestType] = useState('chat'); // New state for request type
  const inputRef = useRef(null);
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    if (sessionToken) {
      setIsConnected(true);
    } else {
      setIsConnected(false);
    }
  }, [sessionToken]);

  const buttonText = () => {
    if (!isConnected) return 'Connect';
    return 'Send';
  };

  const handleFormSubmit = async () => {
    const prompt = inputRef.current.value.trim();
    if (prompt !== '') {
      if (prompt.startsWith('/imagine')) {
        setRequestType('image'); // Set request type to image for DALL-E requests
      }
      await handleSubmit(prompt, requestType);
      inputRef.current.value = '';
      setRequestType('chat'); // Reset request type back to chat
    } else {
      console.log('Prompt is empty. No request sent.');
    }
  };

  const handleKeyDown = async (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      await handleFormSubmit();
    }
  };

  return (
    <div className={styles.chatFooter}>
      <form onSubmit={handleFormSubmit} className={styles.inputForm}>
        <input
          type="text"
          onKeyDown={handleKeyDown}
          className={styles.inputField}
          placeholder="Enter your prompt..."
          ref={inputRef}
        />
        <div className={styles.mbWrapper}>
          <ButtonIcon 
            icon="https://uploads-ssl.webflow.com/646064abf2ae787ad9c35019/64f5b1e66dcd597fb1af816d_648029610832005036e0f702_hc%201.svg" 
            text={buttonText()}
            onClick={handleFormSubmit}
          />
        </div>
      </form>
    </div>
  );
};

export default ChatInput;
