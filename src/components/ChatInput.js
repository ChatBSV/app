// components/ChatInput.js

import React, { useState, useRef, useEffect } from 'react';
import styles from './ChatInput.module.css';
import ButtonIcon from './ButtonIcon';
import { handleTextareaChange, onDisconnect } from '../utils/ChatInputUtils';
import { handleFormSubmit, pay } from '../utils/ChatInputHandlers';
import helpContent from '../../help.html';

const ChatInput = ({ handleSubmit, sessionToken, redirectionUrl, resetChat, addMessageToChat }) => {
  const [txid, setTxid] = useState('');
  const inputRef = useRef(null);
  const [paymentResult, setPaymentResult] = useState({ status: 'none' });
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    setIsConnected(!!sessionToken);
  
    const pendingPromptJSON = localStorage.getItem('pendingPrompt');
    const urlParams = new URLSearchParams(window.location.search);
    const reloadParam = urlParams.get('reload');
  
    if (pendingPromptJSON && reloadParam !== 'true') {
      const pendingPrompt = JSON.parse(pendingPromptJSON);
      if (pendingPrompt && pendingPrompt.content) {
        inputRef.current.value = pendingPrompt.content;
  
        pay(inputRef, isConnected, redirectionUrl, sessionToken, setPaymentResult, addMessageToChat, helpContent, setTxid, handleSubmit);
  
        localStorage.removeItem('pendingPrompt'); 
      }
    }
  }, [sessionToken, isConnected, redirectionUrl, setPaymentResult, addMessageToChat, helpContent, setTxid, handleSubmit]);
  

  const onDisconnectedSubmit = (inputValue) => {
    const requestType = inputValue.toLowerCase().startsWith('/imagine') ? 'image' : 'text';
    const pendingPrompt = JSON.stringify({ type: requestType, content: inputValue });
    localStorage.setItem('pendingPrompt', pendingPrompt);
    window.location.href = `${redirectionUrl}`; 
  };

  const buttonText = () => {
    if (paymentResult?.status === 'pending') return 'Sending...';
    return isConnected ? 'Send' : 'Connect';
  };

  return (
    <div className={styles.chatFooter}>
      <form onSubmit={(event) => handleFormSubmit(event, inputRef, handleSubmit, setPaymentResult)} className={styles.inputForm}>
        <textarea
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
              event.preventDefault();
              const inputValue = inputRef.current.value;
              if (!isConnected) {
                onDisconnectedSubmit(inputValue);
              } else {
                pay(inputRef, isConnected, redirectionUrl, sessionToken, setPaymentResult, addMessageToChat, helpContent, setTxid, handleSubmit);
              }
            }
          }}
          className={styles.inputField}
          placeholder="Enter your prompt or /imagine"
          ref={inputRef}
          onChange={handleTextareaChange}
        ></textarea>
        <div className={styles.mbWrapper}>
          {isConnected && <button className={`${styles.actionButton} ${styles.logoutButtonMobile}`} onClick={onDisconnect}></button>}
          <ButtonIcon
            icon="https://uploads-ssl.webflow.com/646064abf2ae787ad9c35019/64f5b1e66dcd597fb1af816d_648029610832005036e0f702_hc%201.svg"
            text={buttonText()}
            onClick={paymentResult?.status === 'pending' ? null : () => pay(inputRef, isConnected, redirectionUrl, sessionToken, setPaymentResult, addMessageToChat, helpContent, setTxid, handleSubmit)}
          />
          <button className={`${styles.actionButton} ${styles.resetButtonMobile}`} onClick={resetChat}></button>
        </div>
      </form>
    </div>
  );
};

export default ChatInput;
