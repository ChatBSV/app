// pages/api/openai4.js

import axios from 'axios';

export async function handleOpenAIRequest4(prompt, history, model) {
  const { OPENAI_API_KEY, CORE_PROMPT } = process.env;
  // Filter out empty user messages from history and filteredHistory
  const filteredHistory = history.filter(
    (message) => !['help', 'loading', 'error', 'dalle-image'].includes(message.role) && message.content.trim() !== ''
  );

  console.log('History:', history);
  console.log('Filtered History:', filteredHistory);

  if (!OPENAI_API_KEY) {
    throw new Error('The OPENAI_API_KEY is not set in environment variables.');
  }
  
  if (!CORE_PROMPT && (!history || history.length === 0)) {
    throw new Error('The CORE_PROMPT is not set in environment variables and no valid history is provided.');
  }

  if (filteredHistory.length > 0 && !Array.isArray(history)) {
    throw new Error('History should be an array of message objects.');
  }

  const messages = filteredHistory.length > 0
    ? [...filteredHistory.map((message) => ({ role: message.role, content: message.content })), { role: 'user', content: prompt }]
    : [{ role: 'system', content: CORE_PROMPT }, { role: 'user', content: prompt }];
    
  const maxTokens = model === 'gpt-4' ? 4000 : 2000;

  try {
    console.log(`handleOpenAIRequest: Using model - ${model}`);
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: "gpt-4o",
        messages: messages,
        max_tokens: maxTokens, 
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const assistantResponse = response.data.choices[0].message.content;
    const tokens = response.data.usage.total_tokens;

    return { message: assistantResponse, tokens: tokens };
  } catch (error) {
    console.error('OpenAI Request Error:', error);
    // Extracting error message from OpenAI response
    const errorMessage = error.response?.data?.error?.message || error.message;
    throw new Error(`OpenAI Request failed: ${errorMessage}`);
  }
}
