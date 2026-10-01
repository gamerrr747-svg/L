import React, { useState, useMemo } from 'react';
import { InverseTrigType } from '../types/trig';
import { formatPiFraction, formatNumber, PI } from '../utils/mathUtils';
import { RotateCcw, Check, Sparkles, ArrowRightLeft } from 'lucide-react';

export const InverseFunctionsExplorer: React.FC = () => {
  const [selectedInverse, setSelectedInverse] = useState<InverseTrigType>('arcsin');
  const [inputX, setInputX] = useState<number>(0.5);
  const [showReflectionLine, setShowReflectionLine] = useState<boolean>(true);
  const [showParentBranch, setShowParentBranch] = useState<boolean>(true);

  // SVG coordinate transformation
  const width = 640;
  const height = 440;
  const padding = { top: 25, right: 35, bottom: 40, left: 45 };
  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;

  // Viewport bounds: symmetric around origin [-3.5, 3.5]
  const bound = 3.5;
  const toSvgX = (x: number) => padding.left + ((x + bound) / (2 * bound)) * plotWidth;
  const toSvgY = (y: number) => padding.top + ((bound - y) / (2 * bound)) * plotHeight;

  // Function details
  const config = useMemo(() => {
    switch (selectedInverse) {
      case 'arcsin':
        return {
          name: 'y = arcsin(x)',
          parentName: 'y = sin(x)',
          domain: '[-1, 1]',
          range: '[-π/2, π/2]',
          restrictedParentDomain: '[-π/2, π/2]',
          parentEvaluator: (x: number) => (x >= -PI / 2 && x <= PI / 2 ? Math.sin(x) : null),
          inverseEvaluator: (x: number) => (x >= -1 && x <= 1 ? Math.asin(x) : null),
          validMin: -1,
          validMax: 1,
          parity: 'Odd: arcsin(-x) = -arcsin(x)',
          trend: 'Strictly increasing',
          specialValues: [
            { x: -1, y: -PI / 2, label: 'arcsin(-1) = -π/2' },
            { x: -Math.sqrt(3) / 2, y: -PI / 3, label: 'arcsin(-√3/2) = -π/3' },
            { x: -Math.sqrt(2) / 2, y: -PI / 4, label: 'arcsin(-√2/2) = -π/4' },
            { x: -0.5, y: -PI / 6, label: 'arcsin(-1/2) = -π/6' },
            { x: 0, y: 0, label: 'arcsin(0) = 0' },
            { x: 0.5, y: PI / 6, label: 'arcsin(1/2) = π/6' },
            { x: Math.sqrt(2) / 2, y: PI / 4, label: 'arcsin(√2/2) = π/4' },
            { x: Math.sqrt(3) / 2, y: PI / 3, label: 'arcsin(√3/2) = π/3' },
            { x: 1, y: PI / 2, label: 'arcsin(1) = π/2' },
          ],
        };
      case 'arccos':
        return {
          name: 'y = arccos(x)',
          parentName: 'y = cos(x)',
          domain: '[-1, 1]',
          range: '[0, π]',
          restrictedParentDomain: '[0, π]',
          parentEvaluator: (x: number) => (x >= 0 && x <= PI ? Math.cos(x) : null),
          inverseEvaluator: (x: number) => (x >= -1 && x <= 1 ? Math.acos(x) : null),
          validMin: -1,
          validMax: 1,
          parity: 'Neither: arccos(-x) = π - arccos(x)',
          trend: 'Strictly decreasing',
          specialValues: [
            { x: -1, y: PI, label: 'arccos(-1) = π' },
            { x: -Math.sqrt(3) / 2, y: (5 * PI) / 6, label: 'arccos(-√3/2) = 5π/6' },
            { x: -Math.sqrt(2) / 2, y: (3 * PI) / 4, label: 'arccos(-√2/2) = 3π/4' },
            { x: -0.5, y: (2 * PI) / 3, label: 'arccos(-1/2) = 2π/3' },
            { x: 0, y: PI / 2, label: 'arccos(0) = π/2' },
            { x: 0.5, y: PI / 3, label: 'arccos(1/2) = π/3' },
            { x: Math.sqrt(2) / 2, y: PI / 4, label: 'arccos(√2/2) = π/4' },
            { x: Math.sqrt(3) / 2, y: PI / 6, label: 'arccos(√3/2) = π/6' },
            { x: 1, y: 0, label: 'arccos(1) = 0' },
          ],
        };
      case 'arctan':
        return {
          name: 'y = arctan(x)',
          parentName: 'y = tan(x)',
          domain: 'ℝ (-∞, +∞)',
          range: '(-π/2, π/2)',
          restrictedParentDomain: '(-π/2, π/2)',
          parentEvaluator: (x: number) => (x > -PI / 2 + 0.05 && x < PI / 2 - 0.05 ? Math.tan(x) : null),
          inverseEvaluator: (x: number) => Math.atan(x),
          validMin: -3,
          validMax: 3,
          parity: 'Odd: arctan(-x) = -arctan(x)',
          trend: 'Strictly increasing, asymptotes at y = ±π/2',
          specialValues: [
            { x: -Math.sqrt(3), y: -PI / 3, label: 'arctan(-√3) = -π/3' },
            { x: -1, y: -PI / 4, label: 'arctan(-1) = -π/4' },
            { x: -1 / Math.sqrt(3), y: -PI / 6, label: 'arctan(-1/√3) = -π/6' },
            { x: 0, y: 0, label: 'arctan(0) = 0' },
            { x: 1 / Math.sqrt(3), y: PI / 6, label: 'arctan(1/√3) = π/6' },
            { x: 1, y: PI / 4, label: 'arctan(1) = π/4' },
            { x: Math.sqrt(3), y: PI / 3, label: 'arctan(√3) = π/3' },
          ],
        };
      case 'arccot':
        return {
          name: 'y = arccot(x)',
          parentName: 'y = cot(x)',
          domain: 'ℝ (-∞, +∞)',
          range: '(0, π)',
          restrictedParentDomain: '(0, π)',
          parentEvaluator: (x: number) => (x > 0.05 && x < PI - 0.05 ? 1 / Math.tan(x) : null),
          inverseEvaluator: (x: number) => PI / 2 - Math.atan(x),
          validMin: -3,
          validMax: 3,
          parity: 'Neither: arccot(-x) = π - arccot(x)',
          trend: 'Strictly decreasing, asymptotes at y = 0, y = π',
          specialValues: [
            { x: -Math.sqrt(3), y: (5 * PI) / 6, label: 'arccot(-√3) = 5π/6' },
            { x: -1, y: (3 * PI) / 4, label: 'arccot(-1) = 3π/4' },
            { x: -1 / Math.sqrt(3), y: (2 * PI) / 3, label: 'arccot(-1/√3) = 2π/3' },
            { x: 0, y: PI / 2, label: 'arccot(0) = π/2' },
            { x: 1 / Math.sqrt(3), y: PI / 3, label: 'arccot(1/√3) = π/3' },
            { x: 1, y: PI / 4, label: 'arccot(1) = π/4' },
            { x: Math.sqrt(3), y: PI / 6, label: 'arccot(√3) = π/6' },
          ],
        };
    }
  }, [selectedInverse]);

  // Generate paths
  const samples = 400;
  const dx = (2 * bound) / samples;

  // 1. Inverse curve path
  const inversePath = useMemo(() => {
    let d = '';
    let isDrawing = false;
    for (let i = 0; i <= samples; i++) {
      const x = -bound + i * dx;
      const y = config.inverseEvaluator(x);
      if (y === null || isNaN(y) || y < -bound || y > bound) {
        isDrawing = false;
        continue;
      }
      const sx = toSvgX(x);
      const sy = toSvgY(y);
      if (!isDrawing) {
        d += ` M ${sx.toFixed(1)} ${sy.toFixed(1)}`;
        isDrawing = true;
      } else {
        d += ` L ${sx.toFixed(1)} ${sy.toFixed(1)}`;
      }
    }
    return d;
  }, [config, dx]);

  // 2. Parent curve path
  const parentPath = useMemo(() => {
    if (!showParentBranch) return '';
    let d = '';
    let isDrawing = false;
    for (let i = 0; i <= samples; i++) {
      const x = -bound + i * dx;
      const y = config.parentEvaluator(x);
      if (y === null || isNaN(y) || y < -bound || y > bound) {
        isDrawing = false;
        continue;
      }
      const sx = toSvgX(x);
      const sy = toSvgY(y);
      if (!isDrawing) {
        d += ` M ${sx.toFixed(1)} ${sy.toFixed(1)}`;
        isDrawing = true;
      } else {
        d += ` L ${sx.toFixed(1)} ${sy.toFixed(1)}`;
      }
    }
    return d;
  }, [config, showParentBranch, dx]);

  // Clamped inputX for tracking point
  const currentX = Math.max(config.validMin, Math.min(config.validMax, inputX));
  const currentInvY = config.inverseEvaluator(currentX);

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 mb-1">
            <span>CURRICULUM 10.2.3.1 (CHAPTER 2.2)</span>
            <span aria-hidden="true">·</span>
            <span>Inverse Trigonometric Functions</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Inverse Functions & Symmetry Explorer
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Since trigonometric functions repeat periodically, we restrict the domain so they become one-to-one. The graph of <span className="font-mono font-semibold text-indigo-600">y = arc(x)</span> is a perfect reflection across the line <span className="font-mono font-semibold text-amber-600">y = x</span>.
          </p>
        </div>

        {/* Function Chooser Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
          {(['arcsin', 'arccos', 'arctan', 'arccot'] as InverseTrigType[]).map((inv) => (
            <button
              key={inv}
              onClick={() => {
                setSelectedInverse(inv);
                setInputX(0.5);
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                selectedInverse === inv
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {inv}
            </button>
          ))}
        </div>
      </div>

      {/* Main Layout: Graph on Left, Controls & Table on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* SVG Canvas Stage */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 flex flex-col">
          <div className="flex items-center justify-between mb-3 text-xs">
            <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
              Symmetry across Line y = x
            </span>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-1 text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showReflectionLine}
                  onChange={(e) => setShowReflectionLine(e.target.checked)}
                  className="rounded text-amber-600 accent-amber-600"
                />
                <span>Line y = x</span>
              </label>

              <label className="flex items-center gap-1 text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showParentBranch}
                  onChange={(e) => setShowParentBranch(e.target.checked)}
                  className="rounded text-slate-600 accent-slate-600"
                />
                <span>Parent Branch</span>
              </label>
            </div>
          </div>

          <div className="relative bg-slate-50/50 rounded-xl border border-slate-200/60 overflow-hidden">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto select-none block">
              {/* Axes */}
              <line x1={toSvgX(-bound)} y1={toSvgY(0)} x2={toSvgX(bound)} y2={toSvgY(0)} stroke="#94a3b8" strokeWidth={1.5} />
              <line x1={toSvgX(0)} y1={toSvgY(-bound)} x2={toSvgX(0)} y2={toSvgY(bound)} stroke="#94a3b8" strokeWidth={1.5} />

              {/* Grid Ticks */}
              {[-3, -2, -1, 1, 2, 3].map((val) => (
                <g key={`grid-x-${val}`}>
                  <line
                    x1={toSvgX(val)}
                    y1={padding.top}
                    x2={toSvgX(val)}
                    y2={height - padding.bottom}
                    stroke="#e2e8f0"
                    strokeDasharray="2 2"
                  />
                  <text
                    x={toSvgX(val)}
                    y={toSvgY(0) + 16}
                    textAnchor="middle"
                    className="text-[10px] font-mono-numbers fill-slate-400"
                  >
                    {val}
                  </text>
                </g>
              ))}

              {[-PI, -PI / 2, PI / 2, PI].map((val, i) => (
                <g key={`grid-y-${i}`}>
                  <line
                    x1={padding.left}
                    y1={toSvgY(val)}
                    x2={width - padding.right}
                    y2={toSvgY(val)}
                    stroke="#e2e8f0"
                    strokeDasharray="2 2"
                  />
                  <text
                    x={toSvgX(0) - 8}
                    y={toSvgY(val) + 4}
                    textAnchor="end"
                    className="text-[10px] font-mono-numbers fill-slate-400"
                  >
                    {formatPiFraction(val)}
                  </text>
                </g>
              ))}

              {/* Line of Symmetry: y = x */}
              {showReflectionLine && (
                <g>
                  <line
                    x1={toSvgX(-bound)}
                    y1={toSvgY(-bound)}
                    x2={toSvgX(bound)}
                    y2={toSvgY(bound)}
                    stroke="#f59e0b"
                    strokeWidth={1.5}
                    strokeDasharray="5 3"
                  />
                  <text
                    x={toSvgX(2.2)}
                    y={toSvgY(2.4)}
                    fill="#d97706"
                    className="text-[11px] font-mono font-medium"
                  >
                    y = x
                  </text>
                </g>
              )}

              {/* Parent restricted branch */}
              {parentPath && (
                <path
                  d={parentPath}
                  fill="none"
                  stroke="#94a3b8"
                  strokeWidth={2}
                  strokeDasharray="4 2"
                />
              )}

              {/* Inverse Curve */}
              {inversePath && (
                <path
                  d={inversePath}
                  fill="none"
                  stroke="#4f46e5"
                  strokeWidth={3}
                  strokeLinecap="round"
                />
              )}

              {/* Synchronized Reflection Points */}
              {currentInvY !== null && (
                <g>
                  {/* Point on Inverse: (x, y) */}
                  <circle
                    cx={toSvgX(currentX)}
                    cy={toSvgY(currentInvY)}
                    r={6}
                    fill="#4f46e5"
                    stroke="#ffffff"
                    strokeWidth={2}
                  />
                  <text
                    x={toSvgX(currentX) + 8}
                    y={toSvgY(currentInvY) - 8}
                    fill="#4338ca"
                    className="text-[11px] font-mono-numbers font-bold"
                  >
                    P({currentX.toFixed(2)}, {formatPiFraction(currentInvY)})
                  </text>

                  {/* Reflected Point on Parent: (y, x) */}
                  {showParentBranch && (
                    <>
                      <circle
                        cx={toSvgX(currentInvY)}
                        cy={toSvgY(currentX)}
                        r={6}
                        fill="#0284c7"
                        stroke="#ffffff"
                        strokeWidth={2}
                      />
                      <text
                        x={toSvgX(currentInvY) + 8}
                        y={toSvgY(currentX) + 14}
                        fill="#0369a1"
                        className="text-[11px] font-mono-numbers font-medium"
                      >
                        P'({formatPiFraction(currentInvY)}, {currentX.toFixed(2)})
                      </text>

                      {/* Line connecting the two symmetric points */}
                      <line
                        x1={toSvgX(currentX)}
                        y1={toSvgY(currentInvY)}
                        x2={toSvgX(currentInvY)}
                        y2={toSvgY(currentX)}
                        stroke="#f59e0b"
                        strokeWidth={1}
                        strokeDasharray="2 2"
                      />
                    </>
                  )}
                </g>
              )}
            </svg>
          </div>

          {/* Interactive Coordinate Tracker Slider */}
          <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700">
                Inspect Input x ∈ {config.domain}:
              </span>
              <span className="font-mono font-bold text-indigo-700">
                x = {currentX.toFixed(2)}
              </span>
            </div>
            <input
              type="range"
              min={config.validMin}
              max={config.validMax}
              step={0.05}
              value={currentX}
              onChange={(e) => setInputX(parseFloat(e.target.value))}
              className="w-full accent-indigo-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {/* Right: Properties & Reference Table */}
        <div className="lg:col-span-5 space-y-4">
          {/* Card: Definition & Boundaries */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-mono text-base font-bold text-indigo-900">
                {config.name}
              </h3>
              <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                Inverse of {config.parentName}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/60">
                <span className="text-[11px] text-slate-500 block">Domain D(f)</span>
                <span className="font-mono font-bold text-slate-800">{config.domain}</span>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/60">
                <span className="text-[11px] text-slate-500 block">Range E(f)</span>
                <span className="font-mono font-bold text-slate-800">{config.range}</span>
              </div>

              <div className="col-span-2 p-2.5 bg-slate-50 rounded-xl border border-slate-200/60">
                <span className="text-[11px] text-slate-500 block">Restricted Parent Domain</span>
                <span className="font-mono font-semibold text-slate-800">
                  x ∈ {config.restrictedParentDomain}
                </span>
              </div>

              <div className="col-span-2 p-2.5 bg-slate-50 rounded-xl border border-slate-200/60">
                <span className="text-[11px] text-slate-500 block">Parity</span>
                <span className="text-slate-800 font-medium">{config.parity}</span>
              </div>

              <div className="col-span-2 p-2.5 bg-slate-50 rounded-xl border border-slate-200/60">
                <span className="text-[11px] text-slate-500 block">Monotonicity</span>
                <span className="text-slate-800 font-medium">{config.trend}</span>
              </div>
            </div>
          </div>

          {/* Card: Special Benchmark Values */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
              Standard Benchmark Values (from Textbook)
            </span>

            <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
              {config.specialValues.map((sv, idx) => (
                <button
                  key={idx}
                  onClick={() => setInputX(sv.x)}
                  className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-indigo-50/60 text-xs transition-colors border border-transparent hover:border-indigo-100"
                >
                  <span className="font-mono text-slate-700">{sv.label}</span>
                  <span className="text-[11px] text-indigo-600 font-medium hover:underline">
                    Inspect
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
