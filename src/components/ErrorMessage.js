// src/components/ErrorMessage.js

import React from 'react';
import styles from './ChatMessage.module.css';
import getErrorMessage from '../lib/getErrorMessage';

function ErrorMessage({ error, avatarUrl }) {
  const errorMessage = getErrorMessage(error);

  return (
    <div className={styles.messageWrapper}>
      {avatarUrl && <img src={avatarUrl} alt="ChatBSV" className={styles.avatar} />}
      <div className={`${styles.chatMessage} ${styles.errorMessage}`}>
        <p>{errorMessage}</p>
      </div>
    </div>
  );
}

export default ErrorMessage;
