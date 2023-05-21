// netlify/functions/getChatReply.js

const axios = require('axios');
const NodeCache = require('node-cache');

const cache = new NodeCache();

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

  let conversationHistory = cache.get('conversationHistory') || [];

  if (conversationHistory.length > 0) {
    const transformedHistory = conversationHistory.map(({ message }) => ({
      role: 'assistant',
      content: message,
    }));

    // Include the last message from the conversation history
    fullPrompt = [
      {
        role: 'system',
        content: CORE_PROMPT,
      },
      ...transformedHistory.slice(-1),
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
    conversationHistory.push({ message: output });

    // Store updated conversation history in cache
    cache.set('conversationHistory', conversationHistory);

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
