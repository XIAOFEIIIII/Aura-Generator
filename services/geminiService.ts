import { GoogleGenAI } from "@google/genai";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing. Please ensure process.env.API_KEY is available.");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateAuraImage = async (colors: string[]): Promise<string> => {
  const ai = getClient();
  
  // Construct a descriptive prompt based on the user's colors
  const colorString = colors.join(", ");
  // Updated prompt for "Aurora" style: large blocks, flowing, ethereal
  const prompt = `Abstract gradient art featuring large, flowing waves of color: ${colorString}. The style resembles the aurora borealis with soft, glowing curtains of light and large organic liquid shapes. Ethereal, dreamy, atmospheric. Smooth transitions between large distinct color blocks, no muddiness. Soft focus, high quality, artistic wallpaper.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1",
        }
      }
    });

    // Parse response to find image data
    if (response.candidates && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
           return `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
        }
      }
    }

    throw new Error("No image data found in the response.");
  } catch (error) {
    console.error("Gemini Generation Error:", error);
    throw error;
  }
};