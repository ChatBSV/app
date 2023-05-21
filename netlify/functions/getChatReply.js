// netlify/functions/getChatReply.js

const axios = require('axios');
const fs = require('fs');

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

  // Check if the conversation history file exists
  if (fs.existsSync('conversationHistory.json')) {
    try {
      const data = fs.readFileSync('conversationHistory.json', 'utf8');
      conversationHistory = JSON.parse(data);
    } catch (error) {
      console.error('Error reading conversation history:', error);
    }
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

    // Save updated conversation history to the file
    fs.writeFileSync('conversationHistory.json', JSON.stringify(conversationHistory), 'utf8');

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

