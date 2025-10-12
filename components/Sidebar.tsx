
import React from 'react';
import { COURSE_STRUCTURE } from '../constants';
import type { Chapter, Lesson } from '../types';
import { CheckIcon } from './icons/CheckIcon';
import { CodeIcon } from './icons/CodeIcon';

interface SidebarProps {
  currentLessonId: string;
  completedLessons: Set<string>;
  onSelectLesson: (lessonId: string) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentLessonId,
  completedLessons,
  onSelectLesson,
  isOpen,
  setIsOpen,
}) => {
  return (
    <>
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity lg:hidden ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
      ></div>
      <aside
        className={`absolute lg:relative z-40 flex flex-col w-72 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-transform transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 h-full flex-shrink-0`}
      >
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center space-x-2">
            <CodeIcon className="w-8 h-8 text-blue-500"/>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">CodeSync</h1>
        </div>
        <nav className="flex-1 overflow-y-auto p-4">
          <ul>
            {COURSE_STRUCTURE.map((chapter: Chapter) => (
              <li key={chapter.id} className="mb-6">
                <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                  {chapter.title}
                </h2>
                <ul>
                  {chapter.lessons.map((lesson: Lesson) => {
                    const isCompleted = completedLessons.has(lesson.id);
                    const isActive = currentLessonId === lesson.id;
                    return (
                      <li key={lesson.id}>
                        <button
                          onClick={() => {
                            onSelectLesson(lesson.id)
                            setIsOpen(false)
                          }}
                          className={`w-full text-left p-2 rounded-md flex items-center justify-between text-sm transition-colors duration-200 ${
                            isActive
                              ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-semibold'
                              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                          }`}
                        >
                          <span>{lesson.title}</span>
                          {isCompleted && <CheckIcon className="w-4 h-4 text-green-500" />}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
};
