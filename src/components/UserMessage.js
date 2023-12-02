// src/components/UserMessage.js

import React from 'react';
import styles from './ChatMessage.module.css';

function UserMessage({ content }) {
  return (
    <div className={`${styles.chatMessage} ${styles.userMessage}`}>
      <div dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br />') }} />
    </div>
  );
}

export default UserMessage;
