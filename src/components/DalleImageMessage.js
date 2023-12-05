// src/components/DalleImageMessage.js

import React from 'react';
import styles from './ChatMessage.module.css';
import TxidLink from './TxidLink';
import ShareButton from './ShareButton';

function DalleImageMessage({ content, onImageLoad, txid }) {
  return (
    <div className={`${styles.chatMessage} ${styles.imageMessage}`}>
      <img src={content} alt="DALL-E Generated Image" onLoad={onImageLoad} />
      <div className={styles.chatLink}>
        <TxidLink txid={txid} />
        <ShareButton content={content} />
      </div>
    </div>
  );
}

export default DalleImageMessage;
