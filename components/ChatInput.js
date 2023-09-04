// components/ChatInput.js

import React, { useState, useEffect, useRef } from 'react';
import styles from './ChatInput.module.css';
import ButtonIcon from './ButtonIcon';

const ChatInput = ({ handleSubmit, sessionToken, redirectionUrl }) => {
  // const [moneyButtonLoaded, setMoneyButtonLoaded] = useState(false);
  const [txid, setTxid] = useState('');
  // const moneyButtonContainerRef = useRef(null);
  const inputRef = useRef(null);

  // useEffect(() => {
  //   const moneyButtonScript = document.createElement('script');
  //   moneyButtonScript.src = 'https://www.moneybutton.com/moneybutton.js';
  //   moneyButtonScript.async = true;
  //   moneyButtonScript.onload = () => setMoneyButtonLoaded(true);
  //   document.body.appendChild(moneyButtonScript);

  //   return () => {
  //     document.body.removeChild(moneyButtonScript);
  //   };
  // }, []);

  const handleFormSubmit = async () => {
    const prompt = inputRef.current.value.trim();
    if (prompt !== '') {
      const storedTxid = localStorage.getItem('txid');
      handleSubmit(prompt, storedTxid);
      inputRef.current.value = '';
    } else {
      console.log('Prompt is empty. No request sent.');
    }
  };

  // const handleMoneyButtonPayment = (payment) => {
  //   const { txid } = payment;
  //   console.log('Transaction ID:', txid);
  //   localStorage.setItem('txid', txid);
  //   setTxid(txid);

  //   const prompt = inputRef.current.value.trim();
  //   if (prompt !== '') {
  //     handleFormSubmit();
  //   }
  // };

  // useEffect(() => {
  //   if (moneyButtonLoaded && moneyButtonContainerRef.current) {
  //     const moneyButtonContainer = moneyButtonContainerRef.current;
  //     moneyButtonContainer.innerHTML = '';

  //     const moneyButton = window.moneyButton.render(moneyButtonContainer, {
  //       to: '3332',
  //       amount: '0.0099',
  //       currency: 'USD',
  //       data: { input: inputRef.current.value },
  //       onPayment: handleMoneyButtonPayment,
  //       onCryptoOperations: async (event) => {
  //         const { type, id, cryptoOperations } = event;
  //         if (type === 'payment') {
  //           const payment = cryptoOperations.find((op) => op.id === id);
  //           if (payment) {
  //             const { txid } = payment;
  //             console.log('Transaction ID:', txid);
  //             localStorage.setItem('txid', txid);
  //             setTxid(txid);
  //             handleSubmit('', txid);
  //           }
  //         }
  //       },
  //     });

  //     return () => {
  //       moneyButton.unmount();
  //     };
  //   }
  // }, [moneyButtonLoaded]);

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
    }
  };

  const [paymentResult, setPaymentResult] = useState({status: 'none'});

  const pay = async () => {
    console.log('pay');
    if (!sessionToken) {
      console.log('No session token.');
      window.location.href = redirectionUrl;
      return
    }
    setPaymentResult({status: 'pending'});
    const response = await fetch(
        `/api/pay`,
        {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${sessionToken}`,
            },
        }
    );
    // fazer o handle do response aqui
    const paymentResult = await response.json();
    console.log('payResult', paymentResult)
    if (paymentResult.status === 'sent') {
      const { transactionId } = paymentResult;
      console.log('Transaction ID:', transactionId);
      localStorage.setItem('txid', transactionId);
      setTxid(transactionId);

      const prompt = inputRef.current.value.trim();
      if (prompt !== '') {
        handleFormSubmit();
      }
    }
    if (paymentResult.status === 'error') {
      console.log('Error:', paymentResult.message);
    }    
    setPaymentResult(paymentResult);
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
        <div className={styles.mbWrapper}>
          {/* <div ref={moneyButtonContainerRef} className={styles.moneyButton}></div> */}
          <ButtonIcon 
            icon="https://uploads-ssl.webflow.com/646064abf2ae787ad9c35019/64f5b1e66dcd597fb1af816d_648029610832005036e0f702_hc%201.svg" 
            text={paymentResult?.status === 'pending' ? 'Sending...' : 'Send'}             
            onClick={paymentResult?.status === 'pending' ? null : pay}
          />
          {/* <div
                className={"flex px-4 h-8 items-center rounded-full border bg-gradient-to-r from-brandNormal to-brandDark hover:opacity-90 text-sm font-semibold hover:cursor-pointer" + (paymentResult?.status === 'pending' ? 'animate-pulse' : '')}
                onClick={paymentResult?.status === 'pending' ? null : pay}>
                <p>{paymentResult?.status === 'pending' ? 'Running...' : 'Run this code'}</p>
            </div> */}
        </div>
      </form>
    </div>
  );
};

export default ChatInput;