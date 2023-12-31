// src/components/Header.js

import React from 'react';
import styles from './Header.module.css';
import Image from 'next/image'; // Import the Image component from next/image

function Header({}) {

  return (
    <div className={styles.chatHeader}>
        <Image
        className={styles.logo}
        src="/chatbsv.svg" // Corrected image path
        alt="ChatBSV"
        width={150} // Set your desired width
        height={44} // Set your desired height
      />
    </div>
  );
}

export default Header;
