/**
 * Types for Trigonometric Functions & Transformations Platform
 * Aligned with Grade 10 Math (10.2.3.1 & 10.2.3.2)
 */

export type TrigFunctionType = 'sin' | 'cos' | 'tan' | 'cot' | 'sec' | 'csc';

export type InverseTrigType = 'arcsin' | 'arccos' | 'arctan' | 'arccot';

export interface TransformationParams {
  a: number; // Amplitude / vertical scale & reflection
  b: number; // Frequency / horizontal compression factor
  h: number; // Phase shift in radians (e.g., 0, pi/4, pi/2, etc.)
  k: number; // Vertical shift (midline)
}

export interface LandmarkPoint {
  x: number;
  y: number;
  label: string;
  type: 'max' | 'min' | 'intercept' | 'midline' | 'asymptote';
  exactX?: string;
  exactY?: string;
}

export interface FunctionProperties {
  domain: string;
  range: string;
  fundamentalPeriod: string;
  fundamentalPeriodValue: number;
  amplitude: string;
  midline: number;
  phaseShift: string;
  parity: 'even' | 'odd' | 'neither';
  asymptotes?: string;
  zerosGeneral: string;
}

export interface TransformationStep {
  stepNumber: number;
  title: string;
  description: string;
  equation: string;
  params: TransformationParams;
  color: string;
}

export interface MatchChallenge {
  id: string;
  title: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Textbook Ex.';
  funcType: TrigFunctionType;
  targetParams: TransformationParams;
  hint: string;
  explanation: string;
  textbookRef?: string;
}

export interface QuizQuestion {
  id: string;
  standard: '10.2.3.1' | '10.2.3.2';
  title: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  textbookRef: string;
  topic: 'properties' | 'transformations' | 'period' | 'domain-range' | 'unit-circle';
}

export interface GlossaryTerm {
  en: string;
  kz: string;
  ru: string;
  definition: string;
  example: string;
}
