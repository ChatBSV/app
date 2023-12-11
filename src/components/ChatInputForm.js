// ChatInputForm.js
import React, { useRef } from 'react';
import styles from './ChatInput.module.css';
import { handleTextareaChange } from '../utils/ChatInputUtils';

import ButtonIcon from './ButtonIcon';

const ChatInputForm = ({ isConnected, onDisconnect, submitInput, buttonText, inputRef, handleKeyDown, resetChat, handleFormSubmit, paymentResult }) => {
    
    
    return (
        <form onSubmit={handleFormSubmit} className={styles.inputForm}>
            <textarea
                onKeyDown={handleKeyDown}
                className={styles.inputField}
                placeholder="Enter your prompt or /imagine or /meme"
                ref={inputRef}
                onChange={handleTextareaChange}
            ></textarea>
            <div className={styles.mbWrapper}>
                {isConnected && 
                    <button className={`${styles.actionButton} ${styles.logoutButtonMobile}`} onClick={(event) => {
                        event.preventDefault();
                        onDisconnect();
                    }}></button>}
                <ButtonIcon
                    icon="https://uploads-ssl.webflow.com/646064abf2ae787ad9c35019/64f5b1e66dcd597fb1af816d_648029610832005036e0f702_hc%201.svg"
                    text={buttonText()}
                    onClick={paymentResult?.status === 'pending' ? null : submitInput}
                />
                <button
                    className={`${styles.actionButton} ${styles.resetButtonMobile}`}
                    onClick={(event) => {
                        event.preventDefault();
                        resetChat();
                    }}></button>
            </div>
        </form>
    );
};

export default ChatInputForm;
