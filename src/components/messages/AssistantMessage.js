// src/components/AssistantMessage.js

import React, { useState, useEffect, useRef } from 'react';
import styles from '../body/ChatMessage.module.css';
import TxidLink from './widget/TxidLink';
import TokenDisplay from './widget/TokenDisplay';
import CopyButton from './widget/CopyButton';
import { marked } from 'marked';
import { processCodeElements } from '../../utils/markdownParser'; // Import the utility functions

function AssistantMessage({ content, txid, tokens, isNewMessage, avatarUrl }) {
  const [displayedContent, setDisplayedContent] = useState('');
  const [copyStatus] = useState({});
  const typingSpeed = 1;
  const [copyButtonText, setCopyButtonText] = useState('Copy');
  const contentRef = useRef(null);

  useEffect(() => {
    const stringContent = typeof content === 'string' ? content : JSON.stringify(content);
    const markdownContent = marked(stringContent);

    if (isNewMessage) {
      let index = 0;
      const timer = setInterval(() => {
        if (index < markdownContent.length) {
          setDisplayedContent(markdownContent.substring(0, index));
          index++;
        } else {
          clearInterval(timer);
        }
      }, typingSpeed);

      return () => clearInterval(timer);
    } else {
      setDisplayedContent(markdownContent);
    }
  }, [content, isNewMessage]);

  useEffect(() => {
    if (contentRef.current) {
      const htmlContent = contentRef.current;

      // Use the utility function to process code elements
      processCodeElements(htmlContent);
    }
  }, [displayedContent, copyStatus]);

  const handleCopy = () => {
    navigator.clipboard.writeText(displayedContent).then(() => {
      setCopyButtonText('Copied!');
      setTimeout(() => {
        setCopyButtonText('Copy');
      }, 2000);
    });
  };

  return (
    <div className={styles.messageWrapper}>
      {avatarUrl && <img src={avatarUrl} alt="ChatBSV" className={styles.avatar} />}
      <div className={`${styles.chatMessage} ${styles.assistantMessage}`}>
        <div
          className="markdown-content"
          ref={contentRef}
          dangerouslySetInnerHTML={{ __html: displayedContent }}
        />
        <div className={styles.chatLink}>
          <TxidLink txid={txid} />
          <TokenDisplay tokens={tokens} />
          <CopyButton handleCopy={handleCopy} copyButtonText={copyButtonText} />
        </div>
      </div>
    </div>
  );
}

export default AssistantMessage;
