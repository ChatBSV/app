// src/lib/parseFormat.js

function parseAspectRatio(aspectRatio, defaultFormat) {
  const aspectRatios = {
      "16:9": "1792x1024",
      "9:16": "1024x1792",
      "4:3": "1792x1024",
      "2:1": "1792x1024",
      "3:1": "1792x1024",
      "3:2": "1792x1024",
      "2:3": "1024x1792",
      "1:1": "1024x1024",
      "1:3": "1024x1792",
      "3:4": "1024x1792",
      "1:2": "1024x1792",

      // Add more aspect ratios as needed
  };

  return aspectRatios[aspectRatio] || defaultFormat;
}

function parseSingleDimension(dimension) {
  const defaultHorizontal = "1792x1024";
  const defaultSquare = "1024x1024";

  if (dimension === "1024") {
      return defaultSquare;
  } else if (dimension === "1792") {
      return defaultHorizontal;
  }
  return defaultSquare; // Default to square if dimension is not recognized
}

export default function parseFormat(prompt) {
  const defaultFormat = "1024x1024";
  const formatRegex = /--format\s+([^\s]+)/i; 
  const match = prompt.match(formatRegex);
  let format = defaultFormat;

  if (match) {
      const formatSpecRaw = match[1].toLowerCase();
      const formatSpec = formatSpecRaw.trim(); // Trim spaces and sanitize
      prompt = prompt.replace(formatRegex, "").trim(); // Remove the format specification

      if (formatSpec.includes('x')) {
          // Dimension specifications
          const [width, height] = formatSpec.split('x').map(Number);
          if ((width === 1920 && height === 1080) || (width === 1280 && height === 720)) {
              format = "1792x1024"; // Default to 16:9 horizontal
          } else if ((width === 1000 && height === 1000) || (width === 500 && height === 500) || (width === 512 && height === 512)) {
              format = defaultFormat; // Default to square
          } else {
              format = formatSpec; // Use the user-specified format
          }
      } else if (formatSpec.includes(':')) {
          // Aspect ratio specifications
          format = parseAspectRatio(formatSpec, defaultFormat);
      } else if (!isNaN(parseInt(formatSpec))) {
          // Single dimension specification
          format = parseSingleDimension(formatSpec);
      } else {
          // Descriptive formats
          switch (formatSpec) {
              case "horizontal":
                  format = "1792x1024";
                  break;
              case "vertical":
                  format = "1024x1792";
                  break;
              case "square":
              case "1:1":
                  format = defaultFormat;
                  break;
              default:
                  // Leave default if no match
                  break;
          }
      }
  }

  return { format, newPrompt: prompt };
}
