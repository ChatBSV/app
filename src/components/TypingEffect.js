// TypingEffect.js

import React, { useState, useEffect } from 'react';

const TypingEffect = ({ content, typingSpeed, onComplete }) => {
  const [displayedContent, setDisplayedContent] = useState('');

  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index <= content.length) {
        setDisplayedContent(content.substring(0, index));
        index++;
      } else {
        clearInterval(timer);
        if (typeof onComplete === 'function') {
          onComplete();
        }
      }
    }, typingSpeed);

    return () => clearInterval(timer);
  }, [content, typingSpeed, onComplete]);

  return <div dangerouslySetInnerHTML={{ __html: displayedContent.replace(/\n/g, '<br />') }} />;
};

export default TypingEffect;
