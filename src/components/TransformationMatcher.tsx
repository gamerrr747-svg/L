import React, { useState, useMemo } from 'react';
import { MATCH_CHALLENGES } from '../data/curriculumData';
import { MatchChallenge, TransformationParams } from '../types/trig';
import { GraphCanvas } from './GraphCanvas';
import { buildEquationString, formatNumber, formatPiFraction, evaluateTransformed, PI } from '../utils/mathUtils';
import { Target, CheckCircle2, HelpCircle, Trophy, ArrowRight, RotateCcw, Sparkles } from 'lucide-react';

export const TransformationMatcher: React.FC = () => {
  const [selectedChallengeIndex, setSelectedChallengeIndex] = useState<number>(0);
  const challenge: MatchChallenge = MATCH_CHALLENGES[selectedChallengeIndex];

  // User's adjustable parameters
  const [userParams, setUserParams] = useState<TransformationParams>({
    a: 1,
    b: 1,
    h: 0,
    k: 0,
  });

  const [showHint, setShowHint] = useState<boolean>(false);
  const [completedChallenges, setCompletedChallenges] = useState<Record<string, boolean>>({});

  // Reset user sliders when challenge changes
  const loadChallenge = (index: number) => {
    setSelectedChallengeIndex(index);
    setUserParams({ a: 1, b: 1, h: 0, k: 0 });
    setShowHint(false);
  };

  // Calculate Match Accuracy Percentage
  const accuracy = useMemo(() => {
    const { targetParams } = challenge;
    let sumSqErr = 0;
    let samples = 0;
    const testPoints = 80;
    const xStart = -PI;
    const xEnd = 2 * PI;
    const dx = (xEnd - xStart) / testPoints;

    for (let i = 0; i <= testPoints; i++) {
      const x = xStart + i * dx;
      const yTarget = evaluateTransformed(challenge.funcType, targetParams, x);
      const yUser = evaluateTransformed(challenge.funcType, userParams, x);

      if (yTarget !== null && yUser !== null) {
        sumSqErr += Math.pow(yUser - yTarget, 2);
        samples++;
      }
    }

    if (samples === 0) return 0;
    const rmse = Math.sqrt(sumSqErr / samples);
    const scale = Math.max(1, Math.abs(targetParams.a) * 2);
    const score = Math.max(0, Math.min(100, Math.round((1 - rmse / scale) * 100)));

    // Perfect parameter match bonus
    const aMatch = Math.abs(userParams.a - targetParams.a) < 0.05;
    const bMatch = Math.abs(userParams.b - targetParams.b) < 0.05;
    const hMatch = Math.abs(userParams.h - targetParams.h) < 0.05;
    const kMatch = Math.abs(userParams.k - targetParams.k) < 0.05;

    if (aMatch && bMatch && hMatch && kMatch) return 100;
    return score;
  }, [challenge, userParams]);

  const isMatched = accuracy >= 98;

  // Mark completion
  if (isMatched && !completedChallenges[challenge.id]) {
    setCompletedChallenges((prev) => ({ ...prev, [challenge.id]: true }));
  }

  const userEquation = buildEquationString(challenge.funcType, userParams);
  const targetEquation = buildEquationString(challenge.funcType, challenge.targetParams);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 mb-1">
            <span>CURRICULUM 10.2.3.2 PRACTICE</span>
            <span aria-hidden="true">·</span>
            <span>Target Graph Alignment</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Transformation Matcher
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Adjust the amplitude (a), frequency (b), phase shift (h), and midline (k) to fit your curve onto the target green curve!
          </p>
        </div>

        {/* Progress Tracker */}
        <div className="flex items-center gap-2 self-start md:self-auto bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
          <Trophy className="w-4 h-4 text-amber-500" />
          <span className="text-xs font-semibold text-slate-700">
            Solved: {Object.keys(completedChallenges).length} / {MATCH_CHALLENGES.length}
          </span>
        </div>
      </div>

      {/* Challenge Selection Carousel */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {MATCH_CHALLENGES.map((ch, idx) => {
          const isCurrent = idx === selectedChallengeIndex;
          const isDone = !!completedChallenges[ch.id];
          return (
            <button
              key={ch.id}
              onClick={() => loadChallenge(idx)}
              className={`px-3.5 py-2 rounded-xl text-left border transition-all shrink-0 min-w-[150px] ${
                isCurrent
                  ? 'border-emerald-600 bg-emerald-50/70 shadow-xs'
                  : isDone
                  ? 'border-emerald-200 bg-white hover:bg-slate-50'
                  : 'border-slate-200 bg-white hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between gap-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  #{idx + 1} · {ch.difficulty}
                </span>
                {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
              </div>
              <div className="text-xs font-bold text-slate-800 truncate mt-0.5">
                {ch.title}
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Grid: Graph Stage on Left, Controls on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Graph Stage */}
        <div className="lg:col-span-7 space-y-4">
          <GraphCanvas
            func={challenge.funcType}
            params={userParams}
            targetParams={challenge.targetParams}
            showBase={false}
            showMidline={true}
            showAmplitudeBand={false}
            showPeriodBracket={false}
            showLandmarks={true}
          />

          {/* Success Banner when Matched */}
          {isMatched && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 text-emerald-950 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span className="font-bold text-sm text-emerald-900">
                    Perfect Match! Graph Transformation Verified
                  </span>
                </div>
                {selectedChallengeIndex < MATCH_CHALLENGES.length - 1 && (
                  <button
                    onClick={() => loadChallenge(selectedChallengeIndex + 1)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-colors"
                  >
                    <span>Next Challenge</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <p className="text-xs text-emerald-800 leading-relaxed">
                {challenge.explanation}
              </p>
              <div className="text-[11px] font-mono text-emerald-700 pt-1">
                Equation: <span className="font-bold">{targetEquation}</span> ({challenge.textbookRef})
              </div>
            </div>
          )}
        </div>

        {/* Sliders & Accuracy Score */}
        <div className="lg:col-span-5 space-y-4">
          {/* Accuracy Score Card */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                Curve Overlap Accuracy
              </span>
              <span
                className={`font-mono-numbers font-bold text-sm ${
                  accuracy >= 98
                    ? 'text-emerald-600'
                    : accuracy >= 75
                    ? 'text-amber-600'
                    : 'text-slate-600'
                }`}
              >
                {accuracy}% Match
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div
                className={`h-full transition-all duration-200 ${
                  accuracy >= 98 ? 'bg-emerald-500' : accuracy >= 75 ? 'bg-amber-500' : 'bg-indigo-600'
                }`}
                style={{ width: `${accuracy}%` }}
              ></div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <div>
                <span className="text-[11px] text-slate-400 block">Your Equation:</span>
                <span className="font-mono font-bold text-blue-600">{userEquation}</span>
              </div>
              <button
                onClick={() => setUserParams({ a: 1, b: 1, h: 0, k: 0 })}
                title="Reset user sliders"
                className="p-1.5 text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Interactive Sliders */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Adjust Your Transformation
            </div>

            {/* a */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700">a (Amplitude):</span>
                <span className="font-mono-numbers font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                  {formatNumber(userParams.a)}
                </span>
              </div>
              <input
                type="range"
                min="-4"
                max="4"
                step="0.25"
                value={userParams.a}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setUserParams((p) => ({ ...p, a: val === 0 ? 0.25 : val }));
                }}
                className="w-full accent-amber-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
              />
            </div>

            {/* b */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700">b (Frequency / Period):</span>
                <span className="font-mono-numbers font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded">
                  {formatNumber(userParams.b)}
                </span>
              </div>
              <input
                type="range"
                min="0.25"
                max="4"
                step="0.25"
                value={userParams.b}
                onChange={(e) => setUserParams((p) => ({ ...p, b: parseFloat(e.target.value) }))}
                className="w-full accent-sky-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
              />
            </div>

            {/* h */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700">h (Phase Shift):</span>
                <span className="font-mono-numbers font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                  {formatPiFraction(userParams.h)}
                </span>
              </div>
              <input
                type="range"
                min={-PI}
                max={PI}
                step={PI / 12}
                value={userParams.h}
                onChange={(e) => setUserParams((p) => ({ ...p, h: parseFloat(e.target.value) }))}
                className="w-full accent-emerald-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
              />
            </div>

            {/* k */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700">k (Midline / Vertical):</span>
                <span className="font-mono-numbers font-bold text-violet-600 bg-violet-50 px-2 py-0.5 rounded">
                  {formatNumber(userParams.k)}
                </span>
              </div>
              <input
                type="range"
                min="-4"
                max="4"
                step="0.5"
                value={userParams.k}
                onChange={(e) => setUserParams((p) => ({ ...p, k: parseFloat(e.target.value) }))}
                className="w-full accent-violet-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          {/* Hint Card */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-2">
            <button
              onClick={() => setShowHint(!showHint)}
              className="w-full flex items-center justify-between text-xs font-semibold text-slate-700 hover:text-slate-900"
            >
              <div className="flex items-center gap-1.5 text-amber-700">
                <HelpCircle className="w-4 h-4 text-amber-500" />
                <span>Pedagogical Clue & Hint</span>
              </div>
              <span className="text-[11px] text-slate-400">
                {showHint ? 'Hide' : 'Reveal'}
              </span>
            </button>

            {showHint && (
              <p className="text-xs text-slate-600 bg-amber-50/70 p-3 rounded-xl border border-amber-200/60 leading-relaxed">
                {challenge.hint}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
