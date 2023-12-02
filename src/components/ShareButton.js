// src/components/ShareButton.js

import React from 'react';
import styles from './ChatMessage.module.css';

function ShareButton({ content }) {
  const createTweetLink = (imageUrl) => {
    const tweetText = encodeURIComponent("Check out this image! ");
    const url = encodeURIComponent(imageUrl);
    return `https://twitter.com/intent/tweet?url=${url}&text=${tweetText}`;
  };

  return (
    <a
      className={`${styles.copyButton} shareButton`}
      href={createTweetLink(content)}
      target="_blank"
      rel="noopener noreferrer"
    >
      <img
        className={styles.copyIcon}
        src="https://uploads-ssl.webflow.com/646064abf2ae787ad9c35019/6569742189e524678d783797_share%20(1).svg"
        alt="Share"
      />
      <span style={{ fontSize: '11px', color: 'gray' }}>Share</span>
    </a>
  );
}

export default ShareButton;
