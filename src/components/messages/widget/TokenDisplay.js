// src/components/TokenDisplay.js

import React from 'react';
import styles from '../../body/ChatMessage.module.css';
import Image from 'next/image'; // Import the Image component from next/image

function TokenDisplay({ tokens }) {
  return (
    <>
      <Image
        className={styles.copyIcon}
        src="/tokens.svg" // Corrected image path
        alt="Token Count"
        width={16} // Set your desired width
        height={16} // Set your desired height
      />
      <span style={{ fontSize: '11px', color: 'gray', marginRight: '11px' }}>
        Tokens:{tokens || 0}
      </span>
    </>
  );
}

export default TokenDisplay;
