// src/hooks/ThreadManager.js

/**
 * Custom hook for managing threads in a chat application.
 * @returns {Object} An object containing functions and state variables for managing threads.
 * @property {Array} threads - An array of threads.
 * @property {Function} createThread - A function to create a new thread.
 * @property {Function} deleteThread - A function to delete a thread.
 * @property {Function} deleteAllThreads - A function to delete all threads.
 * @property {Function} selectThread - A function to select a thread.
 * @property {Object} currentThread - The currently selected thread.
 * @property {Function} saveThreadMessages - A function to save messages for a thread.
 * @property {Function} saveThreadTitle - A function to save the title of a thread.
 * @property {Function} updateCurrentThreadMessages - A function to update the messages of the current thread.
 */

import { useState, useEffect } from 'react';

export const useThreadManager = () => {
    const [threads, setThreads] = useState([]);
    const [currentThread, setCurrentThread] = useState(null);

    useEffect(() => {
        let storedThreads = JSON.parse(localStorage.getItem('threads')) || [];
        const storedCurrentThreadId = localStorage.getItem('currentThreadId');

        if (storedThreads.length === 0) {
            console.log('Creating initial thread...');
            const initialThread = { id: Date.now().toString(), title: "💬 Thread 1", messages: [] };
            storedThreads = [initialThread];
            localStorage.setItem('threads', JSON.stringify(storedThreads));
        }

        setThreads(storedThreads);
        const activeThread = storedThreads.find(thread => thread.id === storedCurrentThreadId) || storedThreads[0];
        setCurrentThread(activeThread);
    }, []);

    const saveThreadMessages = (threadId, messages) => {
        const updatedThreads = threads.map(thread => {
            if (thread.id === threadId) {
                return { ...thread, messages: messages };
            }
            return thread;
        });
        setThreads(updatedThreads);
        localStorage.setItem('threads', JSON.stringify(updatedThreads));
    };

    const saveThreadTitle = (threadId, newTitle) => {
        const updatedThreads = threads.map(thread => {
            if (thread.id === threadId) {
                return { ...thread, title: newTitle };
            }
            return thread;
        });
        setThreads(updatedThreads);
        localStorage.setItem('threads', JSON.stringify(updatedThreads));
    };

    const deleteThread = (threadId) => {
        const updatedThreads = threads.filter(thread => thread.id !== threadId);
        setThreads(updatedThreads);
        localStorage.removeItem(`thread_${threadId}`);
        if (updatedThreads.length === 0) {
            const newThread = { id: Date.now().toString(), title: "💬 Thread 1", messages: [] };
            setThreads([newThread]);
            setCurrentThread(newThread);
            localStorage.setItem('threads', JSON.stringify([newThread]));
        } else {
            setCurrentThread(updatedThreads[0]);
        }
    };

    const createThread = (title) => {
        const newThread = { id: Date.now().toString(), title: title || `💬 Thread ${threads.length + 1}`, messages: [] };
        const updatedThreads = [...threads, newThread];
        setThreads(updatedThreads);
        setCurrentThread(newThread);
        localStorage.setItem('threads', JSON.stringify(updatedThreads));
    };

    const deleteAllThreads = () => {
        threads.forEach(thread => localStorage.removeItem(`thread_${thread.id}`));
        const newThread = { id: Date.now().toString(), title: "💬 Thread 1", messages: [] };
        setThreads([newThread]);
        setCurrentThread(newThread);
        localStorage.setItem('threads', JSON.stringify([newThread]));
    };

    const selectThread = (threadId) => {
        const thread = threads.find(t => t.id === threadId);
        if (thread) {
            setCurrentThread(thread);
            localStorage.setItem('currentThreadId', thread.id); 
        }
    };
    const updateCurrentThreadMessages = (threadId, newMessages) => {
        saveThreadMessages(threadId, newMessages);
        const updatedThread = threads.find(thread => thread.id === threadId);
        if (updatedThread) {
            setCurrentThread(updatedThread);
        }
    };
    return { 
        threads, 
        createThread, 
        deleteThread, 
        deleteAllThreads, 
        selectThread, 
        currentThread, 
        saveThreadMessages, 
        saveThreadTitle,
        updateCurrentThreadMessages // Add this new function to the returned object
    };
};

export default useThreadManager;