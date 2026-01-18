import { GoogleGenAI } from "@google/genai";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const askGeopoliticsTutor = async (question: string, contextLesson?: string): Promise<string> => {
  try {
    const model = 'gemini-3-flash-preview';
    
    let promptContext = "Você é um professor especialista em Geopolítica e Estratégia Internacional. Responda de forma concisa, direta e estimulante.";
    
    if (contextLesson) {
      promptContext += ` O aluno está atualmente estudando a aula: "${contextLesson}". Tente relacionar sua resposta a este tópico se pertinente.`;
    }

    const response = await ai.models.generateContent({
      model: model,
      contents: [
        {
          role: 'user',
          parts: [
            { text: `System Instruction: ${promptContext}` },
            { text: `Pergunta do aluno: ${question}` }
          ]
        }
      ]
    });

    return response.text || "Desculpe, a conexão com o satélite estratégico foi interrompida. Tente novamente.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Erro ao contatar a inteligência artificial. Verifique suas credenciais.";
  }
};