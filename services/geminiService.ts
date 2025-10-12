import { GoogleGenAI, Type } from "@google/genai";
import type { CourseContent, ProjectIdea } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // This is a fallback for development and will be visible in the UI.
  // In a real production environment, the key should always be present.
  console.error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const generationConfig = {
  temperature: 0.7,
  topP: 0.95,
  topK: 64,
};

const safetySettings = [
    {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
    },
    {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
    },
    {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
    },
    {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
    },
];

const lessonSchema = {
  type: Type.OBJECT,
  properties: {
    python: {
      type: Type.OBJECT,
      properties: {
        explanation: {
          type: Type.STRING,
          description: "Une explication claire et concise du concept en Python, adaptée à un débutant absolu. Utiliser markdown pour le formatage."
        },
        code: {
          type: Type.STRING,
          description: "Un extrait de code Python simple et exécutable démontrant le concept. Le code doit être bien commenté."
        },
      },
      required: ["explanation", "code"]
    },
    javascript: {
      type: Type.OBJECT,
      properties: {
        explanation: {
          type: Type.STRING,
          description: "Une explication claire et concise du concept en JavaScript, adaptée à un débutant absolu. Utiliser markdown pour le formatage. Mettre en évidence les similitudes et les différences avec Python."
        },
        code: {
          type: Type.STRING,
          description: "Un extrait de code JavaScript simple et exécutable démontrant le concept. Le code doit être bien commenté."
        },
      },
      required: ["explanation", "code"]
    }
  },
  required: ["python", "javascript"]
};

const projectIdeasSchema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        title: {
          type: Type.STRING,
          description: 'Un titre accrocheur et descriptif pour l\'idée de projet.'
        },
        description: {
          type: Type.STRING,
          description: 'Un bref résumé d\'un paragraphe du projet, expliquant son but et ses fonctionnalités principales. Adapté à un développeur de niveau intermédiaire.'
        },
        technologies: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: 'Une liste des principales bibliothèques ou frameworks Python et JavaScript à utiliser (ex: React, Django, Node.js, Pandas).'
        }
      },
      required: ["title", "description", "technologies"]
    }
};


export const fetchLessonContent = async (lessonTitle: string): Promise<CourseContent> => {
  if (!API_KEY) {
    throw new Error("La clé API Gemini n'est pas configurée.");
  }
  
  const prompt = `Vous êtes un instructeur expert en programmation créant un cours comparatif sur Python et JavaScript pour les débutants absolus.
Votre tâche est d'expliquer le concept de "${lessonTitle}".
Fournissez une explication claire et simple ainsi qu'un exemple de code pour les deux langages, côte à côte.
Concentrez-vous sur l'idée principale et évitez les détails trop complexes. Le ton doit être encourageant et facile à comprendre.
Expliquez d'abord Python, puis JavaScript, en soulignant les principales similitudes et différences.
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        ...generationConfig,
        responseMimeType: "application/json",
        responseSchema: lessonSchema,
        // FIX: `safetySettings` is part of the `config` object, not a top-level parameter.
        safetySettings: safetySettings,
      },
    });
    const jsonText = response.text.trim();
    return JSON.parse(jsonText) as CourseContent;
  } catch (error) {
    console.error("Error fetching lesson content from Gemini:", error);
    throw new Error("Échec du chargement du contenu de la leçon. Veuillez vérifier votre clé API et réessayer.");
  }
};

export const fetchProjectIdeas = async (): Promise<ProjectIdea[]> => {
    if (!API_KEY) {
        throw new Error("La clé API Gemini n'est pas configurée.");
    }

    const prompt = `Vous êtes un mentor technique qui réfléchit à des idées de projets. 
    Générez 5 idées de projets innovantes et intéressantes pour un développeur qui vient de terminer un cours pour débutants en Python et JavaScript et qui a un niveau intermédiaire. 
    Pour chaque projet, fournissez un titre, une courte description et une liste de technologies suggérées (mélangeant des bibliothèques/frameworks Python et JavaScript).
    Les projets doivent être stimulants mais réalisables.`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                ...generationConfig,
                responseMimeType: "application/json",
                responseSchema: projectIdeasSchema,
                // FIX: `safetySettings` is part of the `config` object, not a top-level parameter.
                safetySettings: safetySettings,
            },
        });
        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as ProjectIdea[];
    } catch (error) {
        console.error("Error fetching project ideas from Gemini:", error);
        throw new Error("Échec du chargement des idées de projet. Veuillez vérifier votre clé API et réessayer.");
    }
};