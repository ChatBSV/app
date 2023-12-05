import React from 'react';
import styles from './ChatMessage.module.css';

const helpMessageStyle = {
  whiteSpace: 'pre-line',
};

function HelpMessage({ content }) {
  return (
    <div className={`${styles.chatMessage} ${styles.helpMessage}`} style={helpMessageStyle}>
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
}

export default HelpMessage;

