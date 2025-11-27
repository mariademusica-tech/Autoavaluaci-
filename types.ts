export enum QuestionCategory {
  AUTONOMY = 'Autonomia i Organització',
  SOCIAL = 'Relació Social i Treball en Equip',
  REFLECTION = 'Reflexió Personal',
}

export enum ResponseType {
  LIKERT = 'LIKERT',
  TEXT = 'TEXT',
}

export interface Question {
  id: string;
  text: string;
  category: QuestionCategory;
  type: ResponseType;
}

export interface StudentResponse {
  questionId: string;
  value: number | string; // number (1-4) for Likert, string for text
}

export interface StudentSubmission {
  id: string;
  studentName: string;
  date: string;
  responses: StudentResponse[];
}

export interface AppState {
  currentStep: number; // 0: Welcome, 1: Form, 2: Success
  currentQuestionIndex: number;
  studentName: string;
  responses: Record<string, number | string>;
  isAdminMode: boolean;
}