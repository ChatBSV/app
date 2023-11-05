// filepath/components/ChatBody.js

import React, { useEffect, useRef } from 'react';
import styles from './ChatBody.module.css';
import ChatMessage from './ChatMessage';

function ChatBody({ chat, isLoading, isError }) {
  const chatContainerRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [chat, isLoading, isError]);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  const errorMessage = chat.find(message => message.role === "error")?.content || "OpenAI error. Please try again or come back later.";

  return (
    <div className={styles.chatBody} ref={chatContainerRef}>
      <div className={styles.chatContainer}>
        <ChatMessage
          content={`<span style="font-weight:600;">Hi there, I'm ChatBSV!
          <span style="font-weight:500; ">I'm your new personal assistant with a streamlined interface to OpenAI and DALLE for micro-transactions on BitcoinSV.
          
          You may speak to me in any language. Our chat is private and saved temporarily in your browser for memory and context and you can delete it at any time. I do not store any of your data.
          
          See below examples of what I can help you with:

          <span style="font-weight:600;">/Imagine <span style="font-weight:500;"> to generate an image.
          <span style="font-weight:600;">[Enter] <span style="font-weight:500;">to send.
          <span style="font-weight:600;">[Shift+Enter] <span style="font-weight:500;">to skip a line.`} 
          role="intro"
          className={styles.introMessage}
        />
        <ChatMessage
          content={`<span style=" font-weight:600;">Chat with OpenAI
          <span style="font-size:13px; font-weight:600;">GPT 3.5 Turbo, $0.099 / Message</span>
          
          <span style="font-weight:600;">Example:
          <span style="font-weight:600;">User:<span style="font-weight:500;"> What is the circumference of the earth?
          <span style="font-weight:600;">ChatBSV:<span style="font-weight:500;"> The Equator is 24,901 miles long.
          <span style="font-weight:600;">User:<span style="font-weight:500;"> Write a tweet about that.
          <span style="font-weight:600;">ChatBSV:<span style="font-weight:500;"> 🌍 It would take about 4,167 hours to walk the 24,901 miles of the Earth's equator at a brisk pace of 3 mph, without stops! That's roughly 173 days of non-stop walking, day & night. 🚶‍♂️✨ #FunFact #WalkTheWorld #EarthEquator`}
          role="intro"
          className={styles.introMessage}
        />
        <ChatMessage
          content={`<span style="font-weight:600;">Generate Images with /Imagine
          <span style="font-size:13px; font-weight:600;">DALL-E, 1024x1024, $0.099 / Image</span>
          
          <span style="font-weight:600;">Example:
          <span style="font-weight:600;">User:<span style="font-weight:500;"> /Imagine a watercolor of times square
          <span style="font-weight:600;">ChatBSV:

          <img src="https://uploads-ssl.webflow.com/646064abf2ae787ad9c35019/6542e7bbccf00a99b6077f7c_img-ahuZzOYeaS0R4vCO02BgAPuc.png" alt="DALL-E Image" style="width:100%" />`}
          role="intro"
          className={styles.introMessage}
        />
        <ChatMessage
          content={`<span style="font-weight:600;">How can I assist you today?
          <span style="font-weight:500; ">          
          Get started by connecting your Handcash account and should you get stuck, you can always disconnect and reconnect to secure a new session.

          <span style="font-weight:600;">Contact: <span style="font-weight:500;"><a href="https://twitter.com/ChatBSV" target="_blank" rel="noopener noreferrer">@ChatBSV</a>  
          <span style="font-weight:600;">Contribute: <span style="font-weight:500;">$ChatBSV
          
          If you have any question, please feel free to ask me anything!
          
          <span style="font-weight:600;">Happy Prompting!`}
          role="intro"
          className={styles.introMessage}
        />
  
        {chat.map((message) => (
          <ChatMessage
            key={message.id}
            content={message.content} 
            role={message.role}
            tokens={message.role === 'assistant' ? message.tokens : 0}
            txid={message.txid}
          />
        ))}
  
        {isLoading && (
          <ChatMessage
            content="Processing..."
            role="loading"
            className={styles.loadingMessage}
          />
        )}

        {/* Displaying the dynamic error message */}
        {isError && (
          <ChatMessage
            content={errorMessage}
            role="error"
            className={styles.errorMessage}
          />
        )}
  
        <div className={styles.spacer}></div>
      </div>
    </div>
  );
}

export default ChatBody;
