// src/hooks/ChatStorage.js

/**
 * Custom hook for managing chat storage.
 * @param {Object} currentThread - The current chat thread.
 * @returns {Object} - An object containing chat state and functions to update it.
 */

import { useState, useEffect, useCallback } from 'react';

export const useChatStorage = (currentThread) => {
    const [chat, setChat] = useState([]);

    useEffect(() => {
        if (currentThread) {
            const storedChat = localStorage.getItem(`thread_${currentThread.id}`);
            if (storedChat) {
                setChat(JSON.parse(storedChat));
            } else {
                setChat([]);
            }
        }
    }, [currentThread]);

    const addMessageToChat = useCallback((message) => {
        setChat(prevChat => {
            const updatedChat = [...prevChat, message];
            if (currentThread) {
                localStorage.setItem(`thread_${currentThread.id}`, JSON.stringify(updatedChat));
            }
            return updatedChat;
        });
    }, [currentThread]);

    return { chat, setChat, addMessageToChat };
};
