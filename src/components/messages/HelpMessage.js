// src/components/HelpMessage.js

import React, { useEffect, useRef } from 'react';
import styles from '../body/ChatMessage.module.css';
import { marked } from 'marked';
import { processCodeElements, handleCopyCode } from '../../utils/markdownParser';

function HelpMessage({ content, avatarUrl }) {
  // Assuming `content` is a string containing Markdown
  const markdownContent = marked(content); // This will convert Markdown to HTML
  const contentRef = useRef(null);

  useEffect(() => {
    if (contentRef.current) {
      const htmlContent = contentRef.current;
      processCodeElements(htmlContent); // Assuming this does further processing on code elements
    }
  }, [content]);

  return (
    <div className={styles.messageWrapper}>
      {avatarUrl && <img src={avatarUrl} alt="ChatBSV" className={styles.avatar} />}
      <div className={`${styles.chatMessage} ${styles.helpMessage}`}>
        <div
          className="markdown-content"
          ref={contentRef}
          dangerouslySetInnerHTML={{ __html: markdownContent }}
        />
      </div>
    </div>
  );
}

export default HelpMessage;

