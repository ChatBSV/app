//  src/components/ChatInput.js

import React, { useState, useRef, useEffect } from 'react';
import styles from './ChatInput.module.css';
import ButtonIcon from './ButtonIcon';
import { handleTextareaChange, onDisconnect } from '../utils/ChatInputUtils';
import helpContent from '../../content/help.html';
import getErrorMessage from '../lib/getErrorMessage';
import { nanoid } from 'nanoid';

const ChatInput = ({ handleSubmit, sessionToken, redirectionUrl, resetChat, addMessageToChat }) => {
    const [txid, setTxid] = useState('');
    const inputRef = useRef(null);
    const [paymentResult, setPaymentResult] = useState({ status: 'none' });
    const [isConnected, setIsConnected] = useState(true);
    const [pendingPrompt, setPendingPrompt] = useState(null);

    useEffect(() => {
        setIsConnected(!!sessionToken);

        const pendingPromptJSON = localStorage.getItem('pendingPrompt');
        const urlParams = new URLSearchParams(window.location.search);
        const reloadParam = urlParams.get('reload');

        if (pendingPromptJSON && (!reloadParam || reloadParam === 'false')) {
            const parsedPrompt = JSON.parse(pendingPromptJSON);
            if (parsedPrompt && parsedPrompt.content) {
                setPendingPrompt(parsedPrompt);
                localStorage.removeItem('pendingPrompt'); 
            }
        }
    }, [sessionToken]);

    useEffect(() => {
        if (pendingPrompt && isConnected) {
            inputRef.current.value = pendingPrompt.content;
            pay();
            setPendingPrompt(null);
        }
    }, [pendingPrompt, isConnected, sessionToken]);

    const handleKeyDown = (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            submitInput();
        }
    };

    const setModel = (modelCommand) => {
        const model = modelCommand.toLowerCase().includes('4') ? 'gpt-4' : 'gpt-3.5-turbo';
        localStorage.setItem('selectedModel', model);
        addMessageToChat({
            id: nanoid(),
            role: 'loading',
            content: `GPT model set to ${model}`,
            txid: '',
            model: model, 
        });
    };

    const setDalleModel = (modelCommand) => {
        const model = modelCommand.toLowerCase().includes('2') ? 'dall-e-2' : 'dall-e-3';
        localStorage.setItem('selectedDalleModel', model);
        addMessageToChat({
            id: nanoid(),
            role: 'loading',
            content: `DALL-E model set to ${model}`,
            txid: '',
            model: model,
        });
    };

    const onDisconnectedSubmit = (inputValue) => {
        const requestType = inputValue.toLowerCase().startsWith('/imagine') ? 'image' : 
                            inputValue.toLowerCase().startsWith('/meme') ? 'meme' : 'text';
        const pendingPrompt = JSON.stringify({ type: requestType, content: inputValue });
        localStorage.setItem('pendingPrompt', pendingPrompt);
        window.location.href = redirectionUrl;
    };

    const buttonText = () => {
        if (paymentResult?.status === 'pending') return 'Sending...';
        return isConnected ? 'Send' : 'Connect';
    };

    const submitInput = () => {
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
            pay();
        }
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        submitInput();
    };

    const pay = async () => {
        const prompt = inputRef.current.value.trim();

        if (!isConnected) {
            window.location.href = redirectionUrl;
            return;
        }

        if (prompt.toLowerCase().startsWith('/help')) {
            handleHelpRequest(prompt);
            return;
        }

        const requestType = getRequestType(prompt);

        setPaymentResult({ status: 'pending' });
        try {
            const paymentResult = await sendPaymentRequest(prompt, requestType);
            processPaymentResult(paymentResult, prompt, requestType);
        } catch (error) {
            processPaymentError(error);
        }
    };

    const getRequestType = (prompt) => {
        if (prompt.toLowerCase().startsWith('/imagine')) return 'image';
        if (prompt.toLowerCase().startsWith('/meme')) return 'meme';
        return 'text';
    };

    const sendPaymentRequest = async (prompt, requestType) => {
        const headers = getPaymentRequestHeaders(requestType);

        const response = await fetch('/api/pay', { method: "POST", headers });
        if (!response.ok) {
            const errorResult = await response.json();
            handlePaymentError(response.status, errorResult, prompt);
        }

        return await response.json();
    };

    const getPaymentRequestHeaders = (requestType) => {
        const selectedModel = requestType === 'image' ? localStorage.getItem('selectedDalleModel') || 'dall-e-3' :
                              requestType === 'meme' ? 'meme' : 
                              localStorage.getItem('selectedModel') || 'gpt-3.5-turbo';

        return {
            'Authorization': `Bearer ${sessionToken}`,
            'Content-Type': 'application/json',
            'requesttype': requestType,
            'model': selectedModel
        };
    };

    const handlePaymentError = (status, errorResult, prompt) => {
        if (status === 401) {
            const pendingPrompt = JSON.stringify({ type: getRequestType(prompt), content: prompt });
            localStorage.setItem('pendingPrompt', pendingPrompt);
            window.location.href = redirectionUrl;
        } else {
            const friendlyErrorMessage = getErrorMessage(new Error(errorResult.error));
            setPaymentResult({ status: 'error', message: friendlyErrorMessage });
            addErrorMessageToChat(friendlyErrorMessage);
        }
    };

    const processPaymentResult = (paymentResult, prompt, requestType) => {
        if (paymentResult.status === 'sent') {
            localStorage.setItem('txid', paymentResult.transactionId);
            setTxid(paymentResult.transactionId);
            processSuccessfulPayment(prompt, paymentResult.transactionId, requestType);
        } else {
            setPaymentResult(paymentResult);
        }
    };

    const processSuccessfulPayment = async (prompt, transactionId, requestType) => {
        await handleSubmit(prompt, transactionId, requestType);
        inputRef.current.value = '';
        setPaymentResult({ status: 'none' });
    };

    const processPaymentError = (error) => {
        const errorMessage = getErrorMessage(error);
        setPaymentResult({ status: 'error', message: errorMessage });
        addErrorMessageToChat(errorMessage);
    };
    
    const addErrorMessageToChat = (message) => {
        addMessageToChat({
            id: nanoid(),
            role: 'error',
            content: message,
            txid: '',
        });
    };

    const handleHelpRequest = (helpCommand) => {
        addMessageToChat({
            id: nanoid(),
            role: 'user',
            content: helpCommand,
            txid: '',
        });

        addMessageToChat({
            id: nanoid(),
            role: 'help',
            content: helpContent,
            txid: '',
        });
        
    };

    return (
        <div className={styles.chatFooter}>
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
                    onDisconnect();}}></button>}
                <ButtonIcon
                    icon="https://uploads-ssl.webflow.com/646064abf2ae787ad9c35019/64f5b1e66dcd597fb1af816d_648029610832005036e0f702_hc%201.svg"
                    text={buttonText()}
                    onClick={paymentResult?.status === 'pending' ? null : submitInput}
                />
                <button
                    className={`${styles.actionButton} ${styles.resetButtonMobile}`}
                    onClick={(event) => {
                    event.preventDefault(); 
                    resetChat();}}></button>
                </div>
            </form>
        </div>
    );
};

export default ChatInput;
