// src/components/ErrorMessage.js

import React from 'react';
import styles from './ChatMessage.module.css';
import getErrorMessage from '../lib/getErrorMessage';

function ErrorMessage({ error }) {
  const errorMessage = getErrorMessage(error);

  return (
    <div className={`${styles.chatMessage} ${styles.errorMessage}`}>
      <p>{errorMessage}</p>
    </div>
  );
}

export default ErrorMessage;
