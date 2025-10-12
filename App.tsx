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
    
    // Cache for preloaded lesson content
    const [lessonCache, setLessonCache] = useState<Map<string, LessonContent>>(new Map());

    const [projectIdeas, setProjectIdeas] = useState<ProjectIdea[]>([]);
    const [isProjectsLoading, setProjectsLoading] = useState(false);
    const [projectsError, setProjectsError] = useState<string | null>(null);

    const [isQuizModalOpen, setQuizModalOpen] = useState(false);
    const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[] | null>(null);
    const [isQuizLoading, setQuizLoading] = useState(false);
    
    const [completedLessons, setCompletedLessons] = useState<Set<string>>(getCompletedLessons);

    const totalLessons = useMemo(() => COURSE_STRUCTURE.reduce((acc, chapter) => acc + chapter.lessons.length, 0), []);
    const progress = useMemo(() => totalLessons > 0 ? Math.round((completedLessons.size / totalLessons) * 100) : 0, [completedLessons, totalLessons]);

    const findNextLesson = (lessonId: string): Lesson | null => {
        for (let i = 0; i < COURSE_STRUCTURE.length; i++) {
            const chapter = COURSE_STRUCTURE[i];
            const lessonIndex = chapter.lessons.findIndex(l => l.id === lessonId);

            if (lessonIndex !== -1) {
                // Found the lesson
                if (lessonIndex < chapter.lessons.length - 1) {
                    // Next lesson is in the same chapter
                    return chapter.lessons[lessonIndex + 1];
                } else if (i < COURSE_STRUCTURE.length - 1) {
                    // Next lesson is the first in the next chapter
                    const nextChapter = COURSE_STRUCTURE[i + 1];
                    if (nextChapter && nextChapter.lessons.length > 0) {
                        return nextChapter.lessons[0];
                    }
                }
            }
        }
        return null; // This was the last lesson
    };

    const preloadLesson = useCallback(async (lesson: Lesson) => {
        if (!lesson || lessonCache.has(lesson.id)) {
            return;
        }
        try {
            const content = await generateLessonContent(lesson.title);
            setLessonCache(prevCache => new Map(prevCache).set(lesson.id, content));
        } catch (error) {
            console.warn(`Failed to preload lesson "${lesson.title}":`, error);
        }
    }, [lessonCache]);

    const handleSelectLesson = useCallback((lesson: Lesson) => {
        if (lesson.id === currentLesson?.id) return;
        
        setCurrentLesson(lesson);

        // Check cache first
        if (lessonCache.has(lesson.id)) {
            setLessonContent(lessonCache.get(lesson.id)!);
            setLessonLoading(false);
            // Preload the next one immediately
            const nextLesson = findNextLesson(lesson.id);
            if (nextLesson) {
                preloadLesson(nextLesson);
            }
        } else {
            setLessonContent(null);
            setLessonLoading(true);

            generateLessonContent(lesson.title)
                .then(content => {
                    setLessonContent(content);
                    // Add the new content to the cache
                    setLessonCache(prevCache => new Map(prevCache).set(lesson.id, content));
                    // Preload the next lesson
                    const nextLesson = findNextLesson(lesson.id);
                    if (nextLesson) {
                        preloadLesson(nextLesson);
                    }
                })
                .catch(error => {
                    console.error("Failed to load lesson content", error);
                })
                .finally(() => {
                    setLessonLoading(false);
                });
        }
    }, [currentLesson?.id, lessonCache, preloadLesson]);
    
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
        <div className="flex h-screen text-gray-900 dark:text-gray-100">
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
                    <div 
                      key={currentView === 'lesson' ? currentLesson?.id || 'welcome' : 'projects'} 
                      className="content-fade-in"
                    >
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
                    </div>
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