// DalleImageMessage.js

import React from 'react';
import styles from './ChatMessage.module.css';
import TxidLink from './TxidLink';
import ShareButton from './ShareButton';

function DalleImageMessage({ content, onImageLoad, txid }) {
  return (
    <div className={`${styles.chatMessage} ${styles.imageMessage}`}>
      <p>Here&apos;s where my imagination took me:</p>
      <div className={styles.imagewrap}>
        <img className={styles.image} src={content} alt='DALL-E Generated Image' onLoad={onImageLoad} />
      </div>
      <p>This image will be available for an hour. Right-click over the image to save it.</p>
      <div className={styles.chatLink}>
        <TxidLink txid={txid} />
        <ShareButton content={content} />
      </div>
    </div>
  );
}

export default DalleImageMessage;
