// src/components/AssistantMessage.js

import React, { useState, useEffect, useRef } from 'react';
import styles from '../body/ChatMessage.module.css';
import TxidLink from './widget/TxidLink';
import TokenDisplay from './widget/TokenDisplay';
import CopyButton from './widget/CopyButton';
import { marked } from 'marked';
import { processCodeElements } from '../../utils/markdownParser';

function AssistantMessage({ content, txid, tokens, avatarUrl, timestamp }) {
  const [displayedContent, setDisplayedContent] = useState('');
  const [isContentRendered, setIsContentRendered] = useState(false);
  const [copyStatus] = useState({}); // Retaining the copy status
  const [copyButtonText, setCopyButtonText] = useState('Copy');
  const contentRef = useRef(null);

  useEffect(() => {
    const currentTime = Date.now();
    const timeDifference = currentTime - timestamp;

    if (!isContentRendered && timeDifference < 10000) { // 10 seconds threshold
      const stringContent = typeof content === 'string' ? content : JSON.stringify(content);
      const markdownContent = marked(stringContent);

      let index = 0;
      const timer = setInterval(() => {
        if (index < markdownContent.length) {
          setDisplayedContent(markdownContent.substring(0, index));
          index++;
        } else {
          clearInterval(timer);
          setIsContentRendered(true); // Mark the content as rendered
        }
      }, 1); // Adjust typing speed as needed

      return () => clearInterval(timer);
    } else {
      setDisplayedContent(marked(content));
    }
  }, [content, isContentRendered, timestamp]);

  useEffect(() => {
    if (contentRef.current) {
      processCodeElements(contentRef.current);
    }
  }, [displayedContent, copyStatus]);

  const handleCopy = () => {
    navigator.clipboard.writeText(displayedContent).then(() => {
      setCopyButtonText('Copied!');
      setTimeout(() => setCopyButtonText('Copy'), 2000);
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
