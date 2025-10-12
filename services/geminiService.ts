import { GoogleGenAI, Type } from "@google/genai";
import type { LessonContent, ProjectIdea, QuizQuestion } from '../types';

// The API key is obtained from the environment variable `process.env.API_KEY`.
// It is assumed to be pre-configured and available in the execution context.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
const model = "gemini-2.5-flash";

/**
 * A helper function to call the Gemini API and parse the JSON response.
 * @param prompt The prompt to send to the model.
 * @param schema The expected JSON schema for the response.
 * @returns The parsed JSON object.
 */
async function generateAndParseJSON(prompt: string, schema: any): Promise<any> {
    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: schema,
            },
        });

        const jsonText = response.text.trim();
        return JSON.parse(jsonText);
    } catch (error) {
        console.error("Error calling Gemini API or parsing response:", error);
        throw new Error("Failed to get a valid response from the AI model.");
    }
}

// Schema for generating lesson content
const lessonContentSchema = {
    type: Type.OBJECT,
    properties: {
        explanation: {
            type: Type.STRING,
            description: "A detailed but beginner-friendly explanation of the concept, in French."
        },
        pythonCode: {
            type: Type.STRING,
            description: "A simple, well-commented Python code example illustrating the concept."
        },
        jsCode: {
            type: Type.STRING,
            description: "An equivalent, simple, well-commented JavaScript code example illustrating the concept."
        },
    },
    required: ['explanation', 'pythonCode', 'jsCode'],
};

export const generateLessonContent = async (lessonTitle: string): Promise<LessonContent> => {
    const prompt = `Sujet : "${lessonTitle}". Tu es un tuteur expert qui explique des concepts de programmation à des débutants. Ta réponse DOIT être en français. Fournis une explication claire et concise du sujet. Ensuite, fournis un exemple de code simple en Python et un exemple équivalent en JavaScript pour illustrer le concept. Les exemples de code doivent être courts, bien commentés et faciles à comprendre. Structure ta réponse EXACTEMENT selon le schéma JSON fourni.`;
    return generateAndParseJSON(prompt, lessonContentSchema);
};

// Schema for generating a quiz
const quizSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            question: { type: Type.STRING, description: "The quiz question, in French." },
            options: { type: Type.ARRAY, items: { type: Type.STRING }, description: "An array of 4 possible answers, in French." },
            correctAnswer: { type: Type.STRING, description: "The correct answer from the options array." },
            explanation: { type: Type.STRING, description: "A brief explanation for why the answer is correct, in French." },
        },
        required: ['question', 'options', 'correctAnswer', 'explanation'],
    },
};

export const generateQuiz = async (lessonTitle: string): Promise<QuizQuestion[]> => {
    const prompt = `Sujet : "${lessonTitle}". Génère un quiz de 3 questions à choix multiples sur ce sujet pour un programmeur débutant. Ta réponse DOIT être en français. Pour chaque question, fournis 4 options de réponse, la bonne réponse et une brève explication. Assure-toi que la bonne réponse est l'une des options. Structure ta réponse EXACTEMENT selon le schéma JSON fourni.`;
    const quizData = await generateAndParseJSON(prompt, quizSchema);
    if (!Array.isArray(quizData) || quizData.length === 0) {
        throw new Error("Generated quiz data is not a valid array.");
    }
    return quizData;
};

// Schema for generating project ideas
const projectIdeasSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            title: { type: Type.STRING, description: "The project title, in French." },
            description: { type: Type.STRING, description: "A short description of the project, in French." },
            difficulty: { type: Type.STRING, description: "The difficulty level: 'Facile', 'Moyen', or 'Difficile'." },
        },
        required: ['title', 'description', 'difficulty'],
    },
};

export const generateProjectIdeas = async (): Promise<ProjectIdea[]> => {
    const prompt = `Génère une liste d'au moins 50 idées de projets pour des développeurs apprenant Python et JavaScript. Ta réponse DOIT être en français. Les projets doivent couvrir une large gamme de difficultés, de 'Facile' à 'Moyen' puis 'Difficile'. Inspire-toi de problèmes du monde réel pour chaque idée. Pour chaque projet, fournis un titre, une courte description, et le niveau de difficulté. Structure ta réponse EXACTEMENT selon le schéma JSON fourni.`;
    return generateAndParseJSON(prompt, projectIdeasSchema);
};

export const generateProjectSteps = async (title: string, description: string): Promise<string> => {
    const prompt = `
        Titre du projet : "${title}"
        Description : "${description}"

        Tu es un mentor expérimenté en développement logiciel. Ton rôle est de fournir un guide de réalisation détaillé et étape par étape pour le projet ci-dessus.
        Ce guide est destiné à un DÉBUTANT qui apprend Python et JavaScript.
        Ta réponse DOIT être en français.

        Structure ta réponse comme suit :
        1.  **Concept Clé :** Explique brièvement le concept principal du projet.
        2.  **Fonctionnalités Requises :** Liste les fonctionnalités essentielles à implémenter.
        3.  **Étapes de Réalisation (Python) :** Fournis une liste numérotée d'étapes claires pour construire le projet en Python. Suggère des bibliothèques utiles si nécessaire.
        4.  **Étapes de Réalisation (JavaScript) :** Fournis une liste numérotée d'étapes claires pour construire le projet en JavaScript (côté backend avec Node.js ou frontend). Suggère des bibliothèques ou des frameworks utiles si nécessaire.
        5.  **Pour Aller Plus Loin :** Propose quelques idées d'améliorations ou de fonctionnalités avancées.

        Sois encourageant et donne des conseils pratiques. Ne fournis PAS de blocs de code complets, mais plutôt des indications sur la logique à implémenter.
    `;

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error calling Gemini API for project steps:", error);
        throw new Error("Failed to get a valid response from the AI model for project steps.");
    }
}