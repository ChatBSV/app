// index.js

/**
 * Represents the Index Page component.
 * 
 * @param {Object} props - The component props.
 * @param {Array} props.tokens - The tokens.
 * @param {string} props.redirectionUrl - The redirection URL.
 * @param {string} props.sessionToken - The session token.
 * @param {Object} props.user - The user object.
 * @returns {JSX.Element} The rendered Index Page component.
 */

import React, { useEffect } from 'react';
import ChatBody from '../src/components/ChatBody';
import ChatInput from '../src/components/ChatInput';
import ChatSidebar from '../src/components/ChatSidebar';
import Header from '../src/components/Header';
import { getSessionProps } from '../src/utils/sessionUtils';
import MetaHead from '../src/components/MetaHead';
import { useChatService } from '../src/hooks/useChatService';
import './global.css';

export const getServerSideProps = getSessionProps;

function IndexPage({ tokens, redirectionUrl, sessionToken, user }) {
  const {
    isLoading,
    chat,
    addMessageToChat,
    handleSubmit,
    threads,
    createThread,
    deleteThread,
    saveThreadTitle,
    deleteAllThreads,
    selectThread,
    currentThread
  } = useChatService({ tokens, redirectionUrl, sessionToken, user });

  useEffect(() => {
    if (window.location.search.includes('reload=true')) {
      window.location.href = '/';
    }

    // Retrieve the current thread ID from localStorage and select it
    const storedCurrentThreadId = localStorage.getItem('currentThreadId');
    if (storedCurrentThreadId) {
      selectThread(storedCurrentThreadId);
    }
  }, [selectThread]);

  const handleCreateNewThread = () => {
    const newThreadTitle = `💬 Thread ${threads.length +1}`;
    createThread(newThreadTitle);
  };

  return (
    <div className="viewport">
      <MetaHead />
      <ChatSidebar 
        threads={threads}
        onSelectThread={selectThread}
        onCreateThread={handleCreateNewThread}
        onDeleteThread={deleteThread}
        onDeleteAllThreads={deleteAllThreads}
        saveThreadTitle={saveThreadTitle}
        currentThreadId={currentThread ? currentThread.id : null}
        isConnected={!!sessionToken}
      />
      <div className="main-content">
        <Header />

        <ChatBody chat={chat} isLoading={isLoading} user={user} threadId={currentThread ? currentThread.id : 'global'} />
        <ChatInput 
          handleSubmit={handleSubmit}
          sessionToken={sessionToken}
          redirectionUrl={redirectionUrl}
          addMessageToChat={addMessageToChat}
          user={user}
          threads={threads}
          currentThreadId={currentThread ? currentThread.id : null}
          selectThread={selectThread}
          createThread={createThread} 
        />
      </div>
    </div>
  );
}

export default IndexPage;
