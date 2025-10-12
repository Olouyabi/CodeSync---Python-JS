
export interface Lesson {
  id: string;
  title: string;
}

export interface Chapter {
  id:string;
  title: string;
  lessons: Lesson[];
}

export interface LanguageContent {
  explanation: string;
  code: string;
}

export interface CourseContent {
  python: LanguageContent;
  javascript: LanguageContent;
}

export interface ProjectIdea {
  title: string;
  description: string;
  technologies: string[];
}
