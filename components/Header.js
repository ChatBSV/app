// components/Header.js

import React from 'react';
import styles from './Header.module.css';
import ButtonIcon from './ButtonIcon';

function Header({ resetChat, redirectionUrl, sessionToken, user }) {
  // const sessionToken = true;

  const onDisconnect = async () => {
    window.location.href = "/";
  };

  const paymentResult = null;
  const pay = null;

  return (
    <div className={styles.chatHeader}>
      {sessionToken ?
      <div className={`w-full mb-4 flex justify-between items-end ${styles.loginButton}`}>
            <div className="flex items-center gap-x-1 group">
                {/* <div className="bg-darkBackground-700 rounded-full border m-0 hover:bg-darkBackground-900">
                    <div className="flex gap-x-3 pr-6">
                        <img src={user.avatarUrl}
                              className="inline-block w-8 h-8 border-white/50 rounded-full border-r border-t border-b"/>
                        <div className="flex flex-col justify-center items-start gap-y-0.5">
                            <span className="font-bold text-white/90 leading-4">${user.handle}</span>
                        </div>
                    </div>
                </div> */}
                <ButtonIcon icon={user.avatarUrl} text={user.handle} />
                <button
                    className="rounded-lg px-3 py-1.5 text-xs bg-white/20 shadow-sm shadow-white/20 invisible group-hover:visible font-semibold text-red-400 hover:text-red-500 border border-transparent hover:border-red-500/30"
                    onClick={onDisconnect}>Disconnect
                </button>
            </div>
            {/* <div
                className={"flex px-4 h-8 items-center rounded-full border bg-gradient-to-r from-brandNormal to-brandDark hover:opacity-90 text-sm font-semibold hover:cursor-pointer" + (paymentResult?.status === 'pending' ? 'animate-pulse' : '')}
                onClick={paymentResult?.status === 'pending' ? null : pay}>
                <p>{paymentResult?.status === 'pending' ? 'Running...' : 'Run this code'}</p>
            </div> */}
      </div>
      :        <div className={`w-full mb-4 flex justify-between items-end ${styles.loginButton}`}>
        <a href={redirectionUrl}>
        <ButtonIcon icon="https://handcash.io/favicon.ico" text="connect" />
        {/* <div className="bg-darkBackground-700 rounded-full border m-0 hover:bg-darkBackground-900">
                    <div className="flex gap-x-3 pr-6">
                        <img src="https://handcash.io/favicon.ico"
                              className="inline-block w-8 h-8 border-black/50 rounded-full border-r border-t border-b opacity-90 bg-darkBackground-900"/>
                        <div className="flex flex-col justify-center items-start gap-y-0.5">
                            <span className="font-bold text-white/90 leading-4">connect</span>
                        </div>
                    </div>
                </div> */}
        
          </a>
          </div>}

      <img
        src="https://uploads-ssl.webflow.com/646064abf2ae787ad9c35019/646c5d9a14230f767d19fea9_ChatBSV_logo.png"
        alt="ChatBSV"
        style={{ height: '44px', marginTop: '5px' }}
      />
      <button className={styles.resetButton} onClick={resetChat}></button>
    </div>
  );
}

export default Header;