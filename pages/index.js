// pages/index.js

import React, { useEffect } from 'react';
import 'prismjs/themes/prism-okaidia.css';
import Colors from '../src/components/body/colors'; 
import ChatBody from '../src/components/body/ChatBody';
import ChatInput from '../src/components/footer/ChatInput';
import ChatSidebar from '../src/components/body/ChatSidebar';
import Header from '../src/components/header/Header';
import { getSessionProps } from '../src/utils/sessionUtils';
import MetaHead from '../src/components/header/MetaHead';
import { useChatService } from '../src/hooks/useChatService';
import resetChat from '../src/utils/resetChat';
import './global.css';
import BgSlider from '../src/components/body/bgslider';

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

    const storedCurrentThreadId = localStorage.getItem('currentThreadId');
    if (storedCurrentThreadId) {
      selectThread(storedCurrentThreadId);
    }
  }, [selectThread]);

  const handleCreateNewThread = () => {
    const newThreadTitle = `💬 Thread ${threads.length + 1}`;
    createThread(newThreadTitle);
  };

  return (
    <div className="viewport">
      <BgSlider />
      <Colors />
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
          resetChat={resetChat} 
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
