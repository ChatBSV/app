// src/components/IntroMessage.js

import React from 'react';
import styles from '../body/ChatMessage.module.css';
import { marked } from 'marked'; // Corrected import statement

function IntroMessage({ content, avatarUrl }) {
  const markdownContent = marked(content); // Parse Markdown to HTML

  return (
    <div className={styles.messageWrapper}>
      {avatarUrl && <img src={avatarUrl} alt="ChatBSV" className={styles.avatar} />}
      <div className={`${styles.chatMessage} ${styles.introMessage}`}>
        <div className="markdown-content" dangerouslySetInnerHTML={{ __html: markdownContent }} />
      </div>
    </div>
  );
}

export default IntroMessage;