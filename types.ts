export interface Lesson {
  id: number;
  title: string;
  description: string;
  duration: string; // e.g., "15 min"
  type: 'video' | 'text' | 'pdf';
  pages: string[]; // Array of text content for each page
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number; // Index of the correct option
}

export interface FutureModule {
  id: number;
  title: string;
  description: string;
  lessons: string[];
}

export interface UserProgress {
  completedLessonIds: number[];
  xp: number;
  level: number;
  streak: number;
  rankTitle: string;
  notes: Record<number, string>; // Map lesson ID to user notes (editable txt)
}

export enum GameState {
  MODULE_SELECT = 'MODULE_SELECT',
  DASHBOARD = 'DASHBOARD',
  LESSON_VIEW = 'LESSON_VIEW',
  QUIZ = 'QUIZ',
}