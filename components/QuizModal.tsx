import React, { useState } from 'react';
import type { QuizQuestion } from '../types';
import { XIcon } from './icons/XIcon';
import { TrophyIcon } from './icons/TrophyIcon';

interface QuizModalProps {
  questions: QuizQuestion[];
  lessonTitle: string;
  onClose: () => void;
}

export const QuizModal: React.FC<QuizModalProps> = ({ questions, lessonTitle, onClose }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(string | null)[]>(Array(questions.length).fill(null));
  const [showResults, setShowResults] = useState(false);

  const handleAnswerSelect = (answer: string) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIndex] = answer;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowResults(true);
    }
  };
  
  const score = selectedAnswers.reduce((total, answer, index) => {
      return answer === questions[index].correctAnswer ? total + 1 : total;
  }, 0);

  const renderQuestion = () => {
    const question = questions[currentQuestionIndex];
    const selectedAnswer = selectedAnswers[currentQuestionIndex];

    return (
      <div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          Question {currentQuestionIndex + 1}/{questions.length}
        </h3>
        <p className="text-gray-700 dark:text-gray-300 mb-6">{question.question}</p>
        <div className="space-y-3">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(option)}
              className={`w-full text-left p-3 rounded-lg border-2 transition-colors ${
                selectedAnswer === option
                  ? 'bg-blue-100 dark:bg-blue-900 border-blue-500'
                  : 'bg-gray-100 dark:bg-gray-700 border-transparent hover:border-blue-400'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
        <div className="mt-8 flex justify-end">
          <button
            onClick={handleNext}
            disabled={!selectedAnswer}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {currentQuestionIndex < questions.length - 1 ? 'Suivant' : 'Terminer'}
          </button>
        </div>
      </div>
    );
  };

  const renderResults = () => {
    return (
      <div className="text-center">
        <TrophyIcon className="w-16 h-16 mx-auto text-yellow-400 mb-4" />
        <h3 className="text-2xl font-bold text-gray-800 dark:text-white">Quiz Terminé !</h3>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
            Vous avez obtenu {score} sur {questions.length} bonnes réponses.
        </p>
        <div className="mt-8 text-left space-y-6 max-h-60 overflow-y-auto pr-4">
            {questions.map((q, index) => (
                <div key={index} className="p-4 rounded-lg bg-gray-100 dark:bg-gray-700">
                    <p className="font-semibold text-gray-800 dark:text-white">{q.question}</p>
                    <p className={`mt-2 ${selectedAnswers[index] === q.correctAnswer ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        Votre réponse : {selectedAnswers[index] ?? "Pas de réponse"}
                    </p>
                    {selectedAnswers[index] !== q.correctAnswer && <p className="text-gray-600 dark:text-gray-300">Réponse correcte : {q.correctAnswer}</p>}
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Explication :</span> {q.explanation}</p>
                </div>
            ))}
        </div>
        <button
          onClick={onClose}
          className="mt-8 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Fermer
        </button>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl p-6 relative animate-fade-in-up">
        <div className="flex justify-between items-center border-b pb-3 mb-4 border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Quiz : {lessonTitle}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
            <XIcon className="w-6 h-6" />
          </button>
        </div>
        {showResults ? renderResults() : renderQuestion()}
      </div>
    </div>
  );
};
