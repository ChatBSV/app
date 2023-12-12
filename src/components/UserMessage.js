// src/components/UserMessage.js

import React from 'react';
import styles from './ChatMessage.module.css';
import { marked } from 'marked'; // Corrected import statement

function UserMessage({ content, avatarUrl }) {
  const markdownContent = marked(content); // Parse Markdown to HTML

  return (
    <div className={styles.messageWrapper}>
      <div className={`${styles.chatMessage} ${styles.userMessage}`}>
        <div className="markdown-content" dangerouslySetInnerHTML={{ __html: markdownContent }} />
      </div>
      {avatarUrl && <img src={avatarUrl} alt="ChatBSV" className={styles.avatar} />}

    </div>
  );
}

export default UserMessage;
