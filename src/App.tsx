import React, { useState } from 'react';
import { Header, ActiveTab } from './components/Header';
import { TransformationLab } from './components/TransformationLab';
import { UnitCircleExplorer } from './components/UnitCircleExplorer';
import { TransformationMatcher } from './components/TransformationMatcher';
import { InverseFunctionsExplorer } from './components/InverseFunctionsExplorer';
import { CurriculumQuiz } from './components/CurriculumQuiz';
import { TheoryReference } from './components/TheoryReference';
import { Compass, Sliders, Target, BookOpen, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('lab');
  const [resetKey, setResetKey] = useState<number>(0);

  const handleGlobalReset = () => {
    setResetKey((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900">
      {/* Universal Top Bar */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onReset={handleGlobalReset}
      />

      {/* Hero Quick Navigator & Standards Pill Bar (Only on overview if desired or top of content) */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Curricular Alignment Banner */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-indigo-700">
                <span>Grade 10 Mathematics Standard</span>
                <span aria-hidden="true">·</span>
                <span>Kazakhstan Curriculum / AstanaKitap & Zambak</span>
              </div>
              <h1 className="text-base sm:text-lg font-bold text-slate-900 mt-0.5">
                Trigonometric Functions, Properties & Transformations Platform
              </h1>
            </div>
          </div>

          {/* Standards Quick Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveTab('circle')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200/70 text-xs font-medium transition-colors"
            >
              <span className="font-bold">10.2.3.1</span>
              <span className="text-sky-600">Definitions & Properties</span>
            </button>

            <button
              onClick={() => setActiveTab('lab')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200/70 text-xs font-medium transition-colors"
            >
              <span className="font-bold">10.2.3.2</span>
              <span className="text-indigo-600">Plotting by Transformations</span>
            </button>
          </div>
        </div>

        {/* Tab Viewport */}
        {activeTab === 'lab' && <TransformationLab key={`lab-${resetKey}`} />}
        {activeTab === 'circle' && <UnitCircleExplorer key={`circle-${resetKey}`} />}
        {activeTab === 'matcher' && <TransformationMatcher key={`matcher-${resetKey}`} />}
        {activeTab === 'inverse' && <InverseFunctionsExplorer key={`inverse-${resetKey}`} />}
        {activeTab === 'quiz' && <CurriculumQuiz key={`quiz-${resetKey}`} />}
        {activeTab === 'theory' && <TheoryReference key={`theory-${resetKey}`} />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-xs text-slate-500 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700">TrigoLab 10</span>
            <span>·</span>
            <span>Interactive Mathematics Education Platform</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Aligned with 10.2.3.1 & 10.2.3.2</span>
            <span>·</span>
            <span>Kazakhstan Curriculum Grade 10</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
