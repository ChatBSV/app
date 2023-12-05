// src/hooks/ChatTokenizer.js

export const tokenizeChatHistory = async (chatHistory) => {
  try {
    const response = await fetch('/api/tokenizer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ chatHistory })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const { processedHistory } = await response.json();
    return processedHistory.split('\n').map(content => ({ role: 'user', content }));
  } catch (error) {
    console.error('Error in tokenizing chat history:', error);
    throw error;
  }
};

export default tokenizeChatHistory;
