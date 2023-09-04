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
                    <div className="flex gap-x-3 pr-6" style={{ paddingTop: '7px', paddingLeft: '7px', paddingBottom: '7px', paddingRight: '20px' }} >
                        <img src={user.avatarUrl}
                              className="inline-block w-8 h-8 border-white/50 rounded-full border-r border-t border-b"/>
                        <div className="flex flex-col justify-center items-start gap-y-0.5">
                            <span className="font-bold text-white/90 leading-4">${user.handle}</span>
                        </div>
                    </div>
                </div> */}
                <ButtonIcon icon={user.avatarUrl} text={user.handle} />
                <button
                    className="rounded-lg px-3 py-1.5 text-xs bg-white/20 shadow-sm shadow-white/20 invisible group-hover:visible font-semibold text-red-400 hover:text-red-500 border border-transparent "
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
        <ButtonIcon icon="https://uploads-ssl.webflow.com/646064abf2ae787ad9c35019/64f5b1e66dcd597fb1af816d_648029610832005036e0f702_hc%201.svg" text="Connect" />
        {/* <div className="bg-darkBackground-700 rounded-full border m-0 hover:bg-darkBackground-900">
                    <div className="flex gap-x-3 pr-6" style={{ paddingTop: '7px', paddingLeft: '7px', paddingBottom: '7px', paddingRight: '20px' }}>
                        <img src="https://uploads-ssl.webflow.com/646064abf2ae787ad9c35019/64f5b1e66dcd597fb1af816d_648029610832005036e0f702_hc%201.svg"
                              className="inline-block w-8 h-8 border-black/50 rounded-full border-r border-t border-b opacity-90 bg-darkBackground-900"/>
                        <div className="flex flex-col justify-center items-start gap-y-0.5">
                            <span className="font-bold text-white/90 leading-4">Connect</span>
                        </div>
                    </div>
                </div> */}
        
          </a>
          </div>}

      <img
        src="https://uploads-ssl.webflow.com/646064abf2ae787ad9c35019/64f5b1e6b0587817f80e105b_ChatBSV_logo.svg"
        alt="ChatBSV"
        style={{ height: '44px', marginTop: '5px' }}
      />
      <button className={styles.resetButton} onClick={resetChat}></button>
    </div>
  );
}

export default Header;