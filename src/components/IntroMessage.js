// src/components/IntroMessage.js

import React from 'react';
import styles from './ChatMessage.module.css';

function IntroMessage({ content }) {
  return (
    <div className={`${styles.chatMessage} ${styles.introMessage}`}>
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
}

export default IntroMessage;
