import { MatchChallenge, QuizQuestion, GlossaryTerm, TrigFunctionType, TransformationParams } from '../types/trig';

export const PI = Math.PI;

export interface PresetFunction {
  id: string;
  name: string;
  func: TrigFunctionType;
  params: TransformationParams;
  description: string;
  category: 'standard' | 'textbook' | 'advanced';
}

export const PRESET_FUNCTIONS: PresetFunction[] = [
  {
    id: 'base-sin',
    name: 'y = sin(x)',
    func: 'sin',
    params: { a: 1, b: 1, h: 0, k: 0 },
    description: 'Standard sine parent function with amplitude 1, period 2π, centered at origin.',
    category: 'standard'
  },
  {
    id: 'base-cos',
    name: 'y = cos(x)',
    func: 'cos',
    params: { a: 1, b: 1, h: 0, k: 0 },
    description: 'Standard cosine parent function with amplitude 1, period 2π, y-intercept at (0, 1).',
    category: 'standard'
  },
  {
    id: 'base-tan',
    name: 'y = tan(x)',
    func: 'tan',
    params: { a: 1, b: 1, h: 0, k: 0 },
    description: 'Standard tangent function with period π and vertical asymptotes at x = ±π/2.',
    category: 'standard'
  },
  {
    id: 'tb-ex-2',
    name: 'y = sin(x + π/4) - 1',
    func: 'sin',
    params: { a: 1, b: 1, h: -PI / 4, k: -1 },
    description: 'Textbook Example 2 (Page 45): Horizontal shift left by π/4, then vertical shift down by 1.',
    category: 'textbook'
  },
  {
    id: 'tb-ex-3a',
    name: 'y = 2·sin(x)',
    func: 'sin',
    params: { a: 2, b: 1, h: 0, k: 0 },
    description: 'Textbook Example 3a (Page 46): Vertical stretch by factor of 2, range becomes [-2, 2].',
    category: 'textbook'
  },
  {
    id: 'tb-ex-3b',
    name: 'y = sin(2x)',
    func: 'sin',
    params: { a: 1, b: 2, h: 0, k: 0 },
    description: 'Textbook Example 3b (Page 46): Horizontal shrink by factor of 1/2, period T = 2π/2 = π.',
    category: 'textbook'
  },
  {
    id: 'tb-ex-4a',
    name: 'y = cos(3x - π/2)',
    func: 'cos',
    params: { a: 1, b: 3, h: PI / 6, k: 0 },
    description: 'Textbook Example 4a (Page 47): cos(3(x - π/6)) - shrink by 1/3, phase shift right by π/6.',
    category: 'textbook'
  },
  {
    id: 'tb-ex-27',
    name: 'y = 2·sin(3x) + 4',
    func: 'sin',
    params: { a: 2, b: 3, h: 0, k: 4 },
    description: 'Textbook Example 27 (Page 108): Period 2π/3, amplitude 2, shifted up 4 to midline y = 4.',
    category: 'textbook'
  },
  {
    id: 'tb-ex-8b',
    name: 'y = 3 - 2·cos(x)',
    func: 'cos',
    params: { a: -2, b: 1, h: 0, k: 3 },
    description: 'Textbook Exercise 8b (Page 61): Reflection across x-axis, amplitude 2, vertical shift up 3.',
    category: 'textbook'
  },
  {
    id: 'tb-ex-28',
    name: 'y = 2·cos(x/3) - 3',
    func: 'cos',
    params: { a: 2, b: 1 / 3, h: 0, k: -3 },
    description: 'Textbook Example 28 (Page 108): Horizontal stretch to period T = 6π, vertical shift down 3.',
    category: 'advanced'
  }
];

