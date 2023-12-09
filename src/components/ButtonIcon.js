// src/components/ButtonIcon.js

import React from 'react';
import styles from './ButtonIcon.module.css';
import Image from 'next/image'; // Import the Image component from next/image

export default function ButtonIcon({ icon, text, onClick }) {
  return (
    <div
      className={styles.bgDarkBackground}
      onClick={onClick}
    >
      <div className={styles.flexGap}>
        <Image
          src={icon} // Use the correct local image path or URL
          className={styles.inlineBlock}
          alt={text} // Set alt text as the text provided
          width={32} // Set your desired width
          height={32} // Set your desired height
        />
        <div className={styles.flexCol}>
          <span className={styles.fontBold}>{text}</span>
        </div>
      </div>
    </div>
  );
}
