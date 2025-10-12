
import React from 'react';
import { CodeBlock } from './CodeBlock';
import type { Lesson, LessonContent } from '../types';
import { PythonIcon } from './icons/PythonIcon';
import { JavaScriptIcon } from './icons/JavaScriptIcon';
import { TrophyIcon } from './icons/TrophyIcon';

interface CourseViewProps {
    lesson: Lesson | null;
    lessonContent: LessonContent | null;
    isLoading: boolean;
    isCompleted: boolean;
    onCompleteLesson: () => void;
    onTakeQuiz: () => void;
}

export const CourseView: React.FC<CourseViewProps> = ({
    lesson,
    lessonContent,
    isLoading,
    isCompleted,
    onCompleteLesson,
    onTakeQuiz,
}) => {
    if (!lesson) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 dark:text-gray-400">
                <h2 className="text-2xl font-bold">Bienvenue sur Py-JS Mentor !</h2>
                <p className="mt-2">Sélectionnez une leçon dans le menu de gauche pour commencer.</p>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!lessonContent) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center text-red-500 dark:text-red-400">
                <h2 className="text-2xl font-bold">Erreur</h2>
                <p className="mt-2">Impossible de charger le contenu de la leçon. Veuillez réessayer.</p>
            </div>
        );
    }

    const slugify = (text: string) =>
        text
            .toLowerCase()
            .replace(/\s+/g, '_') // Replace spaces with _
            .replace(/[^\w-]+/g, ''); // Remove all non-word chars

    const fileName = slugify(lesson.title);

    return (
        <div className="p-4 md:p-6 lg:p-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{lesson.title}</h1>

            <div className="prose dark:prose-invert max-w-none mb-8" dangerouslySetInnerHTML={{ __html: lessonContent.explanation.replace(/\n/g, '<br />') }} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                    <h2 className="text-xl font-semibold flex items-center mb-2 dark:text-white">
                        <PythonIcon className="w-6 h-6 mr-2" />
                        Exemple Python
                    </h2>
                    <CodeBlock code={lessonContent.pythonCode} language="python" fileName={fileName} />
                </div>
                <div>
                    <h2 className="text-xl font-semibold flex items-center mb-2 dark:text-white">
                        <JavaScriptIcon className="w-6 h-6 mr-2" />
                        Exemple JavaScript
                    </h2>
                    <CodeBlock code={lessonContent.jsCode} language="javascript" fileName={fileName} />
                </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-4">
                <button
                    onClick={onTakeQuiz}
                    className="px-6 py-2 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
                >
                    Tester mes connaissances
                </button>
                {!isCompleted && (
                    <button
                        onClick={onCompleteLesson}
                        className="px-6 py-2 font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 flex items-center"
                    >
                       <TrophyIcon className="w-5 h-5 mr-2" />
                        Marquer comme terminé
                    </button>
                )}
            </div>
        </div>
    );
};
