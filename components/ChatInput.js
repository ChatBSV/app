// components/ChatInput.js

import React, { useState, useEffect } from 'react';
import styles from './ChatInput.module.css';
import axios from 'axios';

const ChatInput = ({ handleSubmit }) => {
  const [input, setInput] = useState('');

  const fetchTxid = async () => {
    try {
      const response = await axios.get('https://api.moneybutton.com/v2/auth/bsvalias/resolve', {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

      return response.data.txid;
    } catch (error) {
      console.error('Error fetching txid:', error);
      return null;
    }
  };

  useEffect(() => {
    const moneyButtonScript = document.createElement('script');
    moneyButtonScript.src = 'https://www.moneybutton.com/moneybutton.js';
    moneyButtonScript.async = true;
    document.body.appendChild(moneyButtonScript);

    window.moneyButtonRender = async () => {
      const prompt = input.trim();
      if (prompt !== '') {
        setInput('');
        handleSubmit(prompt);
      }
    };

    window.moneyButtonOnPayment = async (payment) => {
      const txid = await fetchTxid();
      setInput(payment.buttonData);
      handleSubmit(payment.buttonData, txid);
    };

    // Render MoneyButton on load
    const div = document.createElement('div');
    div.id = 'money-button';
    document.getElementById('button-container').appendChild(div);

    const moneyButtonOptions = {
      to: '3332',
      amount: '0.0099',
      currency: 'USD',
      onPayment: 'moneyButtonOnPayment', // Call the onPayment callback function
    };

    window.moneyButton.render(div, moneyButtonOptions);
  }, [handleSubmit, input]);

  return (
    <div className={styles.chatFooter}>
      <form className={styles.inputForm}>
        <input
          type="text"
          value={input}
          readOnly
          className={styles.inputField}
          placeholder="Enter your prompt"
        />
        <div id="button-container"></div>
      </form>
    </div>
  );
};

export default ChatInput;
