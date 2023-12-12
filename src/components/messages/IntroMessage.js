// src/components/IntroMessage.js

import React from 'react';
import styles from '../body/ChatMessage.module.css';

function IntroMessage({ content, avatarUrl }) {
  return (
    <div className={styles.messageWrapper}>
      {avatarUrl && <img src={avatarUrl} alt="ChatBSV" className={styles.avatar} />}
      <div className={`${styles.chatMessage} ${styles.introMessage}`}>
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </div>
    </div>
  );
}

export default IntroMessage;
