// src/components/MemeImageMessage.js

import React from 'react';
import styles from './ChatMessage.module.css';
import TxidLink from './TxidLink';
import ShareButton from './ShareButton';

function MemeImageMessage({ content, onImageLoad, txid }) {
  return (
    <div className={`${styles.chatMessage} ${styles.imageMessage}`}>
      <img src={content} alt="Meme Image" onLoad={onImageLoad} />
      <div className={styles.chatLink}>
        <TxidLink txid={txid} />
        <ShareButton content={content} />
      </div>
    </div>
  );
}

export default MemeImageMessage;