export const MATCH_CHALLENGES: MatchChallenge[] = [
  {
    id: 'ch-1',
    title: 'Warmup: Amplitude Boost',
    difficulty: 'Beginner',
    funcType: 'sin',
    targetParams: { a: 3, b: 1, h: 0, k: 0 },
    hint: 'Notice the peaks reach y = 3 and valleys reach y = -3. Only vertical stretch a needs to change.',
    explanation: 'Setting a = 3 scales the y-coordinates by 3, making the amplitude 3 and range [-3, 3].',
    textbookRef: 'Grade 10 Textbook §2.1 Example 3a'
  },
  {
    id: 'ch-2',
    title: 'Midline Elevation',
    difficulty: 'Beginner',
    funcType: 'cos',
    targetParams: { a: 1, b: 1, h: 0, k: 2 },
    hint: 'The wave oscillates between y = 1 and y = 3. What is the central midline y = k?',
    explanation: 'The midline is y = 2, so vertical translation k = +2 shifts the entire cosine wave up by 2 units.',
    textbookRef: 'Grade 10 Textbook §2.1 Transformations'
  },
  {
    id: 'ch-3',
    title: 'Frequency Doubler (Period = π)',
    difficulty: 'Beginner',
    funcType: 'sin',
    targetParams: { a: 1, b: 2, h: 0, k: 0 },
    hint: 'One complete cycle finishes at x = π instead of 2π. Use the period formula T = 2π/b.',
    explanation: 'Since T = 2π / b = π, solving gives b = 2. This compresses the graph horizontally by factor 1/2.',
    textbookRef: 'Grade 10 Textbook §2.1 Example 3b'
  },
  {
    id: 'ch-4',
    title: 'Textbook Example 2: Phase & Shift',
    difficulty: 'Intermediate',
    funcType: 'sin',
    targetParams: { a: 1, b: 1, h: -PI / 4, k: -1 },
    hint: 'The wave is shifted left by π/4 (so h = -π/4) and shifted downward so its midline is y = -1.',
    explanation: 'Formula y = sin(x + π/4) - 1: Phase shift h = -π/4 moves left, k = -1 moves down.',
    textbookRef: 'Grade 10 Textbook Page 45, Example 2'
  },
  {
    id: 'ch-5',
    title: 'Inverted Cosine with Height',
    difficulty: 'Intermediate',
    funcType: 'cos',
    targetParams: { a: -2, b: 1, h: 0, k: 3 },
    hint: 'At x = 0, the curve is at a trough (y = 1) instead of a peak! This indicates a reflection (a < 0). Midline is at y = 3.',
    explanation: 'y = 3 - 2cos(x). Reflection gives a = -2 (amplitude = 2), and midline k = 3.',
    textbookRef: 'Grade 10 Textbook Page 61, Exercise 8b'
  },
  {
    id: 'ch-6',
    title: 'Rapid Oscillator: y = 2sin(3x) + 1',
    difficulty: 'Advanced',
    funcType: 'sin',
    targetParams: { a: 2, b: 3, h: 0, k: 1 },
    hint: 'Find the period first: one full cycle takes 2π/3 radians. Amplitude is (3 - (-1))/2 = 2. Midline is y = 1.',
    explanation: 'T = 2π/3 means b = 3. Amplitude is 2, so a = 2. Shift up 1 means k = 1.',
    textbookRef: 'Grade 10 Textbook Page 61, Exercise 8a'
  },
  {
    id: 'ch-7',
    title: 'Complex Transformation: y = cos(3x - π/2)',
    difficulty: 'Advanced',
    funcType: 'cos',
    targetParams: { a: 1, b: 3, h: PI / 6, k: 0 },
    hint: 'Rewrite inside as 3(x - π/6). This reveals horizontal compression b = 3 and phase shift h = +π/6.',
    explanation: 'In 3x - π/2 = 3(x - π/6), the phase shift h = π/6 to the right, and frequency b = 3 gives period 2π/3.',
    textbookRef: 'Grade 10 Textbook Page 47, Example 4a'
  },
  {
    id: 'ch-8',
    title: 'The Great Wave: y = 3cos(x/2) - 1',
    difficulty: 'Advanced',
    funcType: 'cos',
    targetParams: { a: 3, b: 0.5, h: 0, k: -1 },
    hint: 'The wave is stretched out horizontally: period is 4π! Amplitude is 3, midline is at y = -1.',
    explanation: 'b = 0.5 gives period T = 2π / 0.5 = 4π. Amplitude a = 3, vertical shift k = -1.',
    textbookRef: 'Grade 10 Textbook Page 61, Exercise 9d'
  }
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    standard: '10.2.3.1',
    topic: 'domain-range',
    title: 'Range of Scaled Sine Function',
    question: 'What is the range of the function f(x) = 2sin(x) + 4?',
    options: ['[-2, 2]', '[2, 6]', '[4, 6]', '[-1, 1]'],
    correctIndex: 1,
    explanation: 'Since -1 ≤ sin(x) ≤ 1, multiplying by 2 gives -2 ≤ 2sin(x) ≤ 2. Adding 4 gives 2 ≤ 2sin(x) + 4 ≤ 6. Therefore, the range is [2, 6].',
    textbookRef: 'Grade 10 Textbook Page 45, Example 1'
  },
  {
    id: 'q2',
    standard: '10.2.3.1',
    topic: 'properties',
    title: 'Parity of Trigonometric Functions',
    question: 'Which of the following statements about function parity is correct?',
    options: [
      'f(x) = sin(x) is even and f(x) = cos(x) is odd',
      'f(x) = cos(x) is even because cos(-x) = cos(x), while sin(x), tan(x), cot(x) are odd',
      'All trigonometric functions are even functions',
      'None of the trigonometric functions have parity'
    ],
    correctIndex: 1,
    explanation: 'cos(-x) = cos(x) and sec(-x) = sec(x) are even (symmetric about the y-axis). sin(-x) = -sin(x), tan(-x) = -tan(x), cot(-x) = -cot(x) are odd (symmetric about the origin).',
    textbookRef: 'Grade 10 Textbook Page 44 & 46'
  },
  {
    id: 'q3',
    standard: '10.2.3.2',
    topic: 'period',
    title: 'Fundamental Period Calculation',
    question: 'What is the fundamental period T of the function f(x) = cos(3x - π/2)?',
    options: ['2π', '6π', '2π/3', 'π/3'],
    correctIndex: 2,
    explanation: 'For cosine f(x) = cos(bx + c), the fundamental period is T = 2π / |b|. Here b = 3, so T = 2π/3.',
    textbookRef: 'Grade 10 Textbook Page 47, Example 4a'
  },
  {
    id: 'q4',
    standard: '10.2.3.2',
    topic: 'transformations',
    title: 'Phase Shift Direction',
    question: 'In the function y = sin(x + π/4) - 1, how is the parent graph y = sin(x) shifted horizontally?',
    options: [
      'Shifted to the right by π/4 units',
      'Shifted to the left by π/4 units',
      'Shifted upward by π/4 units',
      'No horizontal shift occurs'
    ],
    correctIndex: 1,
    explanation: 'In y = f(x - h), the term (x + π/4) corresponds to h = -π/4. A positive addition inside the argument shifts the curve to the left by π/4 units.',
    textbookRef: 'Grade 10 Textbook Page 45, Example 2'
  },
  {
    id: 'q5',
    standard: '10.2.3.1',
    topic: 'properties',
    title: 'Domain of the Tangent Function',
    question: 'What is the domain of the tangent function f(x) = tan(x)?',
    options: [
      'x ∈ ℝ (all real numbers)',
      'x ∈ ℝ \\ {kπ, k ∈ ℤ}',
      'x ∈ ℝ \\ {π/2 + kπ, k ∈ ℤ}',
      '[-1, 1]'
    ],
    correctIndex: 2,
    explanation: 'tan(x) = sin(x)/cos(x). The function is undefined when cos(x) = 0, which occurs at odd multiples of π/2: x = π/2 + kπ (k ∈ ℤ).',
    textbookRef: 'Grade 10 Textbook Page 48, §c'
  },
  {
    id: 'q6',
    standard: '10.2.3.2',
    topic: 'transformations',
    title: 'Transformation Sequencing',
    question: 'To transform y = cos(x) into y = -2cos(3x) + 5, which combination of transformations is applied?',
    options: [
      'Horizontal stretch by 3, vertical stretch by 2, shift down 5',
      'Horizontal compression by factor 1/3, vertical stretch by 2 with reflection across x-axis, vertical shift up 5',
      'Shift right 3, reflection across y-axis, shift up 5',
      'Vertical compression by 1/2, horizontal shift 3, shift up 5'
    ],
    correctIndex: 1,
    explanation: 'b = 3 compresses horizontally by factor 1/3. a = -2 reflects across the horizontal axis and stretches vertically by 2. k = +5 shifts the entire curve up by 5 units.',
    textbookRef: 'Grade 10 Textbook §2.1 & Review Tests'
  },
  {
    id: 'q7',
    standard: '10.2.3.1',
    topic: 'unit-circle',
    title: 'Quadrants and Signs',
    question: 'In which quadrant are both sin(x) < 0 and cos(x) > 0?',
    options: ['Quadrant I', 'Quadrant II', 'Quadrant III', 'Quadrant IV'],
    correctIndex: 3,
    explanation: 'In Quadrant IV (angles from 3π/2 to 2π or 270° to 360°), x-coordinates (cosine) are positive while y-coordinates (sine) are negative.',
    textbookRef: 'Grade 10 Textbook Page 44 & 46'
  },
  {
    id: 'q8',
    standard: '10.2.3.2',
    topic: 'period',
    title: 'Period of Tangent Function',
    question: 'What is the fundamental period of y = 3·tan(2x - π/3)?',
    options: ['2π', 'π', 'π/2', 'π/3'],
    correctIndex: 2,
    explanation: 'For the tangent function, the parent period is π. Thus, the period of tan(bx) is T = π / |b|. With b = 2, T = π/2.',
    textbookRef: 'Grade 10 Textbook Page 49, Example 6'
  }
];

