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
    if (window.location.search.includes('reload=true')) {
      window.location.href = '/';
    }
  }, []);

  return (
    <div className="viewport">
      <MetaHead />
      <Header />
      <ChatBody chat={chat} isLoading={isLoading} user={user} />
      <ChatInput 
        resetChat={resetChat} 
        handleSubmit={handleSubmit}
        sessionToken={sessionToken} 
        redirectionUrl={redirectionUrl} 
        addMessageToChat={addMessageToChat}
        user={user}
      />
    </div>
  );
}

export default IndexPage;
