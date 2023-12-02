// src/components/TokenDisplay.js

import React from 'react';
import styles from './ChatMessage.module.css';

function TokenDisplay({ tokens }) {
  return (
    <>
      <img
        className={styles.copyIcon}
        src="https://uploads-ssl.webflow.com/646064abf2ae787ad9c35019/6474a81e31e9c343912ede78_coins.svg"
        alt="Token Count"
      />
      <span style={{ fontSize: '11px', color: 'gray', marginRight: '11px' }}>
        Tokens:{tokens || 0}
      </span>
    </>
  );
}

export default TokenDisplay;
