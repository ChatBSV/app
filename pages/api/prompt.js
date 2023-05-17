// pages/api/prompt.js

import axios from 'axios';

export default async function handler(req, res) {
  const { prompt } = req.body;

  try {
    const corePrompt = process.env.CORE_PROMPT;
    const fullPrompt = [
      {
        role: 'system',
        content: corePrompt,
      },
      {
        role: 'user',
        content: prompt,
      },
    ];
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: fullPrompt,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const output = response.data.choices[0].message.content;
    res.status(200).json({ response: output });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred during processing.' });
  }
}
