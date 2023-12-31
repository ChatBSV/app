// src/components/CopyButton.js

import React from 'react';
import styles from '../../body/ChatMessage.module.css';
import Image from 'next/image'; // Import the Image component from next/image

function CopyButton({ handleCopy, copyButtonText }) {
  return (
    <a className={`${styles.copyButton} copyButton`} onClick={handleCopy}>
      <Image
        className={styles.copyIcon}
        src="/copy.svg" // Corrected image path
        alt="Copy"
        width={12} // Set your desired width
        height={12} // Set your desired height
      />
      <span style={{ fontSize: '11px'}}>{copyButtonText}</span>
    </a>
  );
}

export default CopyButton;
