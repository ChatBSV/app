// pages/api/tokenizer.js

import { NextApiRequest, NextApiResponse } from 'next';

/**
 * Approximate tokenization and trimming of chat history.
 * 
 * @param {string} chatHistory - The full chat history as a string.
 * @param {number} tokenLimit - The maximum number of tokens allowed.
 * @returns {string} - The trimmed chat history.
 */
const tokenizeAndTrim = (chatHistory, tokenLimit) => {
    // Assuming an average of 4 bytes (roughly 3 characters) per token as an approximation
    const approxTokenSize = 4; 
    const maxChars = tokenLimit * approxTokenSize;

    if (Buffer.byteLength(chatHistory, 'utf8') <= maxChars) {
        return chatHistory;
    }

    // Trim the chat history to fit the token limit
    let trimmedHistory = chatHistory;
    while (Buffer.byteLength(trimmedHistory, 'utf8') > maxChars) {
        // Remove one character at a time from the beginning (oldest messages)
        trimmedHistory = trimmedHistory.substring(1);
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

        if (typeof chatHistory !== 'string') {
            throw new Error('Invalid chat history format. Expected a string.');
        }

        const processedHistory = tokenizeAndTrim(chatHistory, tokenLimit);

        console.log('Processed chat history:', processedHistory); // Logging for debugging
        res.status(200).json({ processedHistory });
    } catch (error) {
        console.error('Error in tokenization:', error.message);
        res.status(500).json({ error: error.message });
    }
}
