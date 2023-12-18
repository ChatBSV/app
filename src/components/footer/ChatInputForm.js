// src/components/ChatInputForm.js

import React from 'react';
import styles from './ChatInput.module.css';
import ButtonIcon from './ButtonIcon';
import { handleTextareaChange } from '../../utils/ChatInputUtils';

const ChatInputForm = ({inputRef, buttonText, handleKeyDown, handleFormSubmit, submitInput, iconUrl,}) => {
    
    return (
        <form onSubmit={handleFormSubmit} className={styles.inputForm}>
            <textarea
                onKeyDown={handleKeyDown}
                className={styles.inputField}
                placeholder="Enter your prompt or /imagine or /meme"
                ref={inputRef}
                onChange={handleTextareaChange}
            ></textarea>
            <div className={styles.sendButton}>
                        <ButtonIcon
                        icon={iconUrl}
                        text={buttonText}
                            onClick={submitInput}
                        />
            </div>
        </form>
    );
};

export default ChatInputForm;
