import React, { useState, useEffect } from 'react';
import { fetchLessonContent } from '../services/geminiService';
import type { CourseContent, Lesson } from '../types';
import { PythonIcon } from './icons/PythonIcon';
import { JavaScriptIcon } from './icons/JavaScriptIcon';
import { CodeBlock } from './CodeBlock';

interface CourseViewProps {
  lesson: Lesson;
  onComplete: (lessonId: string) => void;
  onNext: () => void;
  onPrev: () => void;
  isFirst: boolean;
  isLast: boolean;
  isCompleted: boolean;
}

const LoadingSkeleton: React.FC = () => (
    <div className="animate-pulse grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
            <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
            <div className="space-y-2">
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-5/6"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
            </div>
            <div className="h-40 bg-gray-300 dark:bg-gray-700 rounded mt-6"></div>
        </div>
        <div>
            <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
            <div className="space-y-2">
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-5/6"></div>
            </div>
            <div className="h-40 bg-gray-300 dark:bg-gray-700 rounded mt-6"></div>
        </div>
    </div>
);

export const CourseView: React.FC<CourseViewProps> = ({ lesson, onComplete, onNext, onPrev, isFirst, isLast, isCompleted }) => {
  const [content, setContent] = useState<CourseContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadContent = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const fetchedContent = await fetchLessonContent(lesson.title);
        setContent(fetchedContent);
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
    loadContent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lesson.id]);

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return (
      <div className="text-center text-red-500 bg-red-100 dark:bg-red-900/20 p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-2">Oups ! Quelque chose s'est mal passé.</h2>
        <p>{error}</p>
        <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">Veuillez vous assurer que votre clé API Gemini est correctement configurée dans les variables d'environnement.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Python Column */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <div className="flex items-center mb-4">
            <PythonIcon className="w-8 h-8 mr-3" />
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Python</h2>
          </div>
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none text-gray-600 dark:text-gray-300" dangerouslySetInnerHTML={{ __html: content?.python?.explanation || ""}}></div>
          <CodeBlock language="python" code={content?.python?.code || ''} />
        </div>

        {/* JavaScript Column */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <div className="flex items-center mb-4">
            <JavaScriptIcon className="w-8 h-8 mr-3 rounded" />
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">JavaScript</h2>
          </div>
           <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none text-gray-600 dark:text-gray-300" dangerouslySetInnerHTML={{ __html: content?.javascript?.explanation || ""}}></div>
          <CodeBlock language="javascript" code={content?.javascript?.code || ''} />
        </div>
      </div>

      {/* Navigation */}
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          onClick={onPrev}
          disabled={isFirst}
          className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
        >
          Précédent
        </button>
        <button
          onClick={() => onComplete(lesson.id)}
          disabled={isCompleted}
          className="px-8 py-3 rounded-md text-base font-semibold text-white transition-colors w-full sm:w-auto
            bg-green-600 hover:bg-green-700 disabled:bg-green-400 dark:disabled:bg-green-800 disabled:cursor-not-allowed disabled:text-gray-200 dark:disabled:text-gray-400"
        >
          {isCompleted ? 'Terminé !' : 'Marquer comme terminé'}
        </button>
        <button
          onClick={onNext}
          disabled={isLast}
          className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
        >
          Suivant
        </button>
      </div>
    </div>
  );
};