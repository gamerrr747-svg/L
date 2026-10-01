import React, { useState } from 'react';
import { GLOSSARY_TERMS } from '../data/curriculumData';
import { BookOpen, Table, Search, Languages, CheckCircle2 } from 'lucide-react';

export const TheoryReference: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSection, setActiveSection] = useState<'matrix' | 'transformations' | 'glossary'>('matrix');

  const filteredGlossary = GLOSSARY_TERMS.filter(
    (item) =>
      item.en.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.kz.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.ru.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.definition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 mb-1">
            <span>CURRICULUM SPECIFICATIONS & GLOSSARY</span>
            <span aria-hidden="true">·</span>
            <span>Grade 10 Algebra</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Trigonometric Theory, Properties & Formulas
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Formal syllabus standards, comparative property matrix of all functions, and trilingual terminology lookup.
          </p>
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => setActiveSection('matrix')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeSection === 'matrix' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Functions Matrix
          </button>
          <button
            onClick={() => setActiveSection('transformations')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeSection === 'transformations'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Transformation Rules
          </button>
          <button
            onClick={() => setActiveSection('glossary')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeSection === 'glossary'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Trilingual Glossary
          </button>
        </div>
      </div>

      {/* SECTION 1: Functions Matrix */}
      {activeSection === 'matrix' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Core Trigonometric Functions Properties (10.2.3.1)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Comparative summary of all 6 parent trigonometric functions as defined in Chapter 2.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[11px] tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Function</th>
                    <th className="py-3 px-4">Domain D(f)</th>
                    <th className="py-3 px-4">Range E(f)</th>
                    <th className="py-3 px-4">Period T</th>
                    <th className="py-3 px-4">Parity</th>
                    <th className="py-3 px-4">Asymptotes</th>
                    <th className="py-3 px-4">Boundedness</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono-numbers">
                  <tr className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4 font-bold font-mono text-indigo-700">y = sin(x)</td>
                    <td className="py-3 px-4">x ∈ ℝ</td>
                    <td className="py-3 px-4 font-semibold text-slate-900">[-1, 1]</td>
                    <td className="py-3 px-4 font-semibold">2π</td>
                    <td className="py-3 px-4 text-emerald-700">Odd: sin(-x) = -sin(x)</td>
                    <td className="py-3 px-4 text-slate-400">None</td>
                    <td className="py-3 px-4 text-slate-700">Bounded: |sin x| ≤ 1</td>
                  </tr>
                  <tr className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4 font-bold font-mono text-sky-700">y = cos(x)</td>
                    <td className="py-3 px-4">x ∈ ℝ</td>
                    <td className="py-3 px-4 font-semibold text-slate-900">[-1, 1]</td>
                    <td className="py-3 px-4 font-semibold">2π</td>
                    <td className="py-3 px-4 text-indigo-700">Even: cos(-x) = cos(x)</td>
                    <td className="py-3 px-4 text-slate-400">None</td>
                    <td className="py-3 px-4 text-slate-700">Bounded: |cos x| ≤ 1</td>
                  </tr>
                  <tr className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4 font-bold font-mono text-amber-700">y = tan(x)</td>
                    <td className="py-3 px-4">x ≠ π/2 + kπ</td>
                    <td className="py-3 px-4 font-semibold text-slate-900">(-∞, +∞)</td>
                    <td className="py-3 px-4 font-semibold text-amber-700">π</td>
                    <td className="py-3 px-4 text-emerald-700">Odd: tan(-x) = -tan(x)</td>
                    <td className="py-3 px-4 text-rose-600 font-mono">x = π/2 + kπ</td>
                    <td className="py-3 px-4 text-slate-400">Unbounded</td>
                  </tr>
                  <tr className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4 font-bold font-mono text-orange-700">y = cot(x)</td>
                    <td className="py-3 px-4">x ≠ kπ</td>
                    <td className="py-3 px-4 font-semibold text-slate-900">(-∞, +∞)</td>
                    <td className="py-3 px-4 font-semibold text-amber-700">π</td>
                    <td className="py-3 px-4 text-emerald-700">Odd: cot(-x) = -cot(x)</td>
                    <td className="py-3 px-4 text-rose-600 font-mono">x = kπ</td>
                    <td className="py-3 px-4 text-slate-400">Unbounded</td>
                  </tr>
                  <tr className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4 font-bold font-mono text-slate-700">y = sec(x)</td>
                    <td className="py-3 px-4">x ≠ π/2 + kπ</td>
                    <td className="py-3 px-4 font-semibold text-slate-900">(-∞, -1] ∪ [1, ∞)</td>
                    <td className="py-3 px-4 font-semibold">2π</td>
                    <td className="py-3 px-4 text-indigo-700">Even: sec(-x) = sec(x)</td>
                    <td className="py-3 px-4 text-rose-600 font-mono">x = π/2 + kπ</td>
                    <td className="py-3 px-4 text-slate-400">Unbounded (|sec| ≥ 1)</td>
                  </tr>
                  <tr className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4 font-bold font-mono text-slate-700">y = csc(x)</td>
                    <td className="py-3 px-4">x ≠ kπ</td>
                    <td className="py-3 px-4 font-semibold text-slate-900">(-∞, -1] ∪ [1, ∞)</td>
                    <td className="py-3 px-4 font-semibold">2π</td>
                    <td className="py-3 px-4 text-emerald-700">Odd: csc(-x) = -csc(x)</td>
                    <td className="py-3 px-4 text-rose-600 font-mono">x = kπ</td>
                    <td className="py-3 px-4 text-slate-400">Unbounded (|csc| ≥ 1)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Curricular Notes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                10.2.3.1 Learning Outcome
              </h4>
              <p className="text-xs text-slate-700 leading-relaxed">
                Students must understand the unit circle definitions <span className="font-mono">sin α = y</span> and <span className="font-mono">cos α = x</span>, recognize the periodic recurrence of values, state the fundamental periods <span className="font-mono">2π</span> (sine/cosine) and <span className="font-mono">π</span> (tangent/cotangent), and construct the basic wave curves.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                10.2.3.2 Learning Outcome
              </h4>
              <p className="text-xs text-slate-700 leading-relaxed">
                Students must be able to sketch graphs using transformations by decomposing <span className="font-mono">y = a·f(b(x - h)) + k</span> into amplitude modification, period adjustment, horizontal phase shift, and vertical translation to a new midline.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: Transformation Rules */}
      {activeSection === 'transformations' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 block mb-1">
                The Master Transformation Formula
              </span>
              <div className="p-4 bg-slate-900 text-white rounded-xl font-mono text-center text-lg sm:text-xl font-bold">
                y = a · f( b(x - h) ) + k
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl border border-amber-200/80 bg-amber-50/50 space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-amber-600 text-white font-mono font-bold flex items-center justify-center text-xs">
                    a
                  </span>
                  <span className="font-bold text-sm text-amber-950">Vertical Stretch & Reflection</span>
                </div>
                <ul className="text-xs text-amber-900 space-y-1 pl-1 list-disc list-inside">
                  <li><span className="font-semibold">Amplitude:</span> |a| = (y_max - y_min) / 2</li>
                  <li>If <span className="font-semibold">|a| &gt; 1</span>: Vertical stretch by factor |a|</li>
                  <li>If <span className="font-semibold">0 &lt; |a| &lt; 1</span>: Vertical compression</li>
                  <li>If <span className="font-semibold">a &lt; 0</span>: Reflection upside down across the horizontal axis/midline</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl border border-sky-200/80 bg-sky-50/50 space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-sky-600 text-white font-mono font-bold flex items-center justify-center text-xs">
                    b
                  </span>
                  <span className="font-bold text-sm text-sky-950">Horizontal Frequency & Period</span>
                </div>
                <ul className="text-xs text-sky-900 space-y-1 pl-1 list-disc list-inside">
                  <li><span className="font-semibold">Fundamental Period:</span> T = 2π / |b| for sin, cos, sec, csc</li>
                  <li><span className="font-semibold">Period for tan, cot:</span> T = π / |b|</li>
                  <li>If <span className="font-semibold">|b| &gt; 1</span>: Horizontal compression (wave oscillates faster)</li>
                  <li>If <span className="font-semibold">0 &lt; |b| &lt; 1</span>: Horizontal stretch (wave elongates)</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl border border-emerald-200/80 bg-emerald-50/50 space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-emerald-600 text-white font-mono font-bold flex items-center justify-center text-xs">
                    h
                  </span>
                  <span className="font-bold text-sm text-emerald-950">Phase Shift (Horizontal Translation)</span>
                </div>
                <ul className="text-xs text-emerald-900 space-y-1 pl-1 list-disc list-inside">
                  <li>If written as <span className="font-mono">f(bx + c)</span>, phase shift is <span className="font-mono">h = -c/b</span></li>
                  <li>If <span className="font-semibold">h &gt; 0</span> (e.g. <span className="font-mono">x - π/3</span>): Shift <span className="font-semibold">RIGHT</span> by h</li>
                  <li>If <span className="font-semibold">h &lt; 0</span> (e.g. <span className="font-mono">x + π/4</span>): Shift <span className="font-semibold">LEFT</span> by |h|</li>
                  <li>All 5 landmark points shift along the x-axis by h</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl border border-violet-200/80 bg-violet-50/50 space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-violet-600 text-white font-mono font-bold flex items-center justify-center text-xs">
                    k
                  </span>
                  <span className="font-bold text-sm text-violet-950">Vertical Shift & Midline</span>
                </div>
                <ul className="text-xs text-violet-900 space-y-1 pl-1 list-disc list-inside">
                  <li><span className="font-semibold">New Midline:</span> Horizontal line y = k</li>
                  <li>If <span className="font-semibold">k &gt; 0</span>: Shift <span className="font-semibold">UPWARD</span> by k</li>
                  <li>If <span className="font-semibold">k &lt; 0</span>: Shift <span className="font-semibold">DOWNWARD</span> by |k|</li>
                  <li><span className="font-semibold">Range for sin/cos:</span> [k - |a|, k + |a|]</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: Trilingual Glossary */}
      {activeSection === 'glossary' && (
        <div className="space-y-4">
          {/* Search bar */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center gap-3">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search terminology in English, Kazakh (Қазақша), or Russian (Русский)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs text-slate-800 placeholder-slate-400 focus:outline-none"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="text-xs text-slate-400 hover:text-slate-600 font-medium"
              >
                Clear
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredGlossary.map((term, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-sm font-bold text-slate-900">{term.en}</h4>
                  <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
                    <Languages className="w-3.5 h-3.5 text-indigo-500" />
                    <span>3 Languages</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 bg-slate-50 rounded-lg">
                    <span className="text-[10px] text-slate-400 block font-semibold">ҚАЗАҚША:</span>
                    <span className="font-medium text-slate-800">{term.kz}</span>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-lg">
                    <span className="text-[10px] text-slate-400 block font-semibold">РУССКИЙ:</span>
                    <span className="font-medium text-slate-800">{term.ru}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed pt-1">
                  {term.definition}
                </p>

                <div className="text-[11px] font-mono text-indigo-700 bg-indigo-50/60 p-2 rounded-lg border border-indigo-100/60">
                  <span className="font-sans font-semibold text-indigo-900 mr-1">Example:</span>
                  {term.example}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
