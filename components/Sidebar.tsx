import React from 'react';
import { COURSE_STRUCTURE } from '../constants';
import type { Lesson, View } from '../types';
import { CodeIcon } from './icons/CodeIcon';
import { StarIcon } from './icons/StarIcon';
import { XIcon } from './icons/XIcon';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  selectedLesson: Lesson | null;
  onSelectLesson: (lesson: Lesson) => void;
  currentView: View;
  onSetView: (view: View) => void;
  completedLessons: Set<string>;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  selectedLesson,
  onSelectLesson,
  currentView,
  onSetView,
  completedLessons,
}) => {
  const handleLessonClick = (lesson: Lesson) => {
    onSetView('course');
    onSelectLesson(lesson);
    onClose();
  };

  const handleProjectIdeasClick = () => {
    onSetView('projects');
    onClose();
  };

  const sidebarContent = (
    <>
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <CodeIcon className="w-8 h-8 text-blue-500" />
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">Py & JS 101</h2>
        </div>
        <button onClick={onClose} className="lg:hidden text-gray-500 dark:text-gray-400">
          <XIcon className="w-6 h-6" />
        </button>
      </div>
      <nav className="flex-grow p-4 overflow-y-auto">
        <ul>
          {COURSE_STRUCTURE.map((chapter) => (
            <li key={chapter.id} className="mb-4">
              <h3 className="px-2 py-1 text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {chapter.title}
              </h3>
              <ul>
                {chapter.lessons.map((lesson) => (
                  <li key={lesson.id}>
                    <button
                      onClick={() => handleLessonClick(lesson)}
                      className={`w-full text-left flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        selectedLesson?.id === lesson.id && currentView === 'course'
                          ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${
                          completedLessons.has(lesson.id) ? 'bg-green-500' : 'bg-gray-400 dark:bg-gray-600'
                        }`}
                      ></span>
                      <span>{lesson.title}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </li>
          ))}
           <li className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4">
               <button
                  onClick={handleProjectIdeasClick}
                  className={`w-full text-left flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentView === 'projects'
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
               >
                 <StarIcon className="w-5 h-5" />
                 <span>Idées de Projets</span>
               </button>
           </li>
        </ul>
      </nav>
    </>
  );

  return (
    <>
      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity lg:hidden ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      ></div>
      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-40 flex flex-col transform transition-transform lg:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-72 flex-shrink-0 border-r border-gray-200 dark:border-gray-700">
        {sidebarContent}
      </aside>
    </>
  );
};
