
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { CourseView } from './components/CourseView';
import { ProjectIdeasView } from './components/ProjectIdeasView';
import { QuizModal } from './components/QuizModal';
import { useDarkMode } from './hooks/useDarkMode';
import { COURSE_STRUCTURE } from './constants';
import { generateLessonContent, generateQuiz, generateProjectIdeas } from './services/geminiService';
import { getCompletedLessons, markLessonAsComplete } from './utils/localStorage';
import type { Lesson, QuizQuestion, ProjectIdea, View, LessonContent } from './types';

const App: React.FC = () => {
    const [theme, toggleTheme] = useDarkMode();
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [currentView, setCurrentView] = useState<View>('lesson');
    const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
    const [lessonContent, setLessonContent] = useState<LessonContent | null>(null);
    const [isLessonLoading, setLessonLoading] = useState(false);
    
    const [projectIdeas, setProjectIdeas] = useState<ProjectIdea[]>([]);
    const [isProjectsLoading, setProjectsLoading] = useState(false);
    const [projectsError, setProjectsError] = useState<string | null>(null);

    const [isQuizModalOpen, setQuizModalOpen] = useState(false);
    const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[] | null>(null);
    const [isQuizLoading, setQuizLoading] = useState(false);
    
    const [completedLessons, setCompletedLessons] = useState<Set<string>>(getCompletedLessons);

    const totalLessons = useMemo(() => COURSE_STRUCTURE.reduce((acc, chapter) => acc + chapter.lessons.length, 0), []);
    const progress = useMemo(() => totalLessons > 0 ? Math.round((completedLessons.size / totalLessons) * 100) : 0, [completedLessons, totalLessons]);

    const handleSelectLesson = useCallback((lesson: Lesson) => {
        if (lesson.id === currentLesson?.id) return;
        
        setCurrentLesson(lesson);
        setLessonContent(null);
        setLessonLoading(true);

        generateLessonContent(lesson.title)
            .then(content => {
                setLessonContent(content);
            })
            .catch(error => {
                console.error("Failed to load lesson content", error);
                // Optionally set an error state here
            })
            .finally(() => {
                setLessonLoading(false);
            });
    }, [currentLesson?.id]);
    
    const handleSelectView = useCallback((view: View) => {
        setCurrentView(view);
        if (view === 'projects' && projectIdeas.length === 0) {
            setProjectsLoading(true);
            setProjectsError(null);
            generateProjectIdeas()
                .then(ideas => {
                    setProjectIdeas(ideas);
                })
                .catch(err => {
                    console.error("Failed to generate project ideas:", err);
                    setProjectsError("Impossible de générer les idées de projets. Veuillez réessayer plus tard.");
                })
                .finally(() => {
                    setProjectsLoading(false);
                });
        }
    }, [projectIdeas.length]);
    
    const handleCompleteLesson = () => {
        if (currentLesson) {
            const updatedCompleted = markLessonAsComplete(currentLesson.id);
            setCompletedLessons(new Set(updatedCompleted));
        }
    };

    const handleTakeQuiz = () => {
        if (!currentLesson) return;
        setQuizModalOpen(true);
        setQuizLoading(true);
        setQuizQuestions(null);
        generateQuiz(currentLesson.title)
            .then(questions => {
                setQuizQuestions(questions);
            })
            .catch(error => {
                console.error("Failed to generate quiz", error);
            })
            .finally(() => {
                setQuizLoading(false);
            });
    };

    const getLessonTitle = () => {
        if(currentView === 'projects') return "Idées de Projets";
        if(currentLesson) return currentLesson.title;
        return "Bienvenue";
    }

    return (
        <div className={`flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100`}>
            <Sidebar
                courseStructure={COURSE_STRUCTURE}
                completedLessons={completedLessons}
                currentLesson={currentLesson}
                onSelectLesson={handleSelectLesson}
                onSelectView={handleSelectView}
                currentView={currentView}
                isOpen={isSidebarOpen}
                onClose={() => setSidebarOpen(false)}
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
                    {currentView === 'lesson' ? (
                        <CourseView
                            lesson={currentLesson}
                            lessonContent={lessonContent}
                            isLoading={isLessonLoading}
                            isCompleted={currentLesson ? completedLessons.has(currentLesson.id) : false}
                            onCompleteLesson={handleCompleteLesson}
                            onTakeQuiz={handleTakeQuiz}
                        />
                    ) : (
                       <ProjectIdeasView
                            ideas={projectIdeas}
                            isLoading={isProjectsLoading}
                            error={projectsError}
                        />
                    )}
                </main>
            </div>
            {isQuizModalOpen && currentLesson && (
                <QuizModal
                    lessonTitle={currentLesson.title}
                    questions={quizQuestions}
                    isLoading={isQuizLoading}
                    onClose={() => setQuizModalOpen(false)}
                    onQuizComplete={handleCompleteLesson}
                />
            )}
        </div>
    );
};

export default App;
