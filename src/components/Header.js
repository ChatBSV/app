// src/components/Header.js

import React from 'react';
import styles from './Header.module.css';
import ButtonIcon from './ButtonIcon';

function Header({ resetChat, redirectionUrl, sessionToken, user }) {
  const onDisconnect = async () => {
    await fetch('/api/logout', {
      method: 'POST',
    });
    window.location.href = "/";
  };

  return (
    <div className={styles.chatHeader}>
      {sessionToken ? (
        <div className={styles.loginButton}>
          <div className={styles.loginContainer}>
            <ButtonIcon icon={user.avatarUrl} text={user.handle} />
            <button
              className={styles.disconnectButton}
              onClick={onDisconnect}
            >
              Disconnect
            </button>
          </div>
        </div>
      ) : (
        <div className={styles.loginButton}>
          <a href={redirectionUrl}>
            <ButtonIcon icon="https://uploads-ssl.webflow.com/646064abf2ae787ad9c35019/64f5b1e66dcd597fb1af816d_648029610832005036e0f702_hc%201.svg" text="Connect" />
          </a>
        </div>
      )}
      <img
        className={styles.logo}
        src="https://uploads-ssl.webflow.com/646064abf2ae787ad9c35019/64f5b1e6b0587817f80e105b_ChatBSV_logo.svg"
        alt="ChatBSV"
      />
      <button className={styles.resetButton} onClick={resetChat}></button>
    </div>
  );
}

export default Header;
