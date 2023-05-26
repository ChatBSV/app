// netlify/functions/getChatReply.js

const axios = require('axios');

exports.handler = async function (event, context) {
  const { OPENAI_API_KEY, CORE_PROMPT } = process.env;
  const { prompt, lastUserMessage, txid, history } = JSON.parse(event.body);

  let messages;

  if (history && history.length > 0) {
    messages = [
      ...history.slice(-1), // Include only the most recent AI response as context
      { role: 'user', content: lastUserMessage },
      { role: 'user', content: prompt },
    ];
  } else {
    messages = [
      { role: 'system', content: CORE_PROMPT },
      { role: 'user', content: prompt },
    ];
  }

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: messages,
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
    const total_tokens = response.data.usage.prompt_tokens + response.data.usage.completion_tokens;
    
    console.log('Tokens:', total_tokens); // Log the tokens value
    
    return {
       statusCode: 200,
       body: JSON.stringify({ message: assistantResponse, tokens: total_tokens, txid }),
    };
    
  } catch (error) {
    console.error('Error:', error);
    if (error.response && error.response.data && error.response.data.error) {
      console.error('API Error:', error.response.data.error.message);
    }
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'An error occurred during processing.' }),
    };
  }
};
