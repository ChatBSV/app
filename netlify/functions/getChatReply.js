// netlify/functions/getChatReply.js

const axios = require('axios');
const NodeCache = require('node-cache');

const conversationCache = new NodeCache();

exports.handler = async function (event, context) {
  const { OPENAI_API_KEY } = process.env;
  const { sessionId, corePrompt, prompt } = JSON.parse(event.body);

  let fullPrompt = [];

  const conversationHistory = conversationCache.get(sessionId.toString()) || [];

  if (conversationHistory.length > 0) {
    // Include the previous message from history
    const previousMessage = conversationHistory[0];
    fullPrompt.push({ role: 'user', content: previousMessage.content });
  } else {
    // Include the core prompt as the system message for the first prompt
    fullPrompt.push({ role: 'system', content: corePrompt });
  }

  // Include the user input message
  fullPrompt.push({ role: 'user', content: prompt });

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

    // Clear conversation history for this session and save the received message
    conversationCache.set(sessionId, [{ content: assistantResponse }]);

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
