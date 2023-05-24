// /Components/ChatInput.js

import React, { useState, useEffect, useRef } from 'react';
import styles from './ChatInput.module.css';

const ChatInput = ({ handleSubmit }) => {
  const [moneyButtonLoaded, setMoneyButtonLoaded] = useState(false);
  const [txid, setTxid] = useState('');
  const [totalTokens, setTotalTokens] = useState('');
  const moneyButtonContainerRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const moneyButtonScript = document.createElement('script');
    moneyButtonScript.src = 'https://www.moneybutton.com/moneybutton.js';
    moneyButtonScript.async = true;
    moneyButtonScript.onload = () => setMoneyButtonLoaded(true);
    document.body.appendChild(moneyButtonScript);

    return () => {
      document.body.removeChild(moneyButtonScript);
    };
  }, []);

  const handleFormSubmit = async () => {
    const prompt = inputRef.current.value.trim();
    if (prompt !== '') {
      try {
        const response = await fetch('/.netlify/functions/getChatReply', {
          method: 'POST',
          body: JSON.stringify({ prompt, lastUserMessage: null, txid }),
        });

        if (response.ok) {
          const data = await response.json();
          const assistantResponse = data.message;
          const { txid, totalTokens } = data;
          setTxid(txid);
          setTotalTokens(totalTokens);
          console.log('Assistant Response:', assistantResponse);
          handleSubmit(prompt);
        } else {
          console.error('Error:', response.status);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    } else {
      console.log('Prompt is empty. No request sent.');
    }
  };

  const handleMoneyButtonPayment = (payment) => {
    const { txid } = payment;
    console.log('Transaction ID:', txid);
    setTxid(txid);
    handleFormSubmit();
  };

  useEffect(() => {
    if (moneyButtonLoaded && moneyButtonContainerRef.current) {
      const moneyButtonContainer = moneyButtonContainerRef.current;
      moneyButtonContainer.innerHTML = '';

      const moneyButton = window.moneyButton.render(moneyButtonContainer, {
        to: '3332',
        amount: '0.0099',
        currency: 'USD',
        data: { input: inputRef.current.value },
        onPayment: handleMoneyButtonPayment,
      });
    }
  }, [moneyButtonLoaded]);

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
    }
  };

  return (
    <div className={styles.chatFooter}>
      <form onSubmit={handleFormSubmit} className={styles.inputForm}>
        <input
          type="text"
          onKeyDown={handleKeyDown}
          className={styles.inputField}
          placeholder="Enter your prompt..."
          ref={inputRef}
        />
        <div ref={moneyButtonContainerRef} className={styles.moneyButton}></div>
      </form>
      {txid && (
        <div>
          <a
            href={`https://whatsonchain.com/tx/${txid}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="https://uploads-ssl.webflow.com/646064abf2ae787ad9c35019/646073c8892d47d06848b9c2_share.svg"
              alt="Transaction Link"
            />
          </a>
          <span style={{ fontSize: '14px', color: 'gray' }}>{txid}</span>
          {totalTokens && <span style={{ fontSize: '14px', color: 'gray' }}>{totalTokens} Tokens</span>}
        </div>
      )}
    </div>
  );
};

export default ChatInput;

