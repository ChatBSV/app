// src/components/ShareButton.js

import React from 'react';
import styles from './ChatMessage.module.css';
import Image from 'next/image'; // Import the Image component from next/image

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
      <Image
        className={styles.copyIcon}
        src="/share.svg" // Corrected image path
        alt="Share"
        width={16} // Set your desired width
        height={16} // Set your desired height
      />
      <span style={{ fontSize: '11px', color: 'gray' }}>Share</span>
    </a>
  );
}

export default ShareButton;
