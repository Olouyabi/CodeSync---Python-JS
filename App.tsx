import React, { useState, useMemo, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { CourseView } from './components/CourseView';
import { ProjectIdeasView } from './components/ProjectIdeasView';
import { useDarkMode } from './hooks/useDarkMode';
import type { Lesson, View } from './types';
import { COURSE_STRUCTURE } from './constants';

const App: React.FC = () => {
  const [theme, toggleTheme] = useDarkMode();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [view, setView] = useState<View>('course');
  
  // Flatten lessons for easy lookup
  const allLessons = useMemo(() => COURSE_STRUCTURE.flatMap(ch => ch.lessons.map(l => ({...l, chapterId: ch.id}))), []);
  
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(() => {
    if (typeof window !== 'undefined') {
        const savedLessonId = localStorage.getItem('selectedLessonId');
        return allLessons.find(l => l.id === savedLessonId) || allLessons[0] || null;
    }
    return allLessons[0] || null;
  });

  const [completedLessons, setCompletedLessons] = useState<Set<string>>(() => {
    if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('completedLessons');
        return saved ? new Set(JSON.parse(saved)) : new Set();
    }
    return new Set();
  });

  const handleSelectLesson = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    const newCompleted = new Set(completedLessons);
    newCompleted.add(lesson.id);
    setCompletedLessons(newCompleted);
  };
  
  // Persist state to localStorage
  useEffect(() => {
    if(selectedLesson) {
        localStorage.setItem('selectedLessonId', selectedLesson.id);
    }
    localStorage.setItem('completedLessons', JSON.stringify(Array.from(completedLessons)));
  }, [selectedLesson, completedLessons]);

  const progress = useMemo(() => {
    if (allLessons.length === 0) return 0;
    return Math.round((completedLessons.size / allLessons.length) * 100);
  }, [completedLessons, allLessons]);
  
  const getLessonTitle = () => {
    if (view === 'projects') return 'Idées de Projets';
    if (selectedLesson) return selectedLesson.title;
    return 'Bienvenue';
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 font-sans">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setSidebarOpen(false)}
        selectedLesson={selectedLesson}
        onSelectLesson={handleSelectLesson}
        currentView={view}
        onSetView={setView}
        completedLessons={completedLessons}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          progress={progress}
          theme={theme}
          toggleTheme={toggleTheme}
          onToggleSidebar={() => setSidebarOpen(!isSidebarOpen)}
          lessonTitle={getLessonTitle()}
        />
        <main className="flex-1 overflow-y-auto">
            {view === 'course' ? (
                <CourseView selectedLesson={selectedLesson} />
            ) : (
                <ProjectIdeasView />
            )}
        </main>
      </div>
    </div>
  );
};

export default App;