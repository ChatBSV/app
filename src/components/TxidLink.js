// src/components/TxidLink.js

import React from 'react';
import styles from './ChatMessage.module.css';
import Image from 'next/image'; // Import the Image component from next/image

function TxidLink({ txid }) {
  if (!txid) {
    return <span>N/A</span>;
  }

  return (
    <a
      className={`${styles.copyButton} copyButton`}
      href={`https://whatsonchain.com/tx/${txid}`}
      target="_blank"
      rel="noopener noreferrer"
      style={{ textDecoration: 'none' }}
    >
      <Image
        className={styles.copyIcon}
        src="/txid.svg" // Corrected image path
        alt="Transaction Link"
        width={16} // Set your desired width
        height={16} // Set your desired height
      />
      <span style={{ fontSize: '11px', color: 'gray' }}>
        TxID:{txid.slice(0, 5)}
      </span>
    </a>
  );
}

export default TxidLink;
