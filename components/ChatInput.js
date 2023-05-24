// /Components/ChatInput.js

import React, { useState, useEffect, useRef } from 'react';
import styles from './ChatInput.module.css';

const ChatInput = ({ handleSubmit }) => {
  const [input, setInput] = useState('');
  const [moneyButtonLoaded, setMoneyButtonLoaded] = useState(false);
  const [txid, setTxid] = useState('');
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

  const handleInputChange = (event) => setInput(event.target.value);

  const handleFormSubmit = async () => {
    const prompt = input.trim(); // Get the user input from the state
    if (prompt !== '') {
      try {
        const response = await fetch('/.netlify/functions/getChatReply', {
          method: 'POST',
          body: JSON.stringify({ prompt, lastUserMessage: null, txid }), // Include txid in the request body
        });

        if (response.ok) {
          const data = await response.json();
          const assistantResponse = data.message;
          console.log('Assistant Response:', assistantResponse);
          handleSubmit(prompt); // Call the original handleSubmit function
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
    setTxid(txid); // Update the txid state
    handleFormSubmit(); // Call handleFormSubmit without the event object
    // Fetch additional data or perform any necessary actions
  };

  useEffect(() => {
    if (moneyButtonLoaded && moneyButtonRef.current) {
      const moneyButtonIframe = document.createElement('iframe');
      moneyButtonIframe.src = 'https://www.moneybutton.com/moneybutton.js';
      moneyButtonIframe.style.width = '180px';
      moneyButtonIframe.style.height = '50px';
      moneyButtonIframe.style.border = 'none';
      moneyButtonIframe.style.overflow = 'hidden';
      moneyButtonIframe.style.display = 'inline-block';
      moneyButtonIframe.frameBorder = '0';

      const moneyButtonContainer = moneyButtonRef.current;
      moneyButtonContainer.appendChild(moneyButtonIframe);

      // Receive payment response from the MoneyButton iframe
      window.addEventListener('message', (event) => {
        if (event.data.type === 'moneyButtonPayment') {
          handleMoneyButtonPayment(event.data.payment);
        }
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
          id="input" // Assign a unique ID to the input field
        />
        <div ref={moneyButtonRef} className={styles.moneyButton}></div>
      </form>
    </div>
  );
};

export default ChatInput;
