// netlify/functions/getChatReply.js
const axios = require('axios');
const { OPENAI_API_KEY, CORE_PROMPT } = process.env;

const fetchTxid = async () => {
  try {
    const response = await axios.get('https://api.moneybutton.com/v2/auth/bsvalias/resolve', {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    return response.data.txid;
  } catch (error) {
    console.error('Error fetching txid:', error);
    return null;
  }
};

exports.handler = async function (event, context) {
  const { prompt, lastUserMessage } = JSON.parse(event.body);

  let messages;

  if (lastUserMessage) {
    messages = [
      { role: 'system', content: CORE_PROMPT },
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
    const [response, txid] = await Promise.all([
      axios.post(
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
      ),
      fetchTxid(),
    ]);

    const assistantResponse = response.data.choices[0].message.content;
    const totalTokens = response.data.choices[0].message.total_tokens;

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        message: assistantResponse, 
        totalTokens,
        txid
      }),
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
