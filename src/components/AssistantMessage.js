// src/components/AssistantMessage.js

import React, { useState, useEffect } from 'react';
import styles from './ChatMessage.module.css';
import TxidLink from './TxidLink';
import TokenDisplay from './TokenDisplay';
import CopyButton from './CopyButton';
import { marked } from 'marked'; // Corrected import statement

function AssistantMessage({ content, txid, tokens, isNewMessage, avatarUrl }) {
  const [displayedContent, setDisplayedContent] = useState('');
  const [copyButtonText, setCopyButtonText] = useState('Copy');
  const typingSpeed = 1; // milliseconds per character

  useEffect(() => {
    const stringContent = typeof content === 'string' ? content : JSON.stringify(content);
    const markdownContent = marked(stringContent); // Parse Markdown to HTML

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
      setDisplayedContent(markdownContent); // Immediate display for other cases
    }
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
    <div className={styles.messageWrapper}>
      {avatarUrl && <img src={avatarUrl} alt="ChatBSV" className={styles.avatar} />}
      <div className={`${styles.chatMessage} ${styles.assistantMessage}`}>
        <div className="markdown-content" dangerouslySetInnerHTML={{ __html: displayedContent }} />
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
