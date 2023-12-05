// src/components/ErrorMessage.js

import React, { useState, useEffect } from 'react';
import styles from './ChatMessage.module.css';
import getErrorMessage from '../lib/getErrorMessage';
import TypingEffect from './TypingEffect';

function ErrorMessage({ error }) {
  const errorMessage = getErrorMessage(error);
  const typingSpeed = 1;
  const [showTypingEffect, setShowTypingEffect] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setShowTypingEffect(true);
    }, 500); // Delay the typing effect for 500 milliseconds
  }, []);

  return (
    <div className={`${styles.chatMessage} ${styles.errorMessage}`}>
      <img src="https://pbs.twimg.com/profile_images/1721917992211025920/XMhpGxfg_400x400.jpg" alt="" className="message-avatar"/>
      {showTypingEffect ? (
        <TypingEffect content={errorMessage} typingSpeed={typingSpeed} />
      ) : null}
    </div>
  );
}

export default ErrorMessage;
