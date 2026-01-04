import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisInput, OptimizationResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeFamily = async (input: AnalysisInput): Promise<OptimizationResult> => {
  const model = "gemini-2.5-flash-image";

  const prompt = `
    You are an expert BIM Manager and Revit Family Developer.
    Analyze the attached screenshot of a Revit Family and the provided metadata.

    Metadata:
    - Category: ${input.category}
    - Reported File Size: ${input.fileSizeMB} MB
    - User Context: ${input.additionalContext || "None provided"}

    Your task is to:
    1. Determine if the family is "Over-Modeled" (too complex for general BIM use).
    2. Visually estimate the polygon density/count based on the geometry shown.
    3. Identify elements that should likely be 2D Symbolic Lines instead of 3D solids.
    4. Suggest specific items to delete or simplify for lower LODs (Level of Development).
    5. Suggest potential unused parameters common for this category that might be cluttering the family (infer based on standard bad practices if not visible).

    Respond strictly in JSON format matching this schema:
    {
      "isOverModeled": boolean,
      "complexityScore": number (0-100, where 100 is extremely complex),
      "polygonEstimate": string (e.g., "Low (<1000)", "Medium (1000-5000)", "High (>5000)"),
      "unusedParams": string[] (list of potential unused parameters),
      "suggestions": [
        {
          "title": string,
          "description": string,
          "impact": "High" | "Medium" | "Low",
          "type": "Deletion" | "Symbolic" | "Simplification" | "Parameter"
        }
      ],
      "lodRecommendations": string (advice on LOD 200 vs 400),
      "symbolicCandidates": string[] (parts of geometry to turn into lines),
      "overallAnalysis": string (brief summary paragraph)
    }
  `;

  const parts: any[] = [{ text: prompt }];

  if (input.image) {
    // Remove data:image/png;base64, prefix if present
    const base64Data = input.image.split(',')[1] || input.image;
    parts.push({
      inlineData: {
        mimeType: "image/png", // Assuming PNG, or detect from string
        data: base64Data
      }
    });
  }

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: { parts: parts },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isOverModeled: { type: Type.BOOLEAN },
            complexityScore: { type: Type.NUMBER },
            polygonEstimate: { type: Type.STRING },
            unusedParams: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            suggestions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  impact: { type: Type.STRING, enum: ["High", "Medium", "Low"] },
                  type: { type: Type.STRING, enum: ["Deletion", "Symbolic", "Simplification", "Parameter"] }
                }
              }
            },
            lodRecommendations: { type: Type.STRING },
            symbolicCandidates: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            overallAnalysis: { type: Type.STRING }
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as OptimizationResult;
    }
    throw new Error("Empty response from AI");

  } catch (error) {
    console.error("Gemini analysis failed:", error);
    throw error;
  }
};
