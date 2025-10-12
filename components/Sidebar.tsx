
import React from 'react';
import type { Chapter, Lesson, View } from '../types';
import { CodeIcon } from './icons/CodeIcon';
import { LightBulbIcon } from './icons/LightBulbIcon';
import { CheckIcon } from './icons/CheckIcon';

interface SidebarProps {
  courseStructure: Chapter[];
  completedLessons: Set<string>;
  currentLesson: Lesson | null;
  onSelectLesson: (lesson: Lesson) => void;
  onSelectView: (view: View) => void;
  currentView: View;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  courseStructure,
  completedLessons,
  currentLesson,
  onSelectLesson,
  onSelectView,
  currentView,
  isOpen,
  onClose,
}) => {
  const isProjectView = currentView === 'projects';

  const handleLessonClick = (lesson: Lesson) => {
    onSelectLesson(lesson);
    onSelectView('lesson');
    onClose();
  };

  const handleProjectClick = () => {
    onSelectView('projects');
    onClose();
  }

  return (
    <>
      <aside
        className={`fixed top-0 left-0 z-40 w-64 h-screen bg-gray-50 dark:bg-gray-800 transition-transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:static lg:flex-shrink-0`}
      >
        <div className="h-full px-3 py-4 overflow-y-auto">
          <div className="flex items-center pl-2.5 mb-5">
            <CodeIcon className="w-8 h-8 mr-3 text-blue-600 dark:text-blue-500" />
            <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
              Py-JS Mentor
            </span>
          </div>
          <ul className="space-y-2 font-medium">
            <li>
              <button
                onClick={handleProjectClick}
                className={`flex items-center p-2 rounded-lg w-full text-left ${
                  isProjectView
                    ? 'bg-blue-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                    : 'text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <LightBulbIcon className="w-5 h-5 mr-3" />
                <span>Idées de Projets</span>
              </button>
            </li>
          </ul>
          <div className="pt-4 mt-4 space-y-2 font-medium border-t border-gray-200 dark:border-gray-700">
            {courseStructure.map((chapter) => (
              <div key={chapter.id}>
                <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase dark:text-gray-400">
                  {chapter.title}
                </h3>
                <ul className="mt-2 space-y-1">
                  {chapter.lessons.map((lesson) => (
                    <li key={lesson.id}>
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handleLessonClick(lesson);
                        }}
                        className={`flex items-center p-2 rounded-lg ${
                          currentLesson?.id === lesson.id && !isProjectView
                            ? 'bg-blue-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                            : 'text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                      >
                        <span className="flex-1 ml-3 whitespace-nowrap">{lesson.title}</span>
                        {completedLessons.has(lesson.id) && (
                          <CheckIcon className="w-5 h-5 text-green-500 dark:text-green-400" />
                        )}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </aside>
      {isOpen && <div onClick={onClose} className="fixed inset-0 z-30 bg-black/50 lg:hidden"></div>}
    </>
  );
};
