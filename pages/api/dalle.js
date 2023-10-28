// pages/api/dalle.js
import openai from "openai";
import { config } from "dotenv";

config();  // Initialize dotenv

export async function handleDalleRequest(reqBody, reqHeaders) {
  const { prompt, format } = reqBody;
  const { requestType } = reqHeaders;

  if (!prompt || !format) {
    throw new Error("Prompt and format are required");
  }

  try {
    const openaiClient = new openai.OpenAIAPI({
      key: process.env.OPENAI_API_KEY,
    });

    const response = await openaiClient.createImage({
      model: "image-alpha-001",
      prompt,
      n: 1,
      size: format,
      response_format: "url",
    });

    const imageUrl = response.data[0].url;
    return { imageUrl };
  } catch (error) {
    console.error("Error generating image:", error);
    throw error;
  }
}