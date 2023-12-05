// src/components/AssistantMessage.js

import React, { useState, useEffect } from 'react';
import styles from './ChatMessage.module.css';
import TxidLink from './TxidLink';
import TokenDisplay from './TokenDisplay';
import CopyButton from './CopyButton';

function AssistantMessage({ content, txid, tokens, isNewMessage }) {
  const [displayedContent, setDisplayedContent] = useState('');
  const [copyButtonText, setCopyButtonText] = useState('Copy');
  const typingSpeed = 1;

  useEffect(() => {
    let index = 0;
    let timer = null;

    if (isNewMessage) {
      timer = setInterval(() => {
        if (index <= content.length) {
          setDisplayedContent(content.substring(0, index));
          index++;
        } else {
          clearInterval(timer);
        }
      }, typingSpeed);
    } else {
      setDisplayedContent(content); // Display the content directly
    }

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
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
          <img src="https://pbs.twimg.com/profile_images/1721917992211025920/XMhpGxfg_400x400.jpg" alt="" className="message-avatar"/>

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
