// pages/index.js

import React, { useEffect } from 'react';
import ChatBody from '../components/ChatBody';
import ChatInput from '../components/ChatInput';
import Header from '../components/Header';
import { getSessionProps } from '../src/utils/sessionUtils';
import MetaHead from '../components/MetaHead';
import { useChatService } from '../hooks/useChatService';
import resetChat from '../src/utils/resetChat';
import './global.css';

export const getServerSideProps = getSessionProps;

function IndexPage({ tokens, redirectionUrl, sessionToken, user }) {
  const {
    isLoading,
    chat,
    addMessageToChat,
    handleSubmit
  } = useChatService({ tokens, redirectionUrl, sessionToken, user });

  useEffect(() => {
    if (window.location.search.includes('reload=true')) {
      window.location.href = '/';
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
