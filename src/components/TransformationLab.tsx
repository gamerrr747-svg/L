import React, { useState, useMemo } from 'react';
import { TrigFunctionType, TransformationParams, TransformationStep } from '../types/trig';
import { PRESET_FUNCTIONS } from '../data/curriculumData';
import { calculateProperties, buildEquationString, formatPiFraction, formatNumber, PI } from '../utils/mathUtils';
import { GraphCanvas } from './GraphCanvas';
import { Sliders, Layers, ChevronRight, CheckCircle2, RotateCcw, Info, Sparkles } from 'lucide-react';

interface TransformationLabProps {
  initialFunc?: TrigFunctionType;
  initialParams?: TransformationParams;
}

export const TransformationLab: React.FC<TransformationLabProps> = ({
  initialFunc = 'sin',
  initialParams = { a: 2, b: 2, h: PI / 4, k: 1 },
}) => {
  const [func, setFunc] = useState<TrigFunctionType>(initialFunc);
  const [params, setParams] = useState<TransformationParams>(initialParams);

  // Display toggles
  const [showBase, setShowBase] = useState<boolean>(true);
  const [showMidline, setShowMidline] = useState<boolean>(true);
  const [showAmplitudeBand, setShowAmplitudeBand] = useState<boolean>(true);
  const [showPeriodBracket, setShowPeriodBracket] = useState<boolean>(true);
  const [showLandmarks, setShowLandmarks] = useState<boolean>(true);

  // Active step in the step-by-step transformation inspector (0 to 4, or null for final)
  const [activeStep, setActiveStep] = useState<number | null>(null);

  // Computed properties
  const properties = useMemo(() => calculateProperties(func, params), [func, params]);
  const equation = useMemo(() => buildEquationString(func, params), [func, params]);

  // Step-by-step transformation breakdown
  const steps: TransformationStep[] = useMemo(() => {
    return [
      {
        stepNumber: 0,
        title: 'Step 0: Parent Function',
        description: `Start with the basic graph of y = ${func}(x). Amplitude is 1, fundamental period is ${
          func === 'tan' || func === 'cot' ? 'π' : '2π'
        }, centered at y = 0.`,
        equation: `y = ${func}(x)`,
        params: { a: 1, b: 1, h: 0, k: 0 },
        color: '#94a3b8',
      },
      {
        stepNumber: 1,
        title: 'Step 1: Horizontal Stretch/Shrink (Frequency b)',
        description: `Apply b = ${formatNumber(params.b)}. The period scales to T = ${
          func === 'tan' || func === 'cot' ? 'π' : '2π'
        }/|b| = ${properties.fundamentalPeriod}. ${
          Math.abs(params.b) > 1
            ? `Graph is compressed horizontally by factor 1/${formatNumber(Math.abs(params.b))}.`
            : Math.abs(params.b) < 1
            ? `Graph is stretched horizontally by factor ${formatNumber(1 / Math.abs(params.b))}.`
            : 'No horizontal change in period.'
        }`,
        equation: buildEquationString(func, { a: 1, b: params.b, h: 0, k: 0 }),
        params: { a: 1, b: params.b, h: 0, k: 0 },
        color: '#0284c7',
      },
      {
        stepNumber: 2,
        title: 'Step 2: Horizontal Translation (Phase Shift h)',
        description:
          Math.abs(params.h) < 0.001
            ? 'No horizontal shift (h = 0).'
            : `Shift the curve ${formatPiFraction(Math.abs(params.h))} units to the ${
                params.h > 0 ? 'RIGHT' : 'LEFT'
              }. Notice how all key points translate along the x-axis.`,
        equation: buildEquationString(func, { a: 1, b: params.b, h: params.h, k: 0 }),
        params: { a: 1, b: params.b, h: params.h, k: 0 },
        color: '#059669',
      },
      {
        stepNumber: 3,
        title: 'Step 3: Vertical Stretch & Reflection (Amplitude a)',
        description: `Scale all y-coordinates by a = ${formatNumber(params.a)}. Amplitude becomes |a| = ${Math.abs(
          params.a
        )}.${
          params.a < 0 ? ' Negative sign reflects the curve upside down across the midline.' : ''
        }`,
        equation: buildEquationString(func, { a: params.a, b: params.b, h: params.h, k: 0 }),
        params: { a: params.a, b: params.b, h: params.h, k: 0 },
        color: '#d97706',
      },
      {
        stepNumber: 4,
        title: 'Step 4: Vertical Translation (Midline k)',
        description:
          Math.abs(params.k) < 0.001
            ? 'No vertical shift (k = 0). Midline remains at y = 0.'
            : `Translate the entire curve ${params.k > 0 ? 'UPWARD' : 'DOWNWARD'} by ${Math.abs(
                params.k
              )} units. The new centerline (midline) is y = ${formatNumber(params.k)}. Range becomes ${
                properties.range
              }.`,
        equation: buildEquationString(func, params),
        params: params,
        color: '#2563eb',
      },
    ];
  }, [func, params, properties]);

  // Current preview params (if a step is being inspected)
  const activeStepObj = activeStep !== null ? steps[activeStep] : null;

  const handleApplyPreset = (presetId: string) => {
    const found = PRESET_FUNCTIONS.find((p) => p.id === presetId);
    if (found) {
      setFunc(found.func);
      setParams({ ...found.params });
      setActiveStep(null);
    }
  };

  const handleResetToParent = () => {
    setParams({ a: 1, b: 1, h: 0, k: 0 });
    setActiveStep(null);
  };

  return (
    <div className="space-y-6">
      {/* Standards Header & Goal Banner */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 mb-1">
            <span>CURRICULUM 10.2.3.2</span>
            <span aria-hidden="true">·</span>
            <span>Function Graphing by Transformations</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Trigonometric Transformation Studio
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Model the general equation <span className="font-mono text-indigo-600 font-semibold">y = a·f(b(x - h)) + k</span> and inspect how amplitude, period, phase shift, and midline transform the parent curve.
          </p>
        </div>

        {/* Function Chooser Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl overflow-x-auto no-scrollbar">
          {(['sin', 'cos', 'tan', 'cot', 'sec', 'csc'] as TrigFunctionType[]).map((f) => (
            <button
              key={f}
              onClick={() => {
                setFunc(f);
                setActiveStep(null);
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors uppercase ${
                func === f ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Graph Stage on Left, Controls & Metrics on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Interactive Canvas (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <GraphCanvas
            func={func}
            params={params}
            showBase={showBase}
            showMidline={showMidline}
            showAmplitudeBand={showAmplitudeBand}
            showPeriodBracket={showPeriodBracket}
            showLandmarks={showLandmarks}
            stepParams={activeStepObj ? activeStepObj.params : null}
            stepTitle={activeStepObj ? `${activeStepObj.title}: ${activeStepObj.equation}` : undefined}
          />

          {/* Canvas Feature Toggles */}
          <div className="bg-white rounded-xl p-3 border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
            <span className="font-semibold text-slate-700">Display Layers:</span>
            <div className="flex flex-wrap items-center gap-3">
              <label className="flex items-center gap-1.5 text-slate-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={showBase}
                  onChange={(e) => setShowBase(e.target.checked)}
                  className="rounded text-indigo-600 accent-indigo-600"
                />
                <span>Parent Ghost</span>
              </label>

              <label className="flex items-center gap-1.5 text-slate-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={showMidline}
                  onChange={(e) => setShowMidline(e.target.checked)}
                  className="rounded text-violet-600 accent-violet-600"
                />
                <span>Midline (y = k)</span>
              </label>

              <label className="flex items-center gap-1.5 text-slate-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={showAmplitudeBand}
                  onChange={(e) => setShowAmplitudeBand(e.target.checked)}
                  className="rounded text-sky-600 accent-sky-600"
                />
                <span>Amplitude Envelope</span>
              </label>

              <label className="flex items-center gap-1.5 text-slate-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={showPeriodBracket}
                  onChange={(e) => setShowPeriodBracket(e.target.checked)}
                  className="rounded text-sky-700 accent-sky-700"
                />
                <span>Period Bracket (T)</span>
              </label>

              <label className="flex items-center gap-1.5 text-slate-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={showLandmarks}
                  onChange={(e) => setShowLandmarks(e.target.checked)}
                  className="rounded text-indigo-600 accent-indigo-600"
                />
                <span>5 Key Points</span>
              </label>
            </div>
          </div>

          {/* Step-by-Step Transformation Sequence (Textbook Methodology) */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Step-by-Step Transformation Walkthrough
                </h3>
              </div>
              <button
                onClick={() => setActiveStep(null)}
                className={`text-xs px-2.5 py-1 rounded-md font-medium transition-colors ${
                  activeStep === null
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200'
                }`}
              >
                Full Transformed Graph
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Follow the exact 4-step sequence from Grade 10 textbooks to construct <span className="font-mono font-medium text-indigo-600">{equation}</span> from parent <span className="font-mono">y = {func}(x)</span>:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-2 pt-1">
              {steps.map((st) => {
                const isActive = activeStep === st.stepNumber;
                return (
                  <button
                    key={st.stepNumber}
                    onClick={() => setActiveStep(st.stepNumber)}
                    className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                      isActive
                        ? 'border-indigo-600 bg-indigo-50/60 shadow-xs ring-2 ring-indigo-600/10'
                        : 'border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-slate-100/50'
                    }`}
                  >
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider block text-slate-400">
                        Step {st.stepNumber}
                      </span>
                      <span className="text-xs font-semibold text-slate-800 line-clamp-1 mt-0.5">
                        {st.stepNumber === 0
                          ? 'Parent'
                          : st.stepNumber === 1
                          ? 'Period (b)'
                          : st.stepNumber === 2
                          ? 'Phase (h)'
                          : st.stepNumber === 3
                          ? 'Amplitude (a)'
                          : 'Shift (k)'}
                      </span>
                    </div>
                    <span className="text-[11px] font-mono font-medium text-indigo-600 mt-2 block truncate">
                      {st.equation}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Expanded details for selected step */}
            {activeStepObj && (
              <div className="mt-3 p-3.5 bg-indigo-50/70 border border-indigo-100 rounded-xl text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-indigo-900">{activeStepObj.title}</span>
                  <span className="font-mono font-semibold text-indigo-700 bg-white px-2 py-0.5 rounded border border-indigo-200 text-[11px]">
                    {activeStepObj.equation}
                  </span>
                </div>
                <p className="text-indigo-800/90 leading-relaxed pt-1">
                  {activeStepObj.description}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right: Parameter Controls & Live Properties (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Active Equation Box */}
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between text-xs text-indigo-200">
              <span className="uppercase tracking-wider font-semibold text-[11px]">Active Function</span>
              <button
                onClick={handleResetToParent}
                className="flex items-center gap-1 hover:text-white transition-colors text-[11px]"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset to Parent</span>
              </button>
            </div>

            <div className="font-mono text-xl sm:text-2xl font-bold tracking-tight text-white py-1">
              {equation}
            </div>

            {/* Quick Presets Dropdown */}
            <div className="pt-2 border-t border-indigo-800/50 flex items-center justify-between gap-2">
              <span className="text-[11px] text-indigo-200 font-medium shrink-0">Textbook Presets:</span>
              <select
                onChange={(e) => handleApplyPreset(e.target.value)}
                defaultValue=""
                className="bg-indigo-900/80 hover:bg-indigo-900 text-xs text-white px-2.5 py-1.5 rounded-lg border border-indigo-700/60 focus:outline-none cursor-pointer w-full max-w-[210px] truncate"
              >
                <option value="" disabled>Select textbook problem...</option>
                {PRESET_FUNCTIONS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Transformation Sliders Card */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-indigo-600" />
                Transformation Sliders
              </span>
              <span className="text-[11px] text-slate-400">
                y = a·{func}(b(x - h)) + k
              </span>
            </div>

            {/* 1. a (Amplitude / Vertical Scale) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <label className="font-semibold text-slate-800">
                  <span className="text-amber-600 font-mono font-bold">a</span> : Amplitude & Reflection
                </label>
                <span className="font-mono-numbers font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                  {formatNumber(params.a)} {params.a < 0 ? '(Reflected)' : ''}
                </span>
              </div>
              <input
                type="range"
                min="-4"
                max="4"
                step="0.25"
                value={params.a}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setParams((p) => ({ ...p, a: val === 0 ? 0.25 : val }));
                  setActiveStep(null);
                }}
                className="w-full accent-amber-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono-numbers">
                <span>-4.0</span>
                <span>-1.0</span>
                <span>1.0</span>
                <span>+4.0</span>
              </div>
            </div>

            {/* 2. b (Frequency / Period Factor) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <label className="font-semibold text-slate-800">
                  <span className="text-sky-600 font-mono font-bold">b</span> : Period Factor (Frequency)
                </label>
                <span className="font-mono-numbers font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                  {formatNumber(params.b)} → T = {properties.fundamentalPeriod}
                </span>
              </div>
              <input
                type="range"
                min="0.25"
                max="4"
                step="0.25"
                value={params.b}
                onChange={(e) => {
                  setParams((p) => ({ ...p, b: parseFloat(e.target.value) }));
                  setActiveStep(null);
                }}
                className="w-full accent-sky-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono-numbers">
                <span>0.25 (Stretch)</span>
                <span>1.0 (Normal)</span>
                <span>2.0 (Double)</span>
                <span>4.0 (Compress)</span>
              </div>
            </div>

            {/* 3. h (Phase Shift) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <label className="font-semibold text-slate-800">
                  <span className="text-emerald-600 font-mono font-bold">h</span> : Phase Shift (Horizontal)
                </label>
                <span className="font-mono-numbers font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                  {formatPiFraction(params.h)} ({params.h > 0 ? 'Right' : params.h < 0 ? 'Left' : '0'})
                </span>
              </div>
              <input
                type="range"
                min={-PI}
                max={PI}
                step={PI / 12}
                value={params.h}
                onChange={(e) => {
                  setParams((p) => ({ ...p, h: parseFloat(e.target.value) }));
                  setActiveStep(null);
                }}
                className="w-full accent-emerald-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono-numbers">
                <span>-π (Left)</span>
                <span>-π/2</span>
                <span>0</span>
                <span>π/2</span>
                <span>+π (Right)</span>
              </div>
            </div>

            {/* 4. k (Vertical Shift / Midline) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <label className="font-semibold text-slate-800">
                  <span className="text-violet-600 font-mono font-bold">k</span> : Vertical Translation (Midline)
                </label>
                <span className="font-mono-numbers font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                  {formatNumber(params.k)} (Midline y = {formatNumber(params.k)})
                </span>
              </div>
              <input
                type="range"
                min="-4"
                max="4"
                step="0.5"
                value={params.k}
                onChange={(e) => {
                  setParams((p) => ({ ...p, k: parseFloat(e.target.value) }));
                  setActiveStep(null);
                }}
                className="w-full accent-violet-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono-numbers">
                <span>-4.0 (Down)</span>
                <span>-2.0</span>
                <span>0.0</span>
                <span>+2.0</span>
                <span>+4.0 (Up)</span>
              </div>
            </div>
          </div>

          {/* Properties Card (Curriculum 10.2.3.1 & 10.2.3.2 Analysis) */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-indigo-600" />
              Calculated Mathematical Properties
            </span>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/60">
                <span className="text-[11px] text-slate-500 block">Amplitude |a|</span>
                <span className="font-mono-numbers font-bold text-slate-800 text-sm">
                  {Math.abs(params.a)}
                </span>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/60">
                <span className="text-[11px] text-slate-500 block">Period T</span>
                <span className="font-mono-numbers font-bold text-slate-800 text-sm">
                  {properties.fundamentalPeriod}
                </span>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/60">
                <span className="text-[11px] text-slate-500 block">Midline</span>
                <span className="font-mono-numbers font-bold text-slate-800 text-sm">
                  y = {formatNumber(params.k)}
                </span>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/60">
                <span className="text-[11px] text-slate-500 block">Phase Shift h</span>
                <span className="font-mono-numbers font-bold text-slate-800 text-sm">
                  {properties.phaseShift}
                </span>
              </div>

              <div className="col-span-2 p-2.5 bg-slate-50 rounded-xl border border-slate-200/60">
                <span className="text-[11px] text-slate-500 block">Range E(f)</span>
                <span className="font-mono-numbers font-semibold text-slate-800">
                  {properties.range}
                </span>
              </div>

              <div className="col-span-2 p-2.5 bg-slate-50 rounded-xl border border-slate-200/60">
                <span className="text-[11px] text-slate-500 block">Domain D(f)</span>
                <span className="font-mono-numbers font-semibold text-slate-800">
                  {properties.domain}
                </span>
              </div>

              {properties.asymptotes && (
                <div className="col-span-2 p-2.5 bg-rose-50/70 border border-rose-100 rounded-xl">
                  <span className="text-[11px] text-rose-700 block font-medium">Vertical Asymptotes</span>
                  <span className="font-mono-numbers font-semibold text-rose-900 text-xs">
                    {properties.asymptotes}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
