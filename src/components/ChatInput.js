// components/ChatInput.js

import React, { useState, useRef, useEffect } from 'react';
import styles from './ChatInput.module.css';
import ButtonIcon from './ButtonIcon';
import { handleTextareaChange, onDisconnect } from '../utils/ChatInputUtils';
import { handleFormSubmit, pay } from '../utils/ChatInputHandlers';
import helpContent from '../../content/help.html';
import { nanoid } from 'nanoid';

const ChatInput = ({ handleSubmit, sessionToken, redirectionUrl, resetChat, addMessageToChat }) => {
    const [txid, setTxid] = useState('');
    const inputRef = useRef(null);
    const [paymentResult, setPaymentResult] = useState({ status: 'none' });
    const [isConnected, setIsConnected] = useState(true);

    const setModel = (modelCommand) => {
        const model = modelCommand.toLowerCase().includes('4') ? 'gpt-4' : 'gpt-3.5-turbo';
        localStorage.setItem('selectedModel', model);

        // Attach the selected model to the chat history object
        addMessageToChat({
            id: nanoid(),
            role: 'loading',
            content: `GPT model set to ${model}`,
            txid: '',
            model: model, // Attach the selected model here
        });
    };

    const setDalleModel = (modelCommand) => {
        const model = modelCommand.toLowerCase().includes('2') ? 'dall-e-2' : 'dall-e-3';
        localStorage.setItem('selectedDalleModel', model);

        // Attach the selected model to the chat history object
        addMessageToChat({
            id: nanoid(),
            role: 'loading',
            content: `DALL-E model set to ${model}`,
            txid: '',
            model: model, // Attach the selected model here
        });
    };

    useEffect(() => {
        setIsConnected(!!sessionToken);

        const pendingPromptJSON = localStorage.getItem('pendingPrompt');
        const urlParams = new URLSearchParams(window.location.search);
        const reloadParam = urlParams.get('reload');

        if (pendingPromptJSON && (!reloadParam || reloadParam === 'false')) {
            const pendingPrompt = JSON.parse(pendingPromptJSON);
            if (pendingPrompt && pendingPrompt.content) {
                inputRef.current.value = pendingPrompt.content;
                pay(inputRef, isConnected, redirectionUrl, sessionToken, setPaymentResult, addMessageToChat, helpContent, setTxid, handleSubmit);
                localStorage.removeItem('pendingPrompt'); 
            }
        }
    }, [sessionToken, isConnected, redirectionUrl, setPaymentResult, addMessageToChat, helpContent, setTxid, handleSubmit]);

    const onDisconnectedSubmit = (inputValue) => {
        const requestType = inputValue.toLowerCase().startsWith('/imagine') ? 'image' : 
                            inputValue.toLowerCase().startsWith('/meme') ? 'meme' : 'text';
        const pendingPrompt = JSON.stringify({ type: requestType, content: inputValue });
        localStorage.setItem('pendingPrompt', pendingPrompt);
        window.location.href = redirectionUrl; // Redirect to HandCash for reauthorization
    };

    const buttonText = () => {
        if (paymentResult?.status === 'pending') return 'Sending...';
        return isConnected ? 'Send' : 'Connect';
    };

    return (
        <div className={styles.chatFooter}>
            <form onSubmit={(event) => handleFormSubmit(event, inputRef, handleSubmit, setPaymentResult)} className={styles.inputForm}>
                <textarea
                    onKeyDown={(event) => {
                        if (event.key === 'Enter' && !event.shiftKey) {
                            event.preventDefault();
                            const inputValue = inputRef.current.value;
                            if (inputValue.toLowerCase().startsWith('/gpt')) {
                                setModel(inputValue);
                                inputRef.current.value = '';
                                return;
                            }
                            if (inputValue.toLowerCase().startsWith('/dalle')) {
                                setDalleModel(inputValue);
                                inputRef.current.value = '';
                                return; 
                            }
                            if (!isConnected) {
                                onDisconnectedSubmit(inputValue);
                            } else {
                                pay(inputRef, isConnected, redirectionUrl, sessionToken, setPaymentResult, addMessageToChat, helpContent, setTxid, handleSubmit);
                            }
                        }
                    }}
                    className={styles.inputField}
                    placeholder="Enter your prompt or /imagine or /meme"
                    ref={inputRef}
                    onChange={handleTextareaChange}
                ></textarea>
                <div className={styles.mbWrapper}>
                    {isConnected && <button className={`${styles.actionButton} ${styles.logoutButtonMobile}`} onClick={onDisconnect}></button>}
                    <ButtonIcon
                        icon="https://uploads-ssl.webflow.com/646064abf2ae787ad9c35019/64f5b1e66dcd597fb1af816d_648029610832005036e0f702_hc%201.svg"
                        text={buttonText()}
                        onClick={paymentResult?.status === 'pending' ? null : () => pay(inputRef, isConnected, redirectionUrl, sessionToken, setPaymentResult, addMessageToChat, helpContent, setTxid, handleSubmit)}
                    />
                    <button className={`${styles.actionButton} ${styles.resetButtonMobile}`} onClick={resetChat}></button>
                </div>
            </form>
        </div>
    );
};

export default ChatInput;
