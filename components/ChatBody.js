// components/ChatBody.js

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

  return (
    <div className={styles.chatBody} ref={chatContainerRef}>
      <div className={styles.chatContainer}>
        <ChatMessage
          message="Welcome to ChatBSV. Create a MoneyButton account if you don't have one yet."
          role="assistant"
          className={styles.introMessage}
        />

        {chat.map((message, index) => (
          <ChatMessage
            key={index}
            message={message.message}
            role={message.role}
            totalTokens={message.totalTokens}
            txid={message.txid}
          />
        ))}

        {isLoading && (
          <ChatMessage
            message="Counting satoshis, please hold..."
            role="assistant"
            className={styles.loadingMessage}
          />
        )}

        {isError && (
          <ChatMessage
            message="OpenAI error. Please try again or come back later."
            role="assistant"
            className={styles.errorMessage}
          />
        )}

        <div className={styles.spacer}></div>
      </div>
    </div>
  );
}
