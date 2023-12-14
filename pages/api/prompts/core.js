// pages/api/prompts/core.js

export default function handler(req, res) {
    // Retrieve CORE_PROMPT from environment variables or set a default value
    const corePrompt = process.env.CORE_PROMPT || 'Default core prompt if not set in env';
  
    // Send the core prompt as a JSON response
    res.status(200).json({ corePrompt });
  }
  