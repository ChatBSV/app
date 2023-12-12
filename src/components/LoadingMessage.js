// src/components/LoadingMessage.js

import React from 'react';
import styles from './ChatMessage.module.css';

function LoadingMessage({ content, avatarUrl }) {
  return (
    <div className={styles.messageWrapper}>
      {avatarUrl && <img src={avatarUrl} alt="ChatBSV" className={styles.avatar} />}
      <div className={`${styles.chatMessage} ${styles.loadingMessage}`}>
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </div>
    </div>
  );
}

export default LoadingMessage;
