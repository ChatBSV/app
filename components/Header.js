// components/Header.js

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

  const paymentResult = null;
  const pay = null;

  return (
    <div className={styles.chatHeader}>
      {sessionToken ?
        <div className={`w-full mb-4 flex justify-between items-end ${styles.loginButton}`}>
          <div className="flex items-center gap-x-1 group">
            <ButtonIcon icon={user.avatarUrl} text={user.handle} />
            <button
              className="rounded-lg px-3 py-1.5 text-xs bg-white/20 shadow-sm shadow-white/20 invisible group-hover:visible font-semibold text-red-400 hover:text-red-500 border border-transparent "
              onClick={onDisconnect}>Disconnect
            </button>
          </div>
        </div>
      :
        <div className={`w-full mb-4 flex justify-between items-end ${styles.loginButton}`}>
          <a href={redirectionUrl}>
            <ButtonIcon icon="https://uploads-ssl.webflow.com/646064abf2ae787ad9c35019/64f5b1e66dcd597fb1af816d_648029610832005036e0f702_hc%201.svg" text="Connect" />
          </a>
        </div>
      }
      <img className='logo'
        src="https://uploads-ssl.webflow.com/646064abf2ae787ad9c35019/64f5b1e6b0587817f80e105b_ChatBSV_logo.svg"
        alt="ChatBSV"
        style={{ height: '44px', marginTop: '5px' }}
      />
      <button className={styles.resetButton} onClick={resetChat}></button>
    </div>
  );
}

export default Header;
