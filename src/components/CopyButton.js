// src/components/CopyButton.js

import React from 'react';
import styles from './ChatMessage.module.css';

function CopyButton({ handleCopy, copyButtonText }) {
  return (
    <a className={`${styles.copyButton} copyButton`} onClick={handleCopy}>
      <img
        className={styles.copyIcon}
        src="https://uploads-ssl.webflow.com/646064abf2ae787ad9c35019/6474a7ac96040b5fe425c4f8_copy-two-paper-sheets-interface-symbol.svg"
        alt="Copy"
      />
      <span style={{ fontSize: '11px', color: 'gray' }}>{copyButtonText}</span>
    </a>
  );
}

export default CopyButton;
