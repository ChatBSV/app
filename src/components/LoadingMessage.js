// src/components/LoadingMessage.js

import React from 'react';
import styles from './ChatMessage.module.css';

function LoadingMessage({ content }) {
  return (
    <div className={`${styles.chatMessage} ${styles.loadingMessage}`}>
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
}

export default LoadingMessage;
