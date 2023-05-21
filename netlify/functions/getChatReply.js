// netlify/functions/getChatReply.js

const axios = require('axios');
const NodeCache = require('node-cache');

const conversationCache = new NodeCache();

exports.handler = async function(event, context) {
  const { OPENAI_API_KEY, CORE_PROMPT } = process.env;
  const prompt = event.body;

  let fullPrompt = [
    {
      role: 'system',
      content: CORE_PROMPT,
    },
    {
      role: 'user',
      content: prompt,
    },
  ];

  let conversationHistory = [];

  // Retrieve conversation history from cache
  const cachedHistory = conversationCache.get('history');
  if (cachedHistory) {
    conversationHistory = cachedHistory;
  }

  if (conversationHistory.length > 0) {
    // Include the last message from the conversation history
    fullPrompt = [
      {
        role: 'system',
        content: CORE_PROMPT,
      },
      ...conversationHistory.slice(-1),
      {
        role: 'user',
        content: prompt,
      },
    ];
  }

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: fullPrompt,
        max_tokens: 4000,
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const output = response.data.choices[0].message.content;

    // Save the assistant message to the conversation history
    conversationHistory.push({ message: output, isUser: false });

    // Clear the previous conversation history from cache
    conversationCache.del('history');

    // Save updated conversation history to cache as the most recent conversation
    conversationCache.set('history', conversationHistory);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: output }),
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