export const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    en: 'Domain',
    kz: 'Анықталу облысы',
    ru: 'Область определения',
    definition: 'The set of all possible real input values (x) for which a function is defined.',
    example: 'For y = sin(x), Domain = ℝ. For y = tan(x), Domain = ℝ \\ {π/2 + kπ}.'
  },
  {
    en: 'Range',
    kz: 'Мәндер жиыны',
    ru: 'Область значений',
    definition: 'The set of all output values (y) that the function can produce.',
    example: 'For y = 3sin(x) + 2, Range is [-1, 5].'
  },
  {
    en: 'Fundamental Period',
    kz: 'Функцияның негізгі периоды',
    ru: 'Основной период',
    definition: 'The smallest positive value T such that f(x + T) = f(x) for all x in the domain.',
    example: 'T = 2π for sin and cos; T = π for tan and cot.'
  },
  {
    en: 'Amplitude',
    kz: 'Амплитуда',
    ru: 'Амплитуда',
    definition: 'Half the distance between the maximum and minimum values of a sinusoidal wave: |a| = (y_max - y_min) / 2.',
    example: 'For y = -4cos(2x), amplitude is |-4| = 4.'
  },
  {
    en: 'Phase Shift (Horizontal Translation)',
    kz: 'Фазалық ығысу (Көлденең жылжу)',
    ru: 'Фазовый сдвиг (Горизонтальный сдвиг)',
    definition: 'Horizontal displacement h of a periodic wave. If written as y = f(bx + c), the shift is h = -c/b.',
    example: 'In y = sin(2x - π), 2(x - π/2) gives a phase shift of π/2 to the right.'
  },
  {
    en: 'Vertical Shift (Midline)',
    kz: 'Тігінен ығысу (Орта сызық)',
    ru: 'Вертикальный сдвиг (Средняя линия)',
    definition: 'Vertical translation k that shifts the horizontal centerline of the wave up or down to the line y = k.',
    example: 'In y = 2cos(x) + 3, the midline is y = 3.'
  },
  {
    en: 'Unit Circle',
    kz: 'Бірлік шеңбер',
    ru: 'Единичная окружность',
    definition: 'A circle of radius 1 centered at the origin (0, 0), where any angle α has coordinates (cos α, sin α).',
    example: 'At α = 30° (π/6 rad), point is (√3/2, 1/2).'
  },
  {
    en: 'Sine Curve (Sinusoid)',
    kz: 'Синусоида',
    ru: 'Синусоида',
    definition: 'The continuous, smooth wave graph representing the sine function and its linear transformations.',
    example: 'Sound waves, alternating current, and pendulums follow sinusoidal curves.'
  },
  {
    en: 'Vertical Asymptote',
    kz: 'Тік асимптота',
    ru: 'Вертикальная асимптота',
    definition: 'A vertical line x = c where the function approaches positive or negative infinity as x approaches c.',
    example: 'y = tan(x) has vertical asymptotes at x = ±π/2, ±3π/2, ...'
  },
  {
    en: 'Even / Odd Parity',
    kz: 'Жұп / Тақ функция',
    ru: 'Четная / Нечетная функция',
    definition: 'Even: f(-x) = f(x) (y-axis symmetry). Odd: f(-x) = -f(x) (origin symmetry).',
    example: 'cos(x) is even; sin(x), tan(x), cot(x) are odd.'
  }
];
