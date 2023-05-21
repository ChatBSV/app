// netlify/functions/getChatReply.js

const axios = require('axios');
const NodeCache = require('node-cache');

// Create an instance of NodeCache
const cache = new NodeCache();

exports.handler = async function(event, context) {
  const { OPENAI_API_KEY, CORE_PROMPT } = process.env;
  const prompt = event.body;

  // Get the conversation history from the cache
  let conversationHistory = cache.get('conversationHistory') || [];

  let fullPrompt = [];

  if (conversationHistory.length === 0) {
    // Send core prompt when memory is empty
    fullPrompt = [
      {
        role: 'system',
        content: CORE_PROMPT,
      },
      {
        role: 'user',
        content: prompt,
      },
    ];
  } else {
    // Send previous OpenAI response and user input when memory is not empty
    const lastOpenAIResponse = conversationHistory[conversationHistory.length - 1];
    fullPrompt = [
      lastOpenAIResponse,
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
        max_tokens: 2500,
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const output = response.data.choices[0].message.content;

    // Save the OpenAI response to the conversation history
    conversationHistory.push({ role: 'assistant', content: output });

    // Store the updated conversation history in the cache
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
