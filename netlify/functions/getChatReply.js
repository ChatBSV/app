// netlify/functions/getChatReply.js

const axios = require('axios');
const NodeCache = require('node-cache');

const conversationCache = new NodeCache();

exports.handler = async function (event, context) {
  const { OPENAI_API_KEY, CORE_PROMPT } = process.env;
  const { prompt, memory, envs } = JSON.parse(event.body);

  let fullPrompt = [];
  let conversationHistory = [];

  if (memory) {
    conversationHistory = memory.slice(); // Create a copy of the conversation history
  }

  if (conversationHistory.length === 0) {
    // If there is no conversation history, send USER INPUT + CORE_PROMPT
    fullPrompt.push({ role: 'user', content: prompt });
    fullPrompt.push({ role: 'system', content: CORE_PROMPT });
  } else {
    // If there is conversation history, include the history slice -1 with USER INPUT
    fullPrompt = conversationHistory.slice(0, -1); // Exclude the last message
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

    // Save the latest AI response to the conversation history
    conversationHistory = [{ role: 'user', content: prompt }, { role: 'AI', content: output }];
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
