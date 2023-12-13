import { NextApiRequest, NextApiResponse } from 'next';

/**
 * Approximate tokenization and trimming of chat history.
 * 
 * @param {string[]} chatHistory - An array of messages in the chat history.
 * @param {number} tokenLimit - The maximum number of tokens allowed.
 * @returns {string[]} - An array of trimmed messages.
 */
const tokenizeAndTrim = (chatHistory, tokenLimit) => {
    const approxTokenSize = 4; // Assuming an average of 4 bytes (roughly 3 characters) per token as an approximation
    const maxTokens = tokenLimit;

    let currentTokens = 0;
    const trimmedHistory = [];

    for (const message of chatHistory) {
        const messageTokens = message.content.split(' ').length; // Count tokens in the message
        if (currentTokens + messageTokens <= maxTokens) {
            // If adding this message doesn't exceed the token limit, add it to trimmedHistory
            trimmedHistory.push(message);
            currentTokens += messageTokens;
        } else {
            // If adding this message exceeds the token limit, break the loop
            break;
        }
    }

    return trimmedHistory;
};

export default function handler(req, res) {
    if (req.method !== 'POST') {
        // Only POST method is accepted
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
        return;
    }

    try {
        const { chatHistory } = req.body;
        const tokenLimit = 1000; // Set your token limit

        if (!Array.isArray(chatHistory)) {
            throw new Error('Invalid chat history format. Expected an array.');
        }

        const processedHistory = tokenizeAndTrim(chatHistory, tokenLimit);

        console.log('Processed chat history:', processedHistory); // Logging for debugging
        res.status(200).json({ processedHistory });
    } catch (error) {
        console.error('Error in tokenization:', error.message);
        res.status(500).json({ error: error.message });
    }
}
