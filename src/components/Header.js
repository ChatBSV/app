// src/components/Header.js

import React from 'react';
import styles from './Header.module.css';

function Header() {
  return (
    <div className={styles.chatHeader}>
      <img
        className={styles.logo}
        src="https://uploads-ssl.webflow.com/646064abf2ae787ad9c35019/64f5b1e6b0587817f80e105b_ChatBSV_logo.svg"
        alt="ChatBSV"
      />
    </div>
  );
}

export default Header;
