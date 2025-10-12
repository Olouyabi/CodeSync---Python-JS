import React, { useState, useEffect } from 'react';
import type { QuizQuestion } from '../types';
import { XIcon } from './icons/XIcon';

interface QuizModalProps {
  lessonTitle: string;
  questions: QuizQuestion[] | null;
  isLoading: boolean;
  onClose: () => void;
  onQuizComplete: () => void;
}

export const QuizModal: React.FC<QuizModalProps> = ({ lessonTitle, questions, isLoading, onClose, onQuizComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [isQuizFinished, setIsQuizFinished] = useState(false);

  useEffect(() => {
    if (!isLoading) {
        setCurrentQuestionIndex(0);
        setSelectedAnswer(null);
        setShowFeedback(false);
        setScore(0);
        setIsQuizFinished(false);
    }
  }, [isLoading]);

  const handleAnswerSelect = (option: string) => {
    if (showFeedback) return;
    setSelectedAnswer(option);
  };

  const handleSubmit = () => {
    if (!selectedAnswer || !questions) return;

    if (selectedAnswer === questions[currentQuestionIndex].correctAnswer) {
      setScore(score + 1);
    }
    setShowFeedback(true);
  };

  const handleNextQuestion = () => {
    setShowFeedback(false);
    setSelectedAnswer(null);

    if (questions && currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setIsQuizFinished(true);
      onQuizComplete();
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
            <p className="ml-4 text-lg text-gray-600 dark:text-gray-300">Préparation du quiz...</p>
        </div>
      );
    }

    if (isQuizFinished) {
      return (
        <div className="text-center p-8">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Quiz Terminé !</h3>
          <p className="text-lg mt-4 text-gray-700 dark:text-gray-300">
            Votre score : {score} / {questions?.length}
          </p>
          <button
            onClick={onClose}
            className="mt-8 px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
          >
            Fermer
          </button>
        </div>
      );
    }

    if (!questions || questions.length === 0) {
         return (
             <div className="text-center p-8 text-red-500">
                 <h3 className="text-xl font-bold">Erreur</h3>
                 <p>Impossible de charger les questions du quiz.</p>
             </div>
         )
    }

    const currentQuestion = questions[currentQuestionIndex];

    return (
      <>
        <div className="p-6">
          <p className="font-semibold text-gray-500 dark:text-gray-400">
            Question {currentQuestionIndex + 1} / {questions.length}
          </p>
          <h3 className="text-lg font-bold mt-2 text-gray-900 dark:text-white">{currentQuestion.question}</h3>
          <div className="mt-4 space-y-3">
            {currentQuestion.options.map((option, index) => {
              const isCorrect = option === currentQuestion.correctAnswer;
              const isSelected = option === selectedAnswer;
              let buttonClass = 'w-full text-left p-3 rounded-lg border-2 transition-colors ';
              
              if (showFeedback) {
                if (isCorrect) {
                   buttonClass += 'bg-green-100 border-green-400 text-green-800 dark:bg-green-900 dark:text-green-300 dark:border-green-600';
                } else if (isSelected) {
                   buttonClass += 'bg-red-100 border-red-400 text-red-800 dark:bg-red-900 dark:text-red-300 dark:border-red-600';
                } else {
                    buttonClass += 'bg-gray-100 dark:bg-gray-700 border-transparent text-gray-700 dark:text-gray-300';
                }
              } else {
                 buttonClass += isSelected 
                   ? 'bg-blue-100 border-blue-500 dark:bg-blue-900 dark:border-blue-500'
                   : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600';
              }

              return (
                <button key={index} onClick={() => handleAnswerSelect(option)} className={buttonClass} disabled={showFeedback}>
                  {option}
                </button>
              );
            })}
          </div>
        </div>
        {showFeedback && (
          <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-b-lg">
            <p className={`font-bold ${selectedAnswer === currentQuestion.correctAnswer ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {selectedAnswer === currentQuestion.correctAnswer ? 'Bonne réponse !' : 'Mauvaise réponse.'}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{currentQuestion.explanation}</p>
          </div>
        )}
        <div className="p-4 flex justify-end bg-gray-100 dark:bg-gray-700/50">
          {showFeedback ? (
            <button onClick={handleNextQuestion} className="px-5 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700">
                {currentQuestionIndex < questions.length - 1 ? 'Question suivante' : 'Terminer le quiz'}
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={!selectedAnswer} className="px-5 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 dark:disabled:bg-gray-600">
                Valider
            </button>
          )}
        </div>
      </>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl mx-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Quiz: {lessonTitle}</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
             <XIcon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
          </button>
        </div>
        {renderContent()}
      </div>
    </div>
  );
};
