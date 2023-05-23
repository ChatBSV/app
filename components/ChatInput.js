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

    window.displayHiddenContent = async (payment) => {
      const prompt = input.trim();
      if (prompt !== '') {
        setInput('');
        handleSubmit(prompt, payment.txid);
      }
    };

    window.myCustomCallback = (error) => {
      console.log(`An error has occurred: ${error}`);
    };

    window.myCustomLoadCallback = () => {
      console.log(`The button has loaded.`);
    };
  }, [handleSubmit, input]);

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    const txid = await fetchTxid();

    const div = document.createElement('div');
    div.id = 'money-button';
    document.getElementById('button-container').appendChild(div);

    const moneyButtonOptions = {
      to: '3332',
      amount: '0.01',
      currency: 'USD',
      buttonData: JSON.stringify({ prompt: input.trim() }),
      onPayment: 'displayHiddenContent',
      onError: 'myCustomCallback',
      onLoad: 'myCustomLoadCallback'
    };

    window.moneyButton.render(div, moneyButtonOptions);
  };

  const handleInputChange = (event) => setInput(event.target.value);

  return (
    <div className={styles.chatFooter}>
      <form onSubmit={handleFormSubmit} className={styles.inputForm}>
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          className={styles.inputField}
          placeholder="Enter your prompt"
        />
        <div id="button-container"></div>
      </form>
    </div>
  );
};

export default ChatInput;
