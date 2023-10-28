// pages/api/dalle.js
import axios from 'axios';
import dotenv from "dotenv";

dotenv.config();

// Function to handle DALLE request
async function handleDalleRequest(reqBody) {
  const { prompt, format } = reqBody;

  if (!prompt || !format) {
    throw new Error("Prompt and format are required");
  }

  const apiEndpoint = "https://api.openai.com/v1/images/generations";

  try {
    const response = await axios.post(apiEndpoint, {
      prompt,
      n: 1,
      response_format: "url",
      size: format
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const imageUrl = response.data.url;
    return { imageUrl };
  } catch (error) {
    console.error("Error generating image:", error);
    throw error;
  }
}

// Default export to handle POST requests
export default async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).end(); // Method Not Allowed
    return;
  }

  const reqBody = JSON.parse(req.body);

  try {
    const result = await handleDalleRequest(reqBody);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
