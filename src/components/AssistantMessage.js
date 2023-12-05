// src/components/AssistantMessage.js

import React, { useState, useEffect } from 'react';
import styles from './ChatMessage.module.css';
import TxidLink from './TxidLink';
import TokenDisplay from './TokenDisplay';
import CopyButton from './CopyButton';

function AssistantMessage({ content, txid, tokens, isNewMessage }) {
  const [displayedContent, setDisplayedContent] = useState('');
  const [copyButtonText, setCopyButtonText] = useState('Copy');
  const typingSpeed = 1; // milliseconds per character

  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index <= content.length) {
        setDisplayedContent(content.substring(0, index));
        index++;
      } else {
        clearInterval(timer);
      }
    }, typingSpeed);

    return () => clearInterval(timer);
  }, [content, isNewMessage]);

  const handleCopy = () => {
    navigator.clipboard.writeText(displayedContent).then(() => {
      setCopyButtonText('Copied!');
      setTimeout(() => {
        setCopyButtonText('Copy');
      }, 2000);
    });
  };

  return (
    <div className={`${styles.chatMessage} ${styles.assistantMessage}`}>
      <div dangerouslySetInnerHTML={{ __html: displayedContent.replace(/\n/g, '<br />') }} />
      <div className={styles.chatLink}>
        <TxidLink txid={txid} />
        <TokenDisplay tokens={tokens} />
        <CopyButton handleCopy={handleCopy} copyButtonText={copyButtonText} />
      </div>
    </div>
  );
}

export default AssistantMessage;
