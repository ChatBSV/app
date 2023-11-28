// src/components/ChatMessage.js

import React, { useState, useEffect } from 'react';
import styles from './ChatMessage.module.css';
import getErrorMessage from '../lib/getErrorMessage';

function ChatMessage({ content, role, tokens, txid, isNewMessage, onImageLoad }) {
  const isAssistantMessage = role === 'assistant';
  const isUserMessage = role === 'user';
  const isDalleImage = role === 'dalle-image';
  const isLoadingMessage = role === 'loading';
  const isIntroMessage = role === 'intro';

  const [displayedContent, setDisplayedContent] = useState('');
  const [copyButtonText, setCopyButtonText] = useState('Copy');
  const [error, setError] = useState('');
  const typingSpeed = 1; // milliseconds per character

  const handleImageLoad = () => {
    if (onImageLoad) {
      onImageLoad();
    }
  };

  useEffect(() => {
    // Ensure content is a string
    const stringContent = typeof content === 'string' ? content : JSON.stringify(content);
  
    if (isAssistantMessage && isNewMessage) {
      let index = 0;
      const timer = setInterval(() => {
        if (index <= stringContent.length) {
          setDisplayedContent(stringContent.substring(0, index));
          index++;
        } else {
          clearInterval(timer);
        }
      }, typingSpeed);
  
      return () => clearInterval(timer);
    } else {
      setDisplayedContent(stringContent); // Immediate display for other cases
    }
  }, [content, isAssistantMessage, isNewMessage]);
  const handleCopy = async (message) => {
    try {
      await navigator.clipboard.writeText(message);
      setCopyButtonText('Copied!');
      setTimeout(() => {
        setCopyButtonText('Copy');
      }, 2000);
    } catch (error) {
      setError(getErrorMessage(error));
    }
  };

  const shouldShowWidget = isAssistantMessage || isDalleImage;

  return (
    <div
      className={`${styles.chatMessage} ${
        isAssistantMessage ? styles.assistantMessage : ''
      } ${isUserMessage ? styles.userMessage : ''} ${
        isLoadingMessage ? styles.loadingMessage : ''
      } ${error ? styles.errorMessage : ''
      } ${isIntroMessage ? styles.introMessage : ''} ${
        isDalleImage ? styles.dalleImage : ''
      }`}
    >
      {isDalleImage ? (
        <img src={content} alt="DALL-E Generated Image" onLoad={handleImageLoad} />
      ) : (
        <div dangerouslySetInnerHTML={{ __html: displayedContent ? displayedContent.replace(/\n/g, '<br />') : '' }} />
      )}
      {shouldShowWidget && !isLoadingMessage && (
        <div className={styles.chatLink}>
          {txid ? (
            <a
              className={`${styles.copyButton} copyButton`}
              href={`https://whatsonchain.com/tx/${txid}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                textDecoration: 'none',
              }}
            >
              <img
                className={styles.copyIcon}
                src="https://uploads-ssl.webflow.com/646064abf2ae787ad9c35019/6474a9bf4a0547694b83498c_linked.svg"
                alt="Transaction Link"
              />
              <span 
                style={{
                  fontSize: '11px',
                  color: 'gray',
                  textDecoration: 'none',
                }}
              >
                TxID:{txid.slice(0, 5)}
              </span>
            </a>
          ) : (
            <span>N/A</span>
          )}
          <img
            className={styles.copyIcon}
            src="https://uploads-ssl.webflow.com/646064abf2ae787ad9c35019/6474a81e31e9c343912ede78_coins.svg"
            alt="Token Count"
          />
          <span style={{ fontSize: '11px', color: 'gray', marginRight: '11px' }}>
            Tokens:{tokens || 0}
          </span>
          <a
            className={`${styles.copyButton} copyButton`}
            onClick={() => handleCopy(content)}
          >
            <img
              className={styles.copyIcon}
              src="https://uploads-ssl.webflow.com/646064abf2ae787ad9c35019/6474a7ac96040b5fe425c4f8_copy-two-paper-sheets-interface-symbol.svg"
              alt="Copy"
            />
            <span style={{ fontSize: '11px', color: 'gray' }}>{copyButtonText}</span>
          </a>
        </div>
      )}
      {error && <p className={styles.errorMessage}>{error}</p>}
    </div>
  );
}

export default ChatMessage;