// netlify/functions/getChatReply.js

const axios = require('axios');
const NodeCache = require('node-cache');

const conversationCache = new NodeCache();

exports.handler = async function (event, context) {
  const { OPENAI_API_KEY, CORE_PROMPT } = process.env;
  const { prompt, memory, envs } = JSON.parse(event.body);

  let fullPrompt = [];
  let conversationHistory = memory || [];

  if (conversationHistory.length === 0) {
    // If there is no conversation history, send CORE_PROMPT + USER INPUT
    fullPrompt.push({ role: 'system', content: CORE_PROMPT });
    fullPrompt.push({ role: 'user', content: prompt });
  } else {
    // If there is conversation history, send CHATHISTORY[-1] + USER INPUT
    fullPrompt.push(...conversationHistory.slice(-1)); // Include the last message from the conversation history
    fullPrompt.push({ role: 'user', content: prompt });
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
        envs,
      }
    );

    const output = response.data.choices[0].message.content;

    // Save the AI response to the conversation history
    conversationHistory.push({ role: 'AI', content: output });
    conversationCache.set('history', conversationHistory);

    // Return the AI response
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
