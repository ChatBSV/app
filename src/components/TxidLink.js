// src/components/TxidLink.js

import React from 'react';
import styles from './ChatMessage.module.css';

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
      <img
        className={styles.copyIcon}
        src="https://uploads-ssl.webflow.com/646064abf2ae787ad9c35019/6474a9bf4a0547694b83498c_linked.svg"
        alt="Transaction Link"
      />
      <span style={{ fontSize: '11px', color: 'gray' }}>
        TxID:{txid.slice(0, 5)}
      </span>
    </a>
  );
}

export default TxidLink;
