
const COMPLETED_LESSONS_KEY = 'completedLessons';

export const getCompletedLessons = (): Set<string> => {
  if (typeof window === 'undefined') {
    return new Set();
  }
  try {
    const stored = localStorage.getItem(COMPLETED_LESSONS_KEY);
    return stored ? new Set(JSON.parse(stored)) : new Set();
  } catch (error) {
    console.error("Failed to parse completed lessons from localStorage", error);
    return new Set();
  }
};

export const saveCompletedLessons = (completedIds: Set<string>): void => {
    if (typeof window === 'undefined') {
        return;
    }
    try {
        localStorage.setItem(COMPLETED_LESSONS_KEY, JSON.stringify(Array.from(completedIds)));
    } catch (error) {
        console.error("Failed to save completed lessons to localStorage", error);
    }
};

export const markLessonAsComplete = (lessonId: string): Set<string> => {
    const completed = getCompletedLessons();
    completed.add(lessonId);
    saveCompletedLessons(completed);
    return completed;
};
