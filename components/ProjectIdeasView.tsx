import React, { useState, useEffect } from 'react';
import { fetchProjectIdeas } from '../services/geminiService';
import type { ProjectIdea } from '../types';
import { LightBulbIcon } from './icons/LightBulbIcon';
import { CodeIcon } from './icons/CodeIcon';

const ProjectCardSkeleton: React.FC = () => (
    <div className="animate-pulse bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
        <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-2/3 mb-3"></div>
        <div className="space-y-2 mb-4">
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-5/6"></div>
        </div>
        <div className="flex flex-wrap gap-2">
            <div className="h-6 w-16 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
            <div className="h-6 w-20 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
            <div className="h-6 w-24 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
        </div>
    </div>
);

export const ProjectIdeasView: React.FC = () => {
    const [ideas, setIdeas] = useState<ProjectIdea[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadIdeas = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const fetchedIdeas = await fetchProjectIdeas();
                setIdeas(fetchedIdeas);
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError("Une erreur inconnue est survenue.");
                }
            } finally {
                setIsLoading(false);
            }
        };
        loadIdeas();
    }, []);

    return (
        <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
                <LightBulbIcon className="w-16 h-16 text-yellow-400 mx-auto mb-4"/>
                <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">Félicitations !</h1>
                <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">Vous avez terminé le cours. Voici quelques idées de projets innovants pour appliquer vos nouvelles compétences.</p>
            </div>

            {isLoading && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[...Array(3)].map((_, i) => <ProjectCardSkeleton key={i} />)}
                </div>
            )}

            {error && (
                <div className="text-center text-red-500 bg-red-100 dark:bg-red-900/20 p-6 rounded-lg max-w-2xl mx-auto">
                    <h2 className="text-xl font-bold mb-2">Impossible de récupérer les idées de projets.</h2>
                    <p>{error}</p>
                </div>
            )}

            {!isLoading && !error && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {ideas.map((idea, index) => (
                        <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col">
                           <div className="flex items-start mb-3">
                             <CodeIcon className="w-6 h-6 text-blue-500 mr-3 flex-shrink-0 mt-1"/>
                             <h3 className="text-xl font-bold text-gray-900 dark:text-white">{idea.title}</h3>
                           </div>
                            <p className="text-gray-600 dark:text-gray-300 mb-4 flex-grow">{idea.description}</p>
                            <div className="flex flex-wrap gap-2">
                                {idea.technologies.map((tech, i) => (
                                    <span key={i} className="bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 text-xs font-medium px-2.5 py-1 rounded-full">
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};