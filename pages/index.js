// pages/index.js

import React, { useEffect, useState } from 'react';
import ChatBody from '../src/components/ChatBody';
import ChatInput from '../src/components/ChatInput';
import Header from '../src/components/Header';
import { getSessionProps } from '../src/utils/sessionUtils';
import MetaHead from '../src/components/MetaHead';
import { useChatService } from '../src/hooks/useChatService';
import resetChat from '../src/utils/resetChat';
import './global.css';

export const getServerSideProps = getSessionProps;

function IndexPage({ tokens, redirectionUrl, user }) {
  const [initialPrompt, setInitialPrompt] = useState('');
  const {
    isLoading,
    chat,
    addMessageToChat,
    handleSubmit
  } = useChatService({ tokens, redirectionUrl, user });

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const prompt = urlParams.get('prompt');
    if (prompt) {
        setInitialPrompt(prompt);
    }
  }, []);

  return (
    <div className="viewport">
      <MetaHead />
      <Header resetChat={resetChat} redirectionUrl={redirectionUrl} user={user} />
      <ChatBody chat={chat} isLoading={isLoading} />
      <ChatInput 
        resetChat={resetChat} 
        handleSubmit={handleSubmit}
        redirectionUrl={redirectionUrl} 
        addMessageToChat={addMessageToChat}
        initialPrompt={initialPrompt}
      />
    </div>
  );
}

export default IndexPage;
