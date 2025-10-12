
import React from 'react';
import type { ProjectIdea } from '../types';
import { StarIcon } from './icons/StarIcon';

interface ProjectIdeasViewProps {
    ideas: ProjectIdea[];
    isLoading: boolean;
    error: string | null;
}

const DifficultyBadge: React.FC<{ difficulty: string }> = ({ difficulty }) => {
    const colorClasses: { [key: string]: string } = {
        'Facile': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
        'Moyen': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
        'Difficile': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    };
    const className = colorClasses[difficulty] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    return <span className={`px-2 py-1 text-xs font-medium rounded-full ${className}`}>{difficulty}</span>;
};


export const ProjectIdeasView: React.FC<ProjectIdeasViewProps> = ({ ideas, isLoading, error }) => {
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
                <p className="ml-4 text-lg text-gray-600 dark:text-gray-300">Génération d'idées de projets...</p>
            </div>
        );
    }

    if (error) {
        return (
             <div className="flex flex-col items-center justify-center h-full text-center text-red-500 dark:text-red-400">
                <h2 className="text-2xl font-bold">Erreur</h2>
                <p className="mt-2">{error}</p>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-6 lg:p-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Idées de Projets</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {ideas.map((idea, index) => (
                    <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex flex-col">
                        <div className="flex-grow">
                            <div className="flex justify-between items-start mb-2">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{idea.title}</h2>
                                <StarIcon className="w-6 h-6 text-yellow-400" />
                            </div>
                            <p className="text-gray-600 dark:text-gray-300 mb-4">{idea.description}</p>
                        </div>
                        <div className="mt-auto">
                            <DifficultyBadge difficulty={idea.difficulty} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
