// src/components/ChatInput.js

import React, { useState, useRef, useEffect } from 'react';
import styles from './ChatInput.module.css';
import helpContent from '../../../content/help.html';
import ChatInputForm from './ChatInputForm'; 
import getErrorMessage from '../../lib/getErrorMessage';
import { nanoid } from 'nanoid';

const ChatInput = ({ handleSubmit, sessionToken, redirectionUrl, resetChat, addMessageToChat, user, threads, setCurrentThread }) => {
    const [txid, setTxid] = useState('');
    const inputRef = useRef(null);
    const [paymentResult, setPaymentResult] = useState({ status: 'none' });
    const [isConnected, setIsConnected] = useState(true);
    const [pendingPrompt, setPendingPrompt] = useState(null);
    const [currentThreadId, setCurrentThreadId] = useState(null);
    const [isEnterKeyEnabled, setIsEnterKeyEnabled] = useState(true); // Added state for Enter key control

    useEffect(() => {
        setIsConnected(!!sessionToken);

        const storedThreadId = localStorage.getItem('currentThreadId');
        if (storedThreadId) {
            setCurrentThreadId(storedThreadId);
        }

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

        // Load Enter key preference from local storage or set it to true by default
        const enterKeyEnabled = localStorage.getItem('enterKeyEnabled');
        if (enterKeyEnabled !== null) {
            setIsEnterKeyEnabled(enterKeyEnabled === 'true');
        }
    }, [sessionToken]);

    const handlePendingPrompt = async () => {
        if (pendingPrompt && isConnected) {
            const isAuthorizedAndBalanced = await checkAuthAndBalance();
            if (isAuthorizedAndBalanced) {
                processUserInput(pendingPrompt.content, pendingPrompt.type);
                setPendingPrompt(null);
            }
        }
    };

    useEffect(() => {
        handlePendingPrompt();
    }, [pendingPrompt, isConnected, sessionToken]);

    const handleKeyDown = (event) => {
        if (event.key === 'Enter' && !event.shiftKey && isEnterKeyEnabled) { // Check if Enter key is enabled
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

    const toggleEnterKey = (command) => {
        const isEnabled = command === 'on'; // true for 'on', false for 'off'
        setIsEnterKeyEnabled(isEnabled); // Update the state
    
        // Store the Enter key preference in local storage
        localStorage.setItem('enterKeyEnabled', isEnabled.toString());
    };
    

    const onDisconnectedSubmit = (inputValue) => {
        const requestType = inputValue.toLowerCase().startsWith('/imagine') ? 'image' : 
                            inputValue.toLowerCase().startsWith('/meme') ? 'meme' : 'text';
        const pendingPrompt = JSON.stringify({ type: requestType, content: inputValue, threadId: currentThreadId });
        localStorage.setItem('pendingPrompt', pendingPrompt);
        window.location.href = redirectionUrl;
    };

    const buttonText = () => {
        if (paymentResult?.status === 'pending') return 'Sending...';
        return isConnected ? 'Send' : 'Connect';
    };

    const submitInput = () => {
        const inputValue = inputRef.current.value.trim();
        if (inputValue.toLowerCase() === '/enter on') {
            toggleEnterKey('on');
            addMessageToChat({
                id: nanoid(),
                role: 'loading',
                content: 'Enter key is now enabled.',
                txid: '',
            });
            inputRef.current.value = '';
            return;
        }
        if (inputValue.toLowerCase() === '/enter off') {
            toggleEnterKey('off');
            addMessageToChat({
                id: nanoid(),
                role: 'loading',
                content: 'Enter key is now disabled.',
                txid: '',
            });
            inputRef.current.value = '';
            return;
        }
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
        if (inputValue.toLowerCase().startsWith('/help')) {
            handleHelpRequest(inputValue);
            inputRef.current.value = '';
            return;
        }
        if (!isConnected) {
            onDisconnectedSubmit(inputValue);
        } else {
            const requestType = getRequestType(inputValue);
            processUserInput(inputValue, requestType);
        }
    };
    
    const checkAuthAndBalance = async () => {
        const response = await fetch('/api/auth/handcash/auth-check', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${sessionToken}` }
        });
    
        if (!response.ok) {
            const errorData = await response.json();
            const error = new Error(errorData.error);
            addErrorMessageToChat(getErrorMessage(error));
            return false;
        }
        return true;
    };
    
    const processUserInput = async (inputValue, requestType) => {
        setPaymentResult({ status: 'pending' });
        try {
            const response = await handleSubmit(inputValue, requestType);
            inputRef.current.value = '';
            setPaymentResult({ status: 'none' });

            if (response && currentThreadId) {
                addMessageToChat({ ...response, id: nanoid() }, currentThreadId);
                const updatedThread = threads.find(thread => thread.id === currentThreadId);
                if (updatedThread) {
                    setCurrentThread({ ...updatedThread, messages: [...updatedThread.messages, response] });
                }
            }
        } catch (error) {
            if (error.status === 401 || (error.error && error.error.includes("401"))) {
                const pendingPrompt = JSON.stringify({ type: getRequestType(inputValue), content: inputValue, threadId: currentThreadId });
                localStorage.setItem('pendingPrompt', pendingPrompt);
                window.location.href = redirectionUrl;
            } else {
                const errorMessage = getErrorMessage(error) || "An unexpected network error occurred.";
                setPaymentResult({ status: 'error', message: errorMessage });
                addErrorMessageToChat(errorMessage);
            }
        }
    };
      
    const getRequestType = (prompt) => {
        if (prompt.toLowerCase().startsWith('/imagine')) return 'image';
        if (prompt.toLowerCase().startsWith('/meme')) return 'meme';
        return 'text';
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

    const iconUrl = isConnected && user && user.avatarUrl 
    ? user.avatarUrl 
    : "https://uploads-ssl.webflow.com/646064abf2ae787ad9c35019/64f5b1e66dcd597fb1af816d_648029610832005036e0f702_hc%201.svg"

    return (
        <div className={styles.chatFooter}>
            <ChatInputForm
                isConnected={isConnected}
                submitInput={submitInput}
                buttonText={buttonText()}
                inputRef={inputRef}
                handleKeyDown={handleKeyDown}
                resetChat={resetChat}
                iconUrl={iconUrl}
                threads={threads}
                currentThreadId={currentThreadId}
            />
        </div>
    );
};

export default ChatInput;
