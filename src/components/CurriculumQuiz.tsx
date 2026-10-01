import React, { useState } from 'react';
import { QUIZ_QUESTIONS } from '../data/curriculumData';
import { QuizQuestion } from '../types/trig';
import { CheckCircle2, XCircle, HelpCircle, RotateCcw, Award, ChevronRight } from 'lucide-react';

export const CurriculumQuiz: React.FC = () => {
  const [selectedStandard, setSelectedStandard] = useState<'all' | '10.2.3.1' | '10.2.3.2'>('all');
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [showExplanation, setShowExplanation] = useState<Record<string, boolean>>({});

  const filteredQuestions = QUIZ_QUESTIONS.filter((q) => {
    if (selectedStandard === 'all') return true;
    return q.standard === selectedStandard;
  });

  const question: QuizQuestion = filteredQuestions[currentIdx] || filteredQuestions[0];
  const total = filteredQuestions.length;
  const currentAnswer = selectedAnswers[question?.id];
  const isAnswered = currentAnswer !== undefined;
  const isCorrect = isAnswered && currentAnswer === question?.correctIndex;

  // Calculate overall score
  const correctCount = Object.entries(selectedAnswers).filter(([qId, userAns]) => {
    const q = QUIZ_QUESTIONS.find((item) => item.id === qId);
    return q && q.correctIndex === userAns;
  }).length;

  const handleSelectOption = (optIndex: number) => {
    if (isAnswered) return;
    setSelectedAnswers((prev) => ({ ...prev, [question.id]: optIndex }));
    setShowExplanation((prev) => ({ ...prev, [question.id]: true }));
  };

  const handleResetQuiz = () => {
    setSelectedAnswers({});
    setShowExplanation({});
    setCurrentIdx(0);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 mb-1">
            <span>CURRICULUM SELF-ASSESSMENT</span>
            <span aria-hidden="true">·</span>
            <span>Grade 10 Algebra Practice</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Textbook Problem Bank & Quiz
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Test your mastery of definitions, properties (10.2.3.1), and graphing by transformations (10.2.3.2).
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => {
              setSelectedStandard('all');
              setCurrentIdx(0);
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              selectedStandard === 'all'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Standards
          </button>
          <button
            onClick={() => {
              setSelectedStandard('10.2.3.1');
              setCurrentIdx(0);
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              selectedStandard === '10.2.3.1'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            10.2.3.1 (Properties)
          </button>
          <button
            onClick={() => {
              setSelectedStandard('10.2.3.2');
              setCurrentIdx(0);
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              selectedStandard === '10.2.3.2'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            10.2.3.2 (Transformations)
          </button>
        </div>
      </div>

      {/* Progress & Score Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <span className="font-bold text-slate-700">
            Question {currentIdx + 1} of {total}
          </span>
          <span className="text-slate-400">·</span>
          <span className="font-mono text-indigo-600 font-medium">
            Standard {question.standard}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 font-semibold text-slate-700">
            <Award className="w-4 h-4 text-amber-500" />
            <span>Score: {correctCount} / {Object.keys(selectedAnswers).length} answered</span>
          </div>

          <button
            onClick={handleResetQuiz}
            title="Reset answers"
            className="flex items-center gap-1 text-slate-500 hover:text-slate-800 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Question Card */}
      {question && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 block mb-1">
              {question.title}
            </span>
            <h3 className="text-base sm:text-lg font-semibold text-slate-900 leading-snug">
              {question.question}
            </h3>
          </div>

          {/* Options */}
          <div className="space-y-2.5">
            {question.options.map((option, idx) => {
              const isThisChosen = currentAnswer === idx;
              const isThisCorrect = idx === question.correctIndex;

              let btnStyle = 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50/70 text-slate-800';
              if (isAnswered) {
                if (isThisCorrect) {
                  btnStyle = 'border-emerald-500 bg-emerald-50 text-emerald-950 ring-1 ring-emerald-500';
                } else if (isThisChosen) {
                  btnStyle = 'border-rose-500 bg-rose-50 text-rose-950 ring-1 ring-rose-500';
                } else {
                  btnStyle = 'border-slate-200 text-slate-400 opacity-60';
                }
              }

              return (
                <button
                  key={idx}
                  disabled={isAnswered}
                  onClick={() => handleSelectOption(idx)}
                  className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm font-medium transition-all flex items-center justify-between gap-3 ${btnStyle}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center font-mono text-xs font-bold text-slate-700 shrink-0">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{option}</span>
                  </div>

                  {isAnswered && isThisCorrect && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  )}
                  {isAnswered && isThisChosen && !isThisCorrect && (
                    <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation Card */}
          {showExplanation[question.id] && (
            <div
              className={`p-4 rounded-xl border text-xs leading-relaxed space-y-1.5 ${
                isCorrect
                  ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                  : 'bg-rose-50/80 border-rose-200 text-rose-950'
              }`}
            >
              <div className="flex items-center gap-1.5 font-bold">
                {isCorrect ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Correct!</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-rose-600" />
                    <span>Incorrect — Solution Breakdown:</span>
                  </>
                )}
              </div>
              <p className="text-slate-800">{question.explanation}</p>
              <div className="text-[11px] font-mono text-slate-500 pt-1">
                Textbook Reference: {question.textbookRef}
              </div>
            </div>
          )}

          {/* Bottom Navigation */}
          <div className="pt-2 flex items-center justify-between border-t border-slate-100">
            <button
              disabled={currentIdx === 0}
              onClick={() => setCurrentIdx((prev) => Math.max(0, prev - 1))}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:pointer-events-none rounded-xl transition-colors"
            >
              Previous
            </button>

            <div className="flex items-center gap-1">
              {filteredQuestions.map((_, dotIdx) => (
                <button
                  key={dotIdx}
                  onClick={() => setCurrentIdx(dotIdx)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    dotIdx === currentIdx
                      ? 'bg-indigo-600 w-5'
                      : selectedAnswers[filteredQuestions[dotIdx].id] !== undefined
                      ? 'bg-slate-400'
                      : 'bg-slate-200'
                  }`}
                />
              ))}
            </div>

            <button
              disabled={currentIdx === total - 1}
              onClick={() => setCurrentIdx((prev) => Math.min(total - 1, prev + 1))}
              className="flex items-center gap-1 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:pointer-events-none rounded-xl transition-colors"
            >
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
