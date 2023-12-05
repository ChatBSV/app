// src/hooks/useChatService.js

/**
 * Custom hook for managing chat service.
 *
 * @param {Object} options - The options for the chat service.
 * @param {string[]} options.tokens - The tokens for authentication.
 * @param {string} options.redirectionUrl - The URL to redirect to.
 * @param {string} options.sessionToken - The session token.
 * @param {Object} options.user - The user object.
 * @returns {Object} - The chat service object.
 */

import { useState } from 'react';
import { useChatStorage } from './ChatStorage';
import handleHelpRequest from './HandleHelpRequest';
import handleSubmit from './HandleSubmit';
import useThreadManager from './ThreadManager';

export const useChatService = ({ tokens, redirectionUrl, sessionToken, user }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [txid, setTxid] = useState('');

    const { 
        threads, 
        createThread, 
        deleteThread, 
        deleteAllThreads, 
        selectThread, 
        currentThread, 
        saveThreadMessages, 
        saveThreadTitle 
    } = useThreadManager();

    const { chat, addMessageToChat } = useChatStorage(currentThread);

    const handleHelp = handleHelpRequest(addMessageToChat);
    const submit = handleSubmit(currentThread, addMessageToChat, setIsLoading, setIsError, setErrorMessage, setTxid, saveThreadMessages);

    return {
        isLoading,
        isError,
        errorMessage,
        chat,
        addMessageToChat,
        txid,
        handleSubmit: submit,
        handleHelpRequest: handleHelp,
        threads,
        createThread,
        deleteThread,
        deleteAllThreads,
        selectThread,
        currentThread,
        saveThreadMessages,
        saveThreadTitle
    };
};

export default useChatService;