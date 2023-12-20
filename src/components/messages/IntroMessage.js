// src/components/IntroMessage.js

import React, { useEffect, useRef } from 'react';
import styles from '../body/ChatMessage.module.css';
// import { marked } from 'marked'; // Commented out the Markdown parser import
// import { processCodeElements, handleCopyCode } from '../../utils/markdownParser'; // Commented out the utility functions import

function IntroMessage({ content, avatarUrl }) {
  // const markdownContent = marked(content); // Commented out Markdown parsing
  const contentRef = useRef(null);

  useEffect(() => {
    if (contentRef.current) {
      // const htmlContent = contentRef.current;

      // Handle inline code elements
      const inlineCodeElements = contentRef.current.querySelectorAll('code:not(pre > code)');
      inlineCodeElements.forEach((codeElement) => {
        if (!codeElement.hasAttribute('data-processed')) {
          codeElement.onclick = () => {
            navigator.clipboard.writeText(codeElement.textContent).then(() => {
              const originalText = codeElement.textContent;
              codeElement.textContent = 'Copied!';
              setTimeout(() => {
                codeElement.textContent = originalText;
              }, 2000);
            });
            codeElement.setAttribute('data-processed', 'true');
          };
        }
      });
    }
  }, [content]);

  return (
    <div className={styles.messageWrapper}>
      {avatarUrl && <img src={avatarUrl} alt="ChatBSV" className={styles.avatar} />}
      <div className={styles.chatMessage}>
        <div
          className="markdown-content"
          ref={contentRef}
          dangerouslySetInnerHTML={{ __html: content }} // Render content as pure HTML
        />
      </div>
    </div>
  );
}

export default IntroMessage;
