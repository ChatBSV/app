// src/components/ChatBody.js

import React, { useState, useEffect } from 'react';
import styles from './ChatBody.module.css';
import ChatMessage from './ChatMessage';
import useScrollToBottom from '../../hooks/useScrollToBottom';
import loadingMessages from '../../../content/loadingMessages.json';
import introMessage1 from '../../../content/intro-Message1.html';
import helpContent from '../../../content/help.html';
import { nanoid } from 'nanoid';

function ChatBody({ user, chat, isLoading, isError, errorMessage, currentThreadId }) {
    const [randomLoadingMessage, setRandomLoadingMessage] = useState('');
    const chatContainerRef = useScrollToBottom([chat]);

    const introKey1 = React.useMemo(() => `${currentThreadId || 'global'}-${nanoid()}`, [currentThreadId]);
    const loadingKey = React.useMemo(() => `${currentThreadId || 'global'}-${nanoid()}`, [currentThreadId]);
    const errorKey = React.useMemo(() => `${currentThreadId || 'global'}-${nanoid()}`, [currentThreadId]);

    useEffect(() => {
        if (isLoading) {
          setRandomLoadingMessage(loadingMessages[Math.floor(Math.random() * loadingMessages.length)]);
        }
      }, [isLoading]);

    const renderMessage = (message) => {
        let avatarUrl = '/icon-192x192.png'; // System avatar for system messages
        if (message.role === 'user' && user) {
            avatarUrl = user.avatarUrl; // User's avatar for user messages
        }

        if (message.role === 'help') {
            return (
                <ChatMessage
                    key={message.id}
                    content={helpContent}
                    role="help"
                    dangerouslySetInnerHTML={{ __html: helpContent }}
                    avatarUrl={avatarUrl}
                />
            );
        } else {
            return (
                <ChatMessage
                    key={message.id}
                    content={message.content}
                    role={message.role}
                    tokens={message.role === 'assistant' ? message.tokens : 0}
                    txid={message.txid}
                    onImageLoad={() => chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight}
                    avatarUrl={avatarUrl}
                    user={user}
                    timestamp={message.timestamp}
                />
            );
        }
    };


    return (
        <div className={styles.chatBody} ref={chatContainerRef}>
            <div className={styles.chatContainer}>
                        <ChatMessage key={introKey1} content={introMessage1} role="intro" avatarUrl="/icon-192x192.png" />

                {chat.map(renderMessage)}

                {isLoading && <ChatMessage key={loadingKey} content={randomLoadingMessage} role="loading" avatarUrl="/icon-192x192.png" />}


                {isError && errorMessage && (
                    <ChatMessage
                        key={errorKey}
                        content={errorMessage}
                        role="error"
                        avatarUrl="/icon-192x192.png"
                    />
                )}

                <div className={styles.spacer}></div>
            </div>
        </div>
    );
}

export default ChatBody;
