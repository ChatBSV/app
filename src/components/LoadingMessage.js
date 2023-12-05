// src/components/LoadingMessage.js

import React, { useState, useEffect } from 'react';
import styles from './ChatMessage.module.css';
import TypingEffect from './TypingEffect';

function LoadingMessage({ content }) {
  const typingSpeed = 1;
  const [showTypingEffect, setShowTypingEffect] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setShowTypingEffect(true);
    }, 500); // Delay the typing effect for 500 milliseconds
  }, []);

  return (
    <div className={`${styles.chatMessage} ${styles.loadingMessage}`}>
      {showTypingEffect ? (
        <TypingEffect content={content} typingSpeed={typingSpeed} />
      ) : null}
    </div>
  );
}

export default LoadingMessage;
