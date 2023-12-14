// src/hooks/useScrollToBottom.js

import { useEffect, useRef } from 'react';

function useScrollToBottom(dependencies) {
  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }

    const observer = new MutationObserver((mutations) => {
      let shouldScroll = true;

      // Check if any mutation is caused by copy code button or inline code
      mutations.forEach(mutation => {
        if (mutation.target.className.includes('copyCodeButton') || mutation.target.nodeName === 'CODE') {
          shouldScroll = false;
        }
      });

      if (chatContainerRef.current && shouldScroll) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      }
    });

    if (chatContainerRef.current) {
      observer.observe(chatContainerRef.current, { 
        childList: true, 
        subtree: true,
        attributes: true,
        attributeFilter: ['style']
      });
    }

    return () => observer.disconnect();
  }, dependencies);

  return chatContainerRef;
}

export default useScrollToBottom;
