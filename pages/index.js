// pages/index.js

import React, { useEffect } from 'react';
import ChatBody from '../src/components/ChatBody';
import ChatInput from '../src/components/ChatInput';
import Header from '../src/components/Header';
import { getSessionProps } from '../src/utils/sessionUtils';
import MetaHead from '../src/components/MetaHead';
import { useChatService } from '../src/hooks/useChatService';
import resetChat from '../src/utils/resetChat';
import './global.css';

export const getServerSideProps = getSessionProps;

function IndexPage({ tokens, redirectionUrl, sessionToken, user }) {
  const {
    isLoading,
    chat,
    addMessageToChat,
    handleSubmit // Ensure this is the function from useChatService
  } = useChatService({ tokens, redirectionUrl, sessionToken, user });

  useEffect(() => {
    // Redirect if needed
    if (window.location.search.includes('reload=true')) {
      window.location.href = '/';
    }

    // Register the service worker on mount
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      navigator.serviceWorker.register('/service-worker.js')
        .then((registration) => {
          console.log('Service Worker registered with scope:', registration.scope);
        })
        .catch((err) => {
          console.error('Service Worker registration failed:', err);
        });
    }
  }, []);

  return (
    <div className="viewport">
      <MetaHead />
      <Header resetChat={resetChat} redirectionUrl={redirectionUrl} sessionToken={sessionToken} user={user} />
      <ChatBody chat={chat} isLoading={isLoading} />
      <ChatInput 
        resetChat={resetChat} 
        handleSubmit={handleSubmit}
        sessionToken={sessionToken} 
        redirectionUrl={redirectionUrl} 
        addMessageToChat={addMessageToChat}
      />
    </div>
  );
}

export default IndexPage;

