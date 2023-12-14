// src/components/ChatInputForm.js

import React from 'react';
import styles from './ChatInput.module.css?v=099';
import { handleTextareaChange } from '../../utils/ChatInputUtils';
import ButtonIcon from './ButtonIcon';

const ChatInputForm = ({ isConnected, onDisconnect, submitInput, buttonText, inputRef, handleKeyDown, resetChat, iconUrl }) => {
    return (
        <form className={styles.inputForm}>
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
                    icon={iconUrl}
                    text={buttonText}
                    onClick={submitInput}
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

