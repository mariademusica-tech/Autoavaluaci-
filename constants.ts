import { Question, QuestionCategory, ResponseType } from './types';

export const QUESTIONS: Question[] = [
  // Section 1: Yellow/Orange Header (Individual/Task)
  {
    id: 'q1',
    text: "M'esforço a fer les tasques?",
    category: QuestionCategory.AUTONOMY,
    type: ResponseType.LIKERT,
  },
  {
    id: 'q2',
    text: "Em concentro i treballo quan toca?",
    category: QuestionCategory.AUTONOMY,
    type: ResponseType.LIKERT,
  },
  {
    id: 'q3',
    text: "M'organitzo i sóc responsable del meu material?",
    category: QuestionCategory.AUTONOMY,
    type: ResponseType.LIKERT,
  },
  // Section 2: Blue/Cyan Header (Social)
  {
    id: 'q4',
    text: "Em relaciono amb tots els companys?",
    category: QuestionCategory.SOCIAL,
    type: ResponseType.LIKERT,
  },
  {
    id: 'q5',
    text: "Treballo bé en equip?",
    category: QuestionCategory.SOCIAL,
    type: ResponseType.LIKERT,
  },
  {
    id: 'q6',
    text: "Participo en totes les activitats?",
    category: QuestionCategory.SOCIAL,
    type: ResponseType.LIKERT,
  },
  {
    id: 'q7',
    text: "Respecto les opinions de tots els companys?",
    category: QuestionCategory.SOCIAL,
    type: ResponseType.LIKERT,
  },
  // Section 3: Pink Header (Open Ended)
  {
    id: 'q8',
    text: "El que faig millor i és el meu punt fort...",
    category: QuestionCategory.REFLECTION,
    type: ResponseType.TEXT,
  },
  {
    id: 'q9',
    text: "El que puc millorar és...",
    category: QuestionCategory.REFLECTION,
    type: ResponseType.TEXT,
  },
];

export const LIKERT_LABELS = {
  1: "Necessito millorar",
  2: "Puc fer-ho millor",
  3: "Ho faig bé",
  4: "Ho faig excel·lent",
};

// Colors associated with categories for UI styling
export const CATEGORY_COLORS = {
  [QuestionCategory.AUTONOMY]: 'bg-amber-100 text-amber-900 border-amber-300',
  [QuestionCategory.SOCIAL]: 'bg-cyan-100 text-cyan-900 border-cyan-300',
  [QuestionCategory.REFLECTION]: 'bg-pink-100 text-pink-900 border-pink-300',
};

export const CATEGORY_ACCENT = {
  [QuestionCategory.AUTONOMY]: 'text-amber-600',
  [QuestionCategory.SOCIAL]: 'text-cyan-600',
  [QuestionCategory.REFLECTION]: 'text-pink-600',
};