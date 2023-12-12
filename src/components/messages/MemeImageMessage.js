// MemeImageMessage.js

import React from 'react';
import styles from '../body/ChatMessage.module.css';
import TxidLink from './widget/TxidLink';
import ShareButton from './widget/ShareButton';

function MemeImageMessage({ content, onImageLoad, txid, avatarUrl }) {
  return (
    <div className={styles.messageWrapper}>
      {avatarUrl && <img src={avatarUrl} alt="ChatBSV" className={styles.avatar} />}
      <div className={`${styles.chatMessage} ${styles.imageMessage}`}>
        <p>Here&apos;s your new meme, sir - s0ry I c4n&apos;s tyyype v3ry w3ll.</p>
        <div className={styles.imagewrap}>
          <img className={styles.image} src={content} alt='Meme' onLoad={onImageLoad} />
        </div>
        <p>This image will be available for an hour. Right-click over the image to save it.</p>
        <div className={styles.chatLink}>
          <TxidLink txid={txid} />
          <ShareButton content={content} />
        </div>
      </div>
    </div>
  );
}

export default MemeImageMessage;
