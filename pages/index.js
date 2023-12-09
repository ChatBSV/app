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
      <Header resetChat={resetChat} redirectionUrl={redirectionUrl} sessionToken={sessionToken} user={user} />
      <ChatBody chat={chat} isLoading={isLoading} />
      <ChatInput 
        resetChat={resetChat} 
        handleSubmit={handleSubmit} // Passing handleSubmit to ChatInput
        sessionToken={sessionToken} 
        redirectionUrl={redirectionUrl} 
        addMessageToChat={addMessageToChat}
      />
    </div>
  );
}

export default IndexPage;
