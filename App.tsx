
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { CourseView } from './components/CourseView';
import { ProjectIdeasView } from './components/ProjectIdeasView';
import { useDarkMode } from './hooks/useDarkMode';
import { COURSE_STRUCTURE } from './constants';
import type { Lesson } from './types';

const App: React.FC = () => {
  const [theme, toggleTheme] = useDarkMode();
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const allLessons = useMemo(() => COURSE_STRUCTURE.flatMap(chapter => chapter.lessons), []);
  
  const [currentLessonId, setCurrentLessonId] = useState<string>(() => {
    return localStorage.getItem('currentLessonId') || allLessons[0]?.id || '';
  });

  const [completedLessons, setCompletedLessons] = useState<Set<string>>(() => {
    const savedProgress = localStorage.getItem('completedLessons');
    return savedProgress ? new Set(JSON.parse(savedProgress)) : new Set();
  });

  useEffect(() => {
    localStorage.setItem('currentLessonId', currentLessonId);
  }, [currentLessonId]);

  useEffect(() => {
    localStorage.setItem('completedLessons', JSON.stringify(Array.from(completedLessons)));
  }, [completedLessons]);

  const handleSelectLesson = useCallback((lessonId: string) => {
    setCurrentLessonId(lessonId);
  }, []);

  const handleCompleteLesson = useCallback((lessonId: string) => {
    setCompletedLessons(prev => new Set(prev).add(lessonId));
  }, []);

  const currentLessonIndex = useMemo(() => allLessons.findIndex(lesson => lesson.id === currentLessonId), [allLessons, currentLessonId]);
  
  const currentLesson = useMemo(() => allLessons[currentLessonIndex], [allLessons, currentLessonIndex]);

  const handleNextLesson = useCallback(() => {
    if (currentLessonIndex < allLessons.length - 1) {
      setCurrentLessonId(allLessons[currentLessonIndex + 1].id);
    }
  }, [currentLessonIndex, allLessons]);
  
  const handlePrevLesson = useCallback(() => {
    if (currentLessonIndex > 0) {
      setCurrentLessonId(allLessons[currentLessonIndex - 1].id);
    }
  }, [currentLessonIndex, allLessons]);

  const progress = useMemo(() => {
    const projectLessonId = allLessons.find(l => l.title === 'Project Ideas')?.id;
    const lessonsForProgress = allLessons.filter(l => l.id !== projectLessonId);
    if (lessonsForProgress.length === 0) return 0;
    
    const completedCount = Array.from(completedLessons).filter(id => id !== projectLessonId).length;
    return Math.round((completedCount / lessonsForProgress.length) * 100);
  }, [completedLessons, allLessons]);

  const isProjectView = currentLesson?.title === 'Project Ideas';

  return (
    <div className={`flex h-screen font-sans antialiased text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-900 transition-colors duration-300 ${theme}`}>
      <Sidebar
        currentLessonId={currentLessonId}
        completedLessons={completedLessons}
        onSelectLesson={handleSelectLesson}
        isOpen={isSidebarOpen}
        setIsOpen={setSidebarOpen}
      />
      <div className="flex-1 flex flex-col w-full">
        <Header
          progress={progress}
          theme={theme}
          toggleTheme={toggleTheme}
          onToggleSidebar={() => setSidebarOpen(!isSidebarOpen)}
          lessonTitle={currentLesson?.title || 'CodeSync'}
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {isProjectView ? (
            <ProjectIdeasView />
          ) : (
            currentLesson && (
              <CourseView
                key={currentLesson.id}
                lesson={currentLesson}
                onComplete={handleCompleteLesson}
                onNext={handleNextLesson}
                onPrev={handlePrevLesson}
                isFirst={currentLessonIndex === 0}
                isLast={currentLessonIndex === allLessons.length - 1}
                isCompleted={completedLessons.has(currentLesson.id)}
              />
            )
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
