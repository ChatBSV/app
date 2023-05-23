import React, { useState } from 'react';
import styles from './ChatInput.module.css';

const ChatInput = ({ handleSubmit }) => {
  const [input, setInput] = useState('');

  const handleFormSubmit = (event) => {
    event.preventDefault();
    const prompt = input.trim();

    if (prompt !== '') {
      handleSubmit(prompt);
      setInput('');
    }
  };

  const handleInputChange = (event) => setInput(event.target.value);

  const handlePayment = async (payment) => {
    const prompt = input.trim();
    if (prompt !== '') {
      handleSubmit(prompt);
      setInput('');
    }
  };

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
        <div id="money-button-container"></div>
        <button type="submit" className={styles.submit}></button>
      </form>

      <script
        src="https://www.moneybutton.com/moneybutton.js"
        async
        onLoad={() => {
          const moneyButtonContainer = document.getElementById('money-button-container');
          window.moneyButton.render(moneyButtonContainer, {
            to: '3332',
            amount: '0.01',
            currency: 'USD',
            label: '',
            clientIdentifier: 'ac20c624759297bcdd5b0db272d839d9',
            buttonId: '1684033604257',
            buttonData: '{}',
            type: 'tip',
            onPayment: handlePayment
          });
        }}
      ></script>
    </div>
  );
};

export default ChatInput;
