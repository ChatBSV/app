// src/components/Header.js

import React from 'react';
import styles from './Header.module.css';
import ButtonIcon from './ButtonIcon';
import Image from 'next/image'; // Import the Image component from next/image

function Header({ resetChat, redirectionUrl, sessionToken, user }) {
  const onDisconnect = async () => {
    await fetch('/api/logout', {
      method: 'POST',
    });
    window.location.href = '/';
  };

  return (
    <div className={styles.chatHeader}>
      {sessionToken ? (
        <div className={styles.loginButton}>
          <div className={styles.loginContainer}>
            <ButtonIcon icon={user.avatarUrl} text={user.handle} />
            <button className={styles.disconnectButton} onClick={onDisconnect}>
              Disconnect
            </button>
          </div>
        </div>
      ) : (
        <div className={styles.loginButton}>
          <a href={redirectionUrl}>
            <ButtonIcon
              icon="/HC.svg" // Corrected image path
              text="Connect"
            />
          </a>
        </div>
      )}
      <Image
        className={styles.logo}
        src="/chatbsv.svg" // Corrected image path
        alt="ChatBSV"
        width={200} // Set your desired width
        height={50} // Set your desired height
      />
      <button className={styles.resetButton} onClick={resetChat}></button>
    </div>
  );
}

export default Header;
