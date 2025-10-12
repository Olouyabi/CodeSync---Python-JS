import React, { useState } from 'react';
import type { ProjectIdea } from '../types';
import { StarIcon } from './icons/StarIcon';
import { ChevronDownIcon } from './icons/ChevronDownIcon';
import { generateProjectSteps } from '../services/geminiService';

interface ProjectIdeasViewProps {
  ideas: ProjectIdea[];
  isLoading: boolean;
  error: string | null;
}

const ProjectCard: React.FC<{ idea: ProjectIdea }> = ({ idea }) => {
    const [steps, setSteps] = useState<string | null>(null);
    const [isLoadingSteps, setIsLoadingSteps] = useState(false);
    const [errorSteps, setErrorSteps] = useState<string | null>(null);
    const [isExpanded, setIsExpanded] = useState(false);

    const getDifficultyClass = (difficulty: string) => {
        switch (difficulty.toLowerCase()) {
            case 'facile':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
            case 'moyen':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
            case 'difficile':
                return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
        }
    };

    const handleToggleSteps = () => {
        const shouldExpand = !isExpanded;
        setIsExpanded(shouldExpand);

        if (shouldExpand && !steps) {
            setIsLoadingSteps(true);
            setErrorSteps(null);
            generateProjectSteps(idea.title, idea.description)
                .then(generatedSteps => {
                    setSteps(generatedSteps);
                })
                .catch(() => {
                    setErrorSteps("Impossible de générer les étapes. Veuillez réessayer.");
                })
                .finally(() => {
                    setIsLoadingSteps(false);
                });
        }
    };
    
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md flex flex-col border border-gray-200 dark:border-gray-700">
            <div className="p-4 flex-grow">
                 <span className={`inline-block mb-2 px-2 py-1 text-xs font-semibold rounded-full ${getDifficultyClass(idea.difficulty)}`}>
                    {idea.difficulty}
                 </span>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">{idea.title}</h3>
                <p className="mt-2 text-gray-600 dark:text-gray-300 text-sm">
                    {idea.description}
                </p>
            </div>
            
            <div className="border-t border-gray-200 dark:border-gray-700 mt-auto">
                <button
                    onClick={handleToggleSteps}
                    className="w-full flex justify-between items-center text-left font-semibold text-blue-600 dark:text-blue-400 p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                >
                    <span>{isExpanded ? 'Masquer les étapes' : 'Voir les étapes de réalisation'}</span>
                    <ChevronDownIcon className={`w-5 h-5 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                </button>
            </div>

            {isExpanded && (
                <div className="border-t border-gray-200 dark:border-gray-700 p-4">
                    {isLoadingSteps && (
                        <div className="flex items-center justify-center py-4">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                            <span className="ml-3 text-gray-500 dark:text-gray-400">Génération des étapes...</span>
                        </div>
                    )}
                    {errorSteps && <p className="text-red-500 text-center py-4">{errorSteps}</p>}
                    {steps && (
                        <div className="text-sm text-gray-700 dark:text-gray-300" style={{ whiteSpace: 'pre-wrap' }}>
                           {steps}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};


export const ProjectIdeasView: React.FC<ProjectIdeasViewProps> = ({ ideas, isLoading, error }) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center text-red-500 dark:text-red-400 p-4">
        <h2 className="text-2xl font-bold">Erreur</h2>
        <p className="mt-2">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Idées de Projets</h1>
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
        Mettez vos nouvelles compétences en pratique ! Voici quelques idées de projets pour vous lancer, inspirées de problèmes réels.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
          {ideas.map((idea, index) => (
              <ProjectCard key={index} idea={idea} />
          ))}
      </div>
      
       {ideas.length === 0 && !isLoading && (
        <div className="flex flex-col items-center justify-center h-64 text-center text-gray-500 dark:text-gray-400">
          <StarIcon className="w-12 h-12 mb-4" />
          <h2 className="text-xl font-bold">Aucune idée de projet pour le moment.</h2>
          <p className="mt-2">Revenez plus tard ou essayez de rafraîchir.</p>
        </div>
      )}
    </div>
  );
};