import React, { useState, useEffect, useCallback } from 'react';
import { generateLessonContent, generateQuiz } from '../services/geminiService';
import type { Lesson, LessonContent, QuizQuestion } from '../types';
import { CodeBlock } from './CodeBlock';
import { QuizModal } from './QuizModal';
import { LightBulbIcon } from './icons/LightBulbIcon';
import { PythonIcon } from './icons/PythonIcon';
import { JavaScriptIcon } from './icons/JavaScriptIcon';

interface CourseViewProps {
  selectedLesson: Lesson | null;
}

const LoadingSkeleton = () => (
  <div className="animate-pulse p-6 md:p-10 space-y-8">
    <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
    <div className="space-y-3">
      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-5/6"></div>
    </div>
    <div className="h-40 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
    <div className="h-40 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
  </div>
);


export const CourseView: React.FC<CourseViewProps> = ({ selectedLesson }) => {
  const [content, setContent] = useState<LessonContent | null>(null);
  const [quiz, setQuiz] = useState<QuizQuestion[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isQuizVisible, setIsQuizVisible] = useState(false);

  const fetchContent = useCallback(async (lesson: Lesson) => {
    setLoading(true);
    setError(null);
    setContent(null);
    setQuiz(null);
    try {
      const [lessonContent, quizQuestions] = await Promise.all([
        generateLessonContent(lesson.title),
        generateQuiz(lesson.title),
      ]);
      setContent(lessonContent);
      setQuiz(quizQuestions);
    } catch (err) {
      setError('Impossible de charger le contenu de la leçon. Veuillez réessayer.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (selectedLesson) {
      fetchContent(selectedLesson);
    }
  }, [selectedLesson, fetchContent]);

  if (!selectedLesson) {
    return (
      <div className="flex-grow flex items-center justify-center text-center p-10">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Bienvenue !</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Sélectionnez une leçon dans la barre latérale pour commencer.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-grow p-6 md:p-10 overflow-y-auto">
      {loading && <LoadingSkeleton />}
      {error && (
        <div className="text-center text-red-500">
          <p>{error}</p>
          <button onClick={() => fetchContent(selectedLesson)} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Réessayer
          </button>
        </div>
      )}
      {content && (
        <article className="prose dark:prose-invert max-w-none">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-6">{selectedLesson.title}</h1>
          
          <div dangerouslySetInnerHTML={{ __html: content.explanation.replace(/\n/g, '<br />') }} />

          <div className="flex items-center space-x-2 my-6">
            <PythonIcon className="w-6 h-6" />
            <h2 className="text-2xl font-semibold m-0">Exemple Python</h2>
          </div>
          <CodeBlock code={content.pythonCode} language="python" />

          <div className="flex items-center space-x-2 my-6">
            <JavaScriptIcon className="w-6 h-6 rounded" />
            <h2 className="text-2xl font-semibold m-0">Exemple JavaScript</h2>
          </div>
          <CodeBlock code={content.jsCode} language="javascript" />
        
          {quiz && quiz.length > 0 && (
             <div className="mt-12 text-center p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <LightBulbIcon className="w-10 h-10 mx-auto text-blue-500 mb-2" />
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">Testez vos connaissances !</h3>
                <p className="mt-2 text-gray-600 dark:text-gray-400">Prêt à voir ce que vous avez appris ?</p>
                <button 
                  onClick={() => setIsQuizVisible(true)}
                  className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Commencer le Quiz
                </button>
            </div>
          )}
        </article>
      )}
      {isQuizVisible && quiz && (
        <QuizModal 
          questions={quiz} 
          lessonTitle={selectedLesson.title}
          onClose={() => setIsQuizVisible(false)} 
        />
      )}
    </div>
  );
};
