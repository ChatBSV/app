// components/ChatInput.js

import React, { useState, useRef, useEffect } from 'react';
import styles from './ChatInput.module.css';
import ButtonIcon from './ButtonIcon';

const handleTextareaChange = (e) => {
  const textarea = e.target;

  // Reset the height of the textarea
  textarea.style.height = 'auto';

  // Set the height to the scroll height
  // This will expand the textarea to fit its content up to the max-height set in the CSS
  textarea.style.height = `${textarea.scrollHeight}px`;
};


const ChatInput = ({ handleSubmit, sessionToken, redirectionUrl }) => {
  const [txid, setTxid] = useState('');
  const inputRef = useRef(null);
  const [paymentResult, setPaymentResult] = useState({status: 'none'});
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    if (sessionToken) {
      setIsConnected(true);
    } else {
      setIsConnected(false);
    }
  }, [sessionToken]);

  const buttonText = () => {
    if (paymentResult?.status === 'pending') return 'Sending...';
    if (!isConnected) return 'Connect';
    return 'Send';
  };

  const handleFormSubmit = async () => {
    const prompt = inputRef.current.value.trim();
    if (prompt !== '') {
      const storedTxid = localStorage.getItem('txid');
      const isDalle = prompt.toLowerCase().startsWith('/imagine');
      await handleSubmit(prompt, storedTxid, isDalle);
      inputRef.current.value = '';
    } else {
      console.log('Prompt is empty. No request sent.');
    }
  };

  const handleKeyDown = async (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      await pay();
    }
  };

  const pay = async () => {
    if (!isConnected) {
      window.location.href = redirectionUrl;
      return;}
      
    console.log('ChatInput: pay, sessionToken:', sessionToken);
    localStorage.removeItem('txid');

    const prompt = inputRef.current.value.trim();
    const isDalle = prompt.toLowerCase().startsWith('/imagine');
    const headers = {
      'Authorization': `Bearer ${sessionToken}`,
      'requestType': isDalle ? 'image' : 'text'
    };

    setPaymentResult({status: 'pending'});
    try {
      const response = await fetch('/api/pay', {
        method: "POST",
        headers: headers
      });
      const paymentResult = await response.json();
      if (paymentResult.status === 'sent') {
        const { transactionId } = paymentResult;
        localStorage.setItem('txid', transactionId);
        setTxid(transactionId);
        await handleFormSubmit();
      }
      if (paymentResult.status === 'error') {
        console.log('Error:', paymentResult.message);
        localStorage.removeItem('txid');
      }
      setPaymentResult(paymentResult);
    } catch (error) {
      console.log('An error occurred:', error);
      localStorage.removeItem('txid');
    }
  };

  return (
    <div className={styles.chatFooter}>
      <form onSubmit={handleFormSubmit} className={styles.inputForm}>
      <textarea
        onKeyDown={handleKeyDown}
        className={styles.inputField}
        placeholder="Enter your prompt or start with /imagine to generate an image."
        ref={inputRef}
        onChange={handleTextareaChange}
      ></textarea>
        <div className={styles.mbWrapper}>
          <ButtonIcon 
            icon="https://uploads-ssl.webflow.com/646064abf2ae787ad9c35019/64f5b1e66dcd597fb1af816d_648029610832005036e0f702_hc%201.svg" 
            text={buttonText()}
            onClick={paymentResult?.status === 'pending' ? null : pay}
          />
        </div>
      </form>
    </div>
  );
};

export default ChatInput;
