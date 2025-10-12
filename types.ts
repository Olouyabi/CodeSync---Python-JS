export interface Lesson {
  id: string;
  title: string;
}

export interface Chapter {
  id:string;
  title: string;
  lessons: Lesson[];
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface ProjectIdea {
  title: string;
  description: string;
  difficulty: 'Facile' | 'Moyen' | 'Difficile';
}

export type View = 'course' | 'projects';

export interface LessonContent {
  explanation: string;
  pythonCode: string;
  jsCode: string;
}
