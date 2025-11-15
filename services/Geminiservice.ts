import { GoogleGenAI } from "@google/genai";

// FIX: Removed apiKey parameter. The client will be initialized with the key from environment variables.
export const analyzeYarnImage = async (base64ImageData: string): Promise<string> => {
  // FIX: Initialize client with API key from environment variables as per guidelines.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const imagePart = {
    inlineData: {
      mimeType: 'image/jpeg',
      data: base64ImageData,
    },
  };
  const textPart = {
    text: "Analyze this image of leftover yarn. Describe the colors, approximate textures (e.g., chunky, fine, fluffy), and suggest 3 simple knitting project ideas suitable for this yarn. For each idea, give it a catchy name and a short description. Format the response as markdown."
  };

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: { parts: [imagePart, textPart] },
  });
  
  return response.text;
};

// FIX: Removed apiKey parameter. The client will be initialized with the key from environment variables.
export const generateKnittingPattern = async (yarnAnalysis: string): Promise<string> => {
  // FIX: Initialize client with API key from environment variables as per guidelines.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Based on the following yarn analysis, generate a detailed, beginner-friendly knitting pattern for one of the suggested projects. Pick the most interesting one. Make sure to include needle size recommendations, cast-on instructions, the main pattern stitch, and finishing instructions. Format it nicely using markdown.\n\nYarn Analysis:\n${yarnAnalysis}`;
  
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-pro',
    contents: prompt,
    config: {
      thinkingConfig: { thinkingBudget: 32768 },
    },
  });

  return response.text;
};

// FIX: Removed apiKey parameter. The client will be initialized with the key from environment variables.
export const generateProjectImage = async (yarnAnalysis: string): Promise<string> => {
  // FIX: Initialize client with API key from environment variables as per guidelines.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Generate a photorealistic image of a finished knitting project based on this description. The project should look handmade and cozy, styled in a bright, modern setting.\n\nProject Description:\n${yarnAnalysis}`;

  const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: prompt,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/png',
        aspectRatio: '1:1',
      },
  });

  const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
  return `data:image/png;base64,${base64ImageBytes}`;
};

const videoLoadingMessages = [
    "Spinning up the video loom...",
    "Knitting pixels together...",
    "Casting on a new video sequence...",
    "This can take a few minutes, time for a tea break!",
    "Purling the final frames...",
    "Weaving your yarn's story into a beautiful video..."
];

// FIX: Removed apiKey parameter. The client will be initialized with the key from environment variables.
export const generateYarnVideo = async (
  base64ImageData: string,
  aspectRatio: '16:9' | '9:16'
): Promise<string> => {
  // FIX: Initialize client with API key from environment variables as per guidelines.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = "Create a short, magical video showing this yarn being transformed into a beautiful knitted item. Start with a close-up of the yarn, then show knitting needles magically working, and end with the finished product appearing.";

  let operation = await ai.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
    prompt: prompt,
    image: {
      imageBytes: base64ImageData,
      mimeType: 'image/jpeg',
    },
    config: {
      numberOfVideos: 1,
      resolution: '720p',
      aspectRatio: aspectRatio,
    }
  });

  let messageIndex = 0;
  const loadingElement = document.getElementById('video-loading-message');
  if (loadingElement) loadingElement.innerText = videoLoadingMessages[messageIndex];
  
  const intervalId = setInterval(() => {
    messageIndex = (messageIndex + 1) % videoLoadingMessages.length;
    if (loadingElement) loadingElement.innerText = videoLoadingMessages[messageIndex];
  }, 5000);

  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 10000));
    operation = await ai.operations.getVideosOperation({operation: operation});
  }

  clearInterval(intervalId);

  const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
  if (!downloadLink) {
    throw new Error("Video generation did not return a valid download link.");
  }
  
  // FIX: Use API key from environment variables for fetching the video.
  const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch video: ${response.statusText}`);
  }
  
  const videoBlob = await response.blob();
  return URL.createObjectURL(videoBlob);
};
