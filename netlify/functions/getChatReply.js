// netlify/functions/getChatReply.js

const axios = require('axios');
const NodeCache = require('node-cache');

const conversationCache = new NodeCache();
const MAX_TOKENS = 4096;

exports.handler = async function (event, context) {
  const { OPENAI_API_KEY } = process.env;
  const { corePrompt, prompt } = JSON.parse(event.body);

  let fullPrompt = [];

  let conversationHistory = conversationCache.get('history') || [];

  // Include the user input message in the history
  conversationHistory.unshift({ role: 'user', content: prompt });
  conversationCache.set('history', conversationHistory);

  // Limit the conversation history if it exceeds the maximum tokens
  let tokensUsed = 0;
  conversationHistory = conversationHistory.filter((message) => {
    tokensUsed += message.content.length;
    return tokensUsed <= MAX_TOKENS;
  });

  if (conversationHistory.length > 0) {
    fullPrompt = [...conversationHistory];
  } else {
    // Include the core prompt as the system message for the first prompt
    fullPrompt.push({ role: 'system', content: corePrompt });
  }

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: fullPrompt,
        max_tokens: 2000,
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const assistantResponse = response.data.choices[0].message.content;
    const totalTokens = response.data.usage.total_tokens;

    // Add the assistant message to the history
    conversationHistory = conversationCache.get('history') || [];
    conversationHistory.unshift({ role: 'assistant', content: assistantResponse });
    conversationCache.set('history', conversationHistory);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: assistantResponse, totalTokens }),
    };
  } catch (error) {
    console.error('Error:', error);
    if (error.response && error.response.data && error.response.data.error) {
      console.log('API Error:', error.response.data.error.message);
    }
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'An error occurred during processing.' }),
    };
  }
};
