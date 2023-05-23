// /Components/ChatInput.js

import React, { useState, useEffect, useRef } from 'react';
import styles from './ChatInput.module.css';

const ChatInput = ({ handleSubmit }) => {
  const [input, setInput] = useState('');
  const [moneyButtonLoaded, setMoneyButtonLoaded] = useState(false);
  const moneyButtonRef = useRef(null);

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

  const handleFormSubmit = (event) => {
    event.preventDefault();
    const prompt = input.trim();

    if (prompt !== '') {
      handleSubmit(prompt);
      setInput('');
    }
  };

  const handleInputChange = (event) => setInput(event.target.value);

  const handleMoneyButtonPayment = async (payment) => {
    const { txid } = payment;
    console.log('Transaction ID:', txid);

    const prompt = input.trim(); // Get the user input from the state
    if (prompt !== '') {
      try {
        const response = await fetch('/.netlify/functions/getChatReply', {
          method: 'POST',
          body: JSON.stringify({ prompt, lastUserMessage: null }),
        });

        if (response.ok) {
          const data = await response.json();
          const assistantResponse = data.message;
          console.log('Assistant Response:', assistantResponse);
          // Handle the assistant response as needed
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

  useEffect(() => {
    if (moneyButtonLoaded && moneyButtonRef.current) {
      const moneyButton = window.moneyButton.render(moneyButtonRef.current, {
        to: '3332',
        amount: '0.0099',
        currency: 'USD',
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
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className={styles.inputField}
          placeholder="Enter your prompt..."
        />
        <div ref={moneyButtonRef} className={styles.moneyButton}></div>
      </form>
    </div>
  );
};

export default ChatInput;
