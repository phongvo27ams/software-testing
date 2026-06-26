export type Option = {
  id: string;
  label: 'A' | 'B' | 'C' | 'D';
  text: string;
};

export type Question = {
  id: string;
  prompt: string;
  explanation: string;
  correctOptionId: string;
  options: Option[];
};

export type Exercise = {
  id: string;
  sectionTitle: string;
  topicTitle?: string;
  title: string;
  description: string;
  questions: Question[];
};

export type Section = {
  id: string;
  topicId: string;
  topicTitle?: string;
  title: string;
  description: string;
  exercises: Exercise[];
};

export type Topic = {
  id: string;
  title: string;
  description: string;
  sections: Section[];
};
