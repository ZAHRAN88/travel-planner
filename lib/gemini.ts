import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const generateTravelPlan = async (answers: string[]) => {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const prompt = `Create a detailed travel plan following this EXACT format:
  
  ## Destination Overview
  Provide a 2-3 sentence overview of the destination.
  
  ## Daily Itinerary
  Day 1: [Title]
  - [Morning activity]
  - [Afternoon activity]
  - [Evening activity]
  
  Day 2: [Title]
  - [Morning activity]
  - [Afternoon activity]
  - [Evening activity]
  
  Day 3: [Title]
  - [Morning activity]
  - [Afternoon activity]
  - [Evening activity]
  
  ## Essential Packing List
  - Item 1
  - Item 2
  - Item 3
  - Item 4
  - Item 5
  - Item 6
  
  ## Budget Recommendations
  - Accommodation: [cost range]
  - Daily food budget: [cost range]
  - Activities: [cost range]
  - Transportation: [cost range]
  - Total estimated budget: [amount]
  
  ## Cultural Notes
  - Note 1
  - Note 2
  - Note 3
  - Note 4
  
  ## Transportation Guide
  - Getting there: [details]
  - Local transportation: [details]
  - Best ways to move around: [details]
  
  Important formatting rules:
  1. Use exactly these section headers with ## prefix
  2. For Daily Itinerary, start each day with "Day X: " followed by a title
  3. Use simple bullet points with single dash (-)
  4. Keep all text plain without any markdown formatting or special characters
  5. Ensure each section has content in the specified format
  
  Based on these details: ${answers.join(", ")}`;
  
    try {
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      console.error("Gemini API error:", error);
      return null;
    }
  };