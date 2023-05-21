// netlify/functions/getChatReply.js

const axios = require('axios');
const NodeCache = require('node-cache');

const conversationCache = new NodeCache();

exports.handler = async function (event, context) {
  const { OPENAI_API_KEY, CORE_PROMPT } = process.env;
  const { prompt, memory, envs } = JSON.parse(event.body);

  let fullPrompt = [];

  const conversationHistory = memory || [];

  if (conversationHistory.length > 0) {
    fullPrompt.push({ role: 'system', content: CORE_PROMPT });
    fullPrompt.push(...conversationHistory.slice(0, -1));
  }

  fullPrompt.push({ role: 'user', content: prompt });

  // Remove unexpected properties from the second message
  if (fullPrompt.length > 1) {
    delete fullPrompt[1].isUser;
    delete fullPrompt[1].message;
  }

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: fullPrompt.map((message) => {
          if (!message.role || !message.content) {
            return { role: 'system', content: message.content || '' };
          }
          return message;
        }),
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

    conversationCache.set('history', conversationHistory.slice(-1));

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
