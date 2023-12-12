// src/components/ButtonIcon.js

import React from 'react';
import styles from './ButtonIcon.module.css';

export default function ButtonIcon({ icon, text, onClick }) {
  return (
    <div className={styles.bgDarkBackground} onClick={onClick}>
      <div className={styles.flexGap}>
        <img
          src={icon} // Use the correct local image path or URL
          alt={text} // Set alt text as the text provided
          width={32} // Set your desired width
          height={32} // Set your desired height
          className={styles.inlineBlock}
        />
        <div className={styles.flexCol}>
          <span className={styles.fontBold}>{text}</span>
        </div>
      </div>
    </div>
  );
}
