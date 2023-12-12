// src/components/HelpMessage.js

import React from 'react';
import styles from '../body/ChatMessage.module.css';

const helpMessageStyle = {
  whiteSpace: 'pre-line',
};

function HelpMessage({ content, avatarUrl }) {
  return (
    <div className={styles.messageWrapper}>
      {avatarUrl && <img src={avatarUrl} alt="ChatBSV" className={styles.avatar} />}
      <div className={`${styles.chatMessage} ${styles.helpMessage}`} style={helpMessageStyle}>
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </div>
    </div>
  );
}

export default HelpMessage;
