import React, { useState, useEffect, useCallback } from 'react';
import type { ProjectIdea } from '../types';
import { generateProjectIdeas } from '../services/geminiService';
import { StarIcon } from './icons/StarIcon';

const DifficultyBadge: React.FC<{ difficulty: ProjectIdea['difficulty'] }> = ({ difficulty }) => {
    const colorClasses = {
        'Facile': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
        'Moyen': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
        'Difficile': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    };
    return (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClasses[difficulty]}`}>
            {difficulty}
        </span>
    );
};

const LoadingSkeleton = () => (
    <div className="animate-pulse grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
                <div className="space-y-3">
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-5/6"></div>
                </div>
            </div>
        ))}
    </div>
);

export const ProjectIdeasView: React.FC = () => {
    const [ideas, setIdeas] = useState<ProjectIdea[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchIdeas = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const projectIdeas = await generateProjectIdeas();
            setIdeas(projectIdeas);
        } catch (err) {
            setError('Impossible de charger les idées de projets. Veuillez réessayer.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchIdeas();
    }, [fetchIdeas]);

    return (
        <div className="p-6 md:p-10 max-w-7xl mx-auto">
            <div className="text-center mb-10">
                 <StarIcon className="w-12 h-12 mx-auto text-yellow-400 mb-2" />
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">Idées de Projets</h1>
                <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">Mettez vos nouvelles compétences en pratique !</p>
            </div>
            
            {loading && <LoadingSkeleton />}
            {error && (
                <div className="text-center text-red-500">
                    <p>{error}</p>
                    <button onClick={fetchIdeas} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                        Réessayer
                    </button>
                </div>
            )}
            {!loading && !error && (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {ideas.map((idea, index) => (
                        <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex flex-col">
                            <div className="flex justify-between items-start mb-2">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{idea.title}</h2>
                                <DifficultyBadge difficulty={idea.difficulty} />
                            </div>
                            <p className="text-gray-600 dark:text-gray-400 flex-grow">{idea.description}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
