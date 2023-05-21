// netlify/functions/getChatReply.js

const axios = require('axios');
const NodeCache = require('node-cache');

const conversationCache = new NodeCache();

exports.handler = async function (event, context) {
  const { OPENAI_API_KEY } = process.env;
  const { corePrompt, prompt, memory, envs } = JSON.parse(event.body);

  let fullPrompt = [];

  const conversationHistory = memory || [];

  if (conversationHistory.length > 1) {
    fullPrompt.push(...conversationHistory.slice(0, -1)); // Exclude the last user message from the history
  }

  fullPrompt.push({ role: 'system', content: corePrompt });
  fullPrompt.push({ role: 'system', content: '' });
  fullPrompt.push({ role: 'system', content: '' });
  fullPrompt.push({ role: 'user', content: prompt });

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: fullPrompt.map((message) => {
          // Ensure each message object has the 'role' and 'content' properties
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

    conversationCache.set('history', conversationHistory.slice(-1)); // Save the last message in the conversation history

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
