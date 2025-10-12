import { GoogleGenAI, Type } from "@google/genai";
import type { QuizQuestion, ProjectIdea } from '../types';

// FIX: Initialize GoogleGenAI with apiKey from environment variables.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const generateLessonContent = async (lessonTitle: string): Promise<{ explanation: string, pythonCode: string, jsCode: string }> => {
    const prompt = `Génère une explication pour une leçon de programmation intitulée "${lessonTitle}".
    Le public cible est débutant, apprenant à la fois Python et JavaScript.
    L'explication doit être claire, concise et facile à comprendre.
    Fournis des exemples de code simples et pertinents en Python et en JavaScript pour illustrer les concepts.
    Important: Le code doit être bien formaté. Utilise des retours à la ligne pour séparer les instructions au lieu de points-virgules, afin de respecter les conventions de style de chaque langage.
    Formate la sortie en JSON avec les clés "explanation", "pythonCode" et "jsCode".`;

    try {
        // FIX: Use ai.models.generateContent instead of deprecated methods.
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                // FIX: Define response schema for structured JSON output.
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        explanation: { type: Type.STRING },
                        pythonCode: { type: Type.STRING },
                        jsCode: { type: Type.STRING },
                    },
                    required: ["explanation", "pythonCode", "jsCode"]
                }
            }
        });

        // FIX: Access text directly from the response object.
        const jsonString = response.text;
        const parsedContent = JSON.parse(jsonString);
        return parsedContent;
    } catch (error) {
        console.error("Error generating lesson content:", error);
        throw new Error("Failed to generate lesson content.");
    }
};

export const generateQuiz = async (lessonTitle: string): Promise<QuizQuestion[]> => {
    const prompt = `Génère un quiz de 3 questions sur le sujet de la leçon : "${lessonTitle}".
    Chaque question doit avoir 4 options de réponse, dont une seule est correcte.
    Les questions doivent couvrir à la fois Python et JavaScript si pertinent.
    Fournis également une brève explication pour chaque bonne réponse.
    Formate la sortie en JSON, un tableau d'objets, où chaque objet a les clés "question", "options" (un tableau de 4 chaînes), "correctAnswer" (une chaîne correspondant à l'une des options), et "explanation".`;

    try {
        // FIX: Use ai.models.generateContent with appropriate model and schema.
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                // FIX: Define response schema for a list of quiz questions.
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            question: { type: Type.STRING },
                            options: {
                                type: Type.ARRAY,
                                items: { type: Type.STRING }
                            },
                            correctAnswer: { type: Type.STRING },
                            explanation: { type: Type.STRING }
                        },
                        required: ["question", "options", "correctAnswer", "explanation"]
                    }
                }
            }
        });
        
        // FIX: Access text directly from the response object.
        const jsonString = response.text;
        return JSON.parse(jsonString);
    } catch (error) {
        console.error("Error generating quiz:", error);
        throw new Error("Failed to generate quiz.");
    }
};


export const generateProjectIdeas = async (): Promise<ProjectIdea[]> => {
    const prompt = `Génère 5 idées de projets pour des débutants qui apprennent Python et JavaScript.
    Pour chaque projet, fournis un titre, une brève description, et un niveau de difficulté ('Facile', 'Moyen', 'Difficile').
    Formate la sortie en JSON, un tableau d'objets avec les clés "title", "description", et "difficulty".`;

    try {
        // FIX: Use ai.models.generateContent with proper schema.
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            title: { type: Type.STRING },
                            description: { type: Type.STRING },
                            difficulty: { type: Type.STRING },
                        },
                        required: ["title", "description", "difficulty"]
                    }
                }
            }
        });
        
        // FIX: Access text directly from the response object.
        const jsonString = response.text;
        return JSON.parse(jsonString);
    } catch (error) {
        console.error("Error generating project ideas:", error);
        throw new Error("Failed to generate project ideas.");
    }
};