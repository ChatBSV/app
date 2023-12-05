// components/ChatInputForm.js

/**
 * Represents a chat input form component.
 * @param {Object} props - The component props.
 * @param {boolean} props.isConnected - Indicates if the user is connected.
 * @param {React.Ref} props.inputRef - The reference to the input element.
 * @param {string} props.buttonText - The text to display on the button.
 * @param {function} props.handleKeyDown - The event handler for keydown event on the textarea.
 * @param {function} props.handleFormSubmit - The event handler for form submission.
 * @param {function} props.handleButtonClick - The event handler for button click.
 * @param {Object} props.user - The user object.
 * @param {string} props.currentThreadId - The ID of the current thread.
 * @returns {JSX.Element} The chat input form component.
 */

import React from 'react';
import styles from './ChatInput.module.css';
import ButtonIcon from './ButtonIcon';
import { handleTextareaChange, onDisconnect } from '../utils/ChatInputUtils';
import { useThreadManager } from '../hooks/ThreadManager'; // Import useThreadManager directly

const ChatInputForm = ({ isConnected, inputRef, buttonText, handleKeyDown, handleFormSubmit, handleButtonClick, user, currentThreadId }) => {
    const { clearThreadMessages } = useThreadManager(); // Use clearThreadMessages directly from the hook
    const handleReset = (event) => {
      event.preventDefault(); // Prevent default form submission behavior
      console.log('Resetting thread with ID:', currentThreadId); // Debugging
      clearThreadMessages(currentThreadId);
  };
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
                {isConnected && (
                    <>
                        <ButtonIcon
                            icon={user ? user.avatarUrl : ""} 
                            text={buttonText}
                            onClick={handleButtonClick}
                        />
                    </>
                )}
                {!isConnected && (
                    <>
                        <ButtonIcon
                            icon="https://uploads-ssl.webflow.com/646064abf2ae787ad9c35019/64f5b1e66dcd597fb1af816d_648029610832005036e0f702_hc%201.svg"
                            text={buttonText}
                            onClick={handleButtonClick}
                        />
                    </>
                )}
            </div>
        </form>
    );
};

export default ChatInputForm;
