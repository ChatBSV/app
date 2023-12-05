// src/components/ChatSidebar.js

/**
 * Represents the Chat Sidebar component.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {boolean} props.isConnected - Indicates if the user is connected.
 * @param {Array} props.threads - The list of threads.
 * @param {Function} props.onSelectThread - The function to handle thread selection.
 * @param {Function} props.onCreateThread - The function to handle thread creation.
 * @param {Function} props.onDeleteThread - The function to handle thread deletion.
 * @param {Function} props.onDeleteAllThreads - The function to handle deletion of all threads.
 * @param {string} props.currentThreadId - The ID of the currently selected thread.
 * @returns {JSX.Element} The rendered Chat Sidebar component.
 */

import React, { useState } from 'react';

const ChatSidebar = ({ isConnected, threads, onSelectThread, onCreateThread, onDeleteThread, onDeleteAllThreads, currentThreadId }) => {
    const [editingThreadId, setEditingThreadId] = useState(null);
    const [editedTitle, setEditedTitle] = useState('');
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

    const handleCreateThread = () => {
        onCreateThread();
    };

    const handleDeleteAllThreads = () => {
        onDeleteAllThreads();
    };

    const handleSelectThread = (threadId) => {
        onSelectThread(threadId);
        setEditingThreadId(null);
    };

    const onDisconnect = async () => {
        await fetch('/api/logout', {
          method: 'POST',
        });
        window.location.href = "/";
    };

    const handleRenameThread = (threadId) => {
        if (editedTitle.trim() !== '') {
            threads.forEach((thread, index) => {
                if (thread.id === threadId) {
                    threads[index].title = editedTitle;
                }
            });
            localStorage.setItem('threads', JSON.stringify(threads));
            setEditingThreadId(null);
            setEditedTitle(''); // Clear the edited title after saving
        }
    };

    const toggleSidebar = () => {
        setIsSidebarExpanded(!isSidebarExpanded); // Toggle the sidebar state
    };

    return (
        <div className={`sidebar ${isSidebarExpanded ? 'expanded' : 'collapsed'}`}>
            <div className="sidebar-header">
            <button className={`toggle-button ${!isSidebarExpanded ? 'rotate-icon' : ''}`} onClick={toggleSidebar}>
                    ➜ {/* Icon will rotate based on the class */}
                </button>
            </div>
            <div className="menu-buttons">
                <button className="sidebar-thread" onClick={handleCreateThread}>✨ Start New Thread</button>
                {threads.map((thread) => (
                    <div key={thread.id} 
                        className="sidebar-thread"
                        style={{
                            backgroundColor: currentThreadId === thread.id ? '#ddd' : '',
                        }}>
                        {editingThreadId === thread.id ? (
                            <input className='input-editing-thread'
                                type="text"
                                value={editedTitle}
                                onChange={(e) => setEditedTitle(e.target.value)}
                                onBlur={() => handleRenameThread(thread.id)}
                                autoFocus
                            />
                        ) : (
                            <div className="clickable-span" onClick={() => handleSelectThread(thread.id)}>
                                {thread.title}
                            </div>
                        )}
                        <button className='thread-action'
                            onClick={() => {
                                setEditingThreadId(thread.id);
                                setEditedTitle(thread.title);
                            }}
                            style={{ marginLeft: 'auto', marginRight: '10px' }}
                        >
                            &#9998;
                        </button>
                        <button className='thread-action' onClick={() => onDeleteThread(thread.id)}>&#10006;</button>
                    </div>
                ))}
                <button className="sidebar-thread" onClick={handleDeleteAllThreads}>🗑️ Delete All Threads</button>
                
                {isConnected && (
                <button className="sidebar-thread" onClick={onDisconnect}>🏃‍♂️ Log Out</button>
                )}
            </div>
        </div>
    );
};

export default ChatSidebar;
