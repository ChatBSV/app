// tokenizeChatHistory.js

export const tokenizeChatHistory = async (chatHistory, tokenLimit) => {
  try {
    const trimmedMessages = chatHistory.map((message) => {
      const maxChars = tokenLimit * 4;
      if (message.content.length > maxChars) {
        message.content = message.content.substring(0, maxChars);
      }

      return message;
    });

    const response = await fetch('/api/tokenizer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ chatHistory: trimmedMessages }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error!`);
    }

    const { processedHistory } = await response.json();
    return processedHistory;
  } catch (error) {
    console.error('Error in tokenizeChatHistory:', error);
    throw error;
  }
};

export default tokenizeChatHistory;
