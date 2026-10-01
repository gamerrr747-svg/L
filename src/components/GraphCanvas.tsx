import React, { useRef, useState, useMemo } from 'react';
import { TrigFunctionType, TransformationParams, LandmarkPoint } from '../types/trig';
import { evaluateTransformed, evaluateTrig, formatPiFraction, formatNumber, PI } from '../utils/mathUtils';
import { ZoomIn, ZoomOut, Maximize2, Eye, EyeOff } from 'lucide-react';

interface GraphCanvasProps {
  func: TrigFunctionType;
  params: TransformationParams;
  targetParams?: TransformationParams | null;
  showBase?: boolean;
  showMidline?: boolean;
  showAmplitudeBand?: boolean;
  showPeriodBracket?: boolean;
  showLandmarks?: boolean;
  stepParams?: TransformationParams | null;
  stepTitle?: string;
  className?: string;
  onPointClick?: (point: LandmarkPoint) => void;
}

export const GraphCanvas: React.FC<GraphCanvasProps> = ({
  func,
  params,
  targetParams = null,
  showBase = true,
  showMidline = true,
  showAmplitudeBand = true,
  showPeriodBracket = true,
  showLandmarks = true,
  stepParams = null,
  stepTitle,
  className = '',
  onPointClick,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [viewWindow, setViewWindow] = useState<{ xMin: number; xMax: number; yMin: number; yMax: number }>({
    xMin: -1.25 * PI,
    xMax: 3.25 * PI,
    yMin: -5,
    yMax: 5,
  });

  const [hoverPos, setHoverPos] = useState<{ x: number; y: number; canvasX: number; canvasY: number } | null>(null);
  const [activeTooltip, setActiveTooltip] = useState<LandmarkPoint | null>(null);

  // SVG coordinate transformation
  const width = 800;
  const height = 460;
  const padding = { top: 25, right: 35, bottom: 45, left: 45 };

  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;

  const toSvgX = (x: number) => {
    return padding.left + ((x - viewWindow.xMin) / (viewWindow.xMax - viewWindow.xMin)) * plotWidth;
  };

  const toSvgY = (y: number) => {
    return padding.top + ((viewWindow.yMax - y) / (viewWindow.yMax - viewWindow.yMin)) * plotHeight;
  };

  const toMathX = (svgX: number) => {
    return viewWindow.xMin + ((svgX - padding.left) / plotWidth) * (viewWindow.xMax - viewWindow.xMin);
  };

  const toMathY = (svgY: number) => {
    return viewWindow.yMax - ((svgY - padding.top) / plotHeight) * (viewWindow.yMax - viewWindow.yMin);
  };

  // Zoom handlers
  const handleZoom = (direction: 'in' | 'out') => {
    const factor = direction === 'in' ? 0.8 : 1.25;
    setViewWindow((prev) => {
      const xCenter = (prev.xMin + prev.xMax) / 2;
      const yCenter = (prev.yMin + prev.yMax) / 2;
      const halfX = ((prev.xMax - prev.xMin) * factor) / 2;
      const halfY = ((prev.yMax - prev.yMin) * factor) / 2;
      return {
        xMin: xCenter - halfX,
        xMax: xCenter + halfX,
        yMin: Math.max(-12, yCenter - halfY),
        yMax: Math.min(12, yCenter + halfY),
      };
    });
  };

  const handleResetView = () => {
    setViewWindow({
      xMin: -1.25 * PI,
      xMax: 3.25 * PI,
      yMin: -5,
      yMax: 5,
    });
  };

  // Generate X-ticks (multiples of pi/4 or pi/2)
  const xTicks = useMemo(() => {
    const ticks: { val: number; label: string }[] = [];
    const step = (viewWindow.xMax - viewWindow.xMin) > 4 * PI ? PI : PI / 2;
    const start = Math.floor(viewWindow.xMin / step) * step;
    const end = Math.ceil(viewWindow.xMax / step) * step;

    for (let x = start; x <= end + 0.001; x += step) {
      ticks.push({
        val: x,
        label: formatPiFraction(x, 0.01),
      });
    }
    return ticks;
  }, [viewWindow.xMin, viewWindow.xMax]);

  // Generate Y-ticks (integers)
  const yTicks = useMemo(() => {
    const ticks: number[] = [];
    const step = (viewWindow.yMax - viewWindow.yMin) > 12 ? 2 : 1;
    const start = Math.ceil(viewWindow.yMin / step) * step;
    const end = Math.floor(viewWindow.yMax / step) * step;

    for (let y = start; y <= end; y += step) {
      ticks.push(y);
    }
    return ticks;
  }, [viewWindow.yMin, viewWindow.yMax]);

  // Curve sampling helper
  const generateCurvePath = (evaluateFn: (x: number) => number | null, samples = 600) => {
    const dx = (viewWindow.xMax - viewWindow.xMin) / samples;
    let d = '';
    let isDrawing = false;

    for (let i = 0; i <= samples; i++) {
      const x = viewWindow.xMin + i * dx;
      const y = evaluateFn(x);

      if (y === null || isNaN(y) || y < viewWindow.yMin - 3 || y > viewWindow.yMax + 3) {
        isDrawing = false;
        continue;
      }

      const svgX = toSvgX(x);
      const svgY = toSvgY(y);

      if (!isDrawing) {
        d += ` M ${svgX.toFixed(1)} ${svgY.toFixed(1)}`;
        isDrawing = true;
      } else {
        d += ` L ${svgX.toFixed(1)} ${svgY.toFixed(1)}`;
      }
    }
    return d;
  };

  // 1. Transformed curve
  const activePath = useMemo(() => {
    return generateCurvePath((x) => evaluateTransformed(func, params, x));
  }, [func, params, viewWindow]);

  // 2. Base parent curve (ghost reference)
  const basePath = useMemo(() => {
    if (!showBase) return '';
    return generateCurvePath((x) => evaluateTrig(func, x));
  }, [func, showBase, viewWindow]);

  // 3. Step intermediate curve (if step preview active)
  const stepPath = useMemo(() => {
    if (!stepParams) return '';
    return generateCurvePath((x) => evaluateTransformed(func, stepParams, x));
  }, [func, stepParams, viewWindow]);

  // 4. Target curve for challenges
  const targetPath = useMemo(() => {
    if (!targetParams) return '';
    return generateCurvePath((x) => evaluateTransformed(func, targetParams, x));
  }, [func, targetParams, viewWindow]);

  // Key landmark points
  const landmarks = useMemo(() => {
    if (!showLandmarks) return [];
    const absB = Math.abs(params.b) || 1;
    const period = (func === 'tan' || func === 'cot' ? PI : 2 * PI) / absB;
    const pts: LandmarkPoint[] = [];

    // Search cycles visible in viewport
    const minCycle = Math.floor((viewWindow.xMin - params.h) / period) - 1;
    const maxCycle = Math.ceil((viewWindow.xMax - params.h) / period) + 1;

    for (let c = minCycle; c <= maxCycle; c++) {
      const cycleStart = params.h + c * period;

      if (func === 'sin') {
        const quarter = period / 4;
        const ptsCycle: [number, number, 'midline' | 'max' | 'min', string][] = [
          [cycleStart, params.k, 'midline', 'Midline Crossing'],
          [cycleStart + quarter, params.k + params.a, params.a > 0 ? 'max' : 'min', params.a > 0 ? 'Peak' : 'Trough'],
          [cycleStart + 2 * quarter, params.k, 'midline', 'Midline Crossing'],
          [cycleStart + 3 * quarter, params.k - params.a, params.a > 0 ? 'min' : 'max', params.a > 0 ? 'Trough' : 'Peak'],
        ];

        for (const [x, y, type, label] of ptsCycle) {
          if (x >= viewWindow.xMin && x <= viewWindow.xMax && y >= viewWindow.yMin && y <= viewWindow.yMax) {
            pts.push({
              x,
              y,
              label: `${label} (${formatPiFraction(x)}, ${formatNumber(y)})`,
              type,
            });
          }
        }
      } else if (func === 'cos') {
        const quarter = period / 4;
        const ptsCycle: [number, number, 'midline' | 'max' | 'min', string][] = [
          [cycleStart, params.k + params.a, params.a > 0 ? 'max' : 'min', params.a > 0 ? 'Peak' : 'Trough'],
          [cycleStart + quarter, params.k, 'midline', 'Midline Crossing'],
          [cycleStart + 2 * quarter, params.k - params.a, params.a > 0 ? 'min' : 'max', params.a > 0 ? 'Trough' : 'Peak'],
          [cycleStart + 3 * quarter, params.k, 'midline', 'Midline Crossing'],
        ];

        for (const [x, y, type, label] of ptsCycle) {
          if (x >= viewWindow.xMin && x <= viewWindow.xMax && y >= viewWindow.yMin && y <= viewWindow.yMax) {
            pts.push({
              x,
              y,
              label: `${label} (${formatPiFraction(x)}, ${formatNumber(y)})`,
              type,
            });
          }
        }
      } else if (func === 'tan') {
        if (cycleStart >= viewWindow.xMin && cycleStart <= viewWindow.xMax) {
          pts.push({
            x: cycleStart,
            y: params.k,
            label: `Inflection Point (${formatPiFraction(cycleStart)}, ${formatNumber(params.k)})`,
            type: 'midline',
          });
        }
      }
    }

    return pts;
  }, [func, params, showLandmarks, viewWindow]);

  // Vertical Asymptotes for tan/cot/sec/csc
  const asymptotes = useMemo(() => {
    if (func === 'sin' || func === 'cos') return [];
    const absB = Math.abs(params.b) || 1;
    const list: number[] = [];

    if (func === 'tan' || func === 'sec') {
      const step = PI / absB;
      const baseAsymptote = params.h + PI / (2 * absB);
      const minK = Math.floor((viewWindow.xMin - baseAsymptote) / step) - 1;
      const maxK = Math.ceil((viewWindow.xMax - baseAsymptote) / step) + 1;

      for (let k = minK; k <= maxK; k++) {
        const x = baseAsymptote + k * step;
        if (x >= viewWindow.xMin - 0.2 && x <= viewWindow.xMax + 0.2) {
          list.push(x);
        }
      }
    } else if (func === 'cot' || func === 'csc') {
      const step = PI / absB;
      const baseAsymptote = params.h;
      const minK = Math.floor((viewWindow.xMin - baseAsymptote) / step) - 1;
      const maxK = Math.ceil((viewWindow.xMax - baseAsymptote) / step) + 1;

      for (let k = minK; k <= maxK; k++) {
        const x = baseAsymptote + k * step;
        if (x >= viewWindow.xMin - 0.2 && x <= viewWindow.xMax + 0.2) {
          list.push(x);
        }
      }
    }
    return list;
  }, [func, params, viewWindow]);

  // Mouse move over SVG for coordinate crosshair
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const svgX = ((e.clientX - rect.left) / rect.width) * width;
    const svgY = ((e.clientY - rect.top) / rect.height) * height;

    if (
      svgX >= padding.left &&
      svgX <= width - padding.right &&
      svgY >= padding.top &&
      svgY <= height - padding.bottom
    ) {
      const mathX = toMathX(svgX);
      const mathY = toMathY(svgY);
      setHoverPos({ x: mathX, y: mathY, canvasX: svgX, canvasY: svgY });
    } else {
      setHoverPos(null);
    }
  };

  const periodLength = (func === 'tan' || func === 'cot' ? PI : 2 * PI) / (Math.abs(params.b) || 1);
  const periodStart = params.h;
  const periodEnd = params.h + periodLength;

  return (
    <div className={`relative bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col ${className}`}>
      {/* Top Graph Toolbar */}
      <div className="px-4 py-2.5 bg-slate-50/90 border-b border-slate-200 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-slate-700 uppercase tracking-wider text-[11px]">
            Interactive Graph Stage
          </span>
          {stepTitle && (
            <span className="text-amber-800 font-medium bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded text-[11px]">
              {stepTitle}
            </span>
          )}
        </div>

        {/* Zoom & View Actions */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => handleZoom('in')}
            title="Zoom In"
            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 rounded-lg transition-colors"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => handleZoom('out')}
            title="Zoom Out"
            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 rounded-lg transition-colors"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleResetView}
            title="Reset to default interval [-π, 3π]"
            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 rounded-lg transition-colors"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="relative w-full overflow-hidden bg-slate-950/2 flex-1 min-h-[360px]" ref={containerRef}>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full select-none cursor-crosshair block"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => {
            setHoverPos(null);
            setActiveTooltip(null);
          }}
        >
          <defs>
            {/* Shaded amplitude pattern */}
            <linearGradient id="ampGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.12" />
              <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.04" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.12" />
            </linearGradient>
            {/* Clip to plot area */}
            <clipPath id="plotClip">
              <rect
                x={padding.left}
                y={padding.top}
                width={plotWidth}
                height={plotHeight}
              />
            </clipPath>
          </defs>

          {/* Background Plot Area */}
          <rect
            x={padding.left}
            y={padding.top}
            width={plotWidth}
            height={plotHeight}
            fill="#ffffff"
          />

          {/* Grid Lines - Vertical (X) */}
          {xTicks.map((tick, i) => {
            const svgX = toSvgX(tick.val);
            if (svgX < padding.left || svgX > width - padding.right) return null;
            const isOrigin = Math.abs(tick.val) < 0.001;
            return (
              <g key={`xtick-${i}`}>
                <line
                  x1={svgX}
                  y1={padding.top}
                  x2={svgX}
                  y2={height - padding.bottom}
                  stroke={isOrigin ? '#94a3b8' : '#e2e8f0'}
                  strokeWidth={isOrigin ? 1.5 : 1}
                  strokeDasharray={isOrigin ? undefined : '2 2'}
                />
                <text
                  x={svgX}
                  y={height - padding.bottom + 18}
                  textAnchor="middle"
                  className="text-[11px] font-mono-numbers fill-slate-500 select-none"
                >
                  {tick.label}
                </text>
              </g>
            );
          })}

          {/* Grid Lines - Horizontal (Y) */}
          {yTicks.map((yVal, i) => {
            const svgY = toSvgY(yVal);
            if (svgY < padding.top || svgY > height - padding.bottom) return null;
            const isOrigin = yVal === 0;
            return (
              <g key={`ytick-${i}`}>
                <line
                  x1={padding.left}
                  y1={svgY}
                  x2={width - padding.right}
                  y2={svgY}
                  stroke={isOrigin ? '#94a3b8' : '#e2e8f0'}
                  strokeWidth={isOrigin ? 1.5 : 1}
                  strokeDasharray={isOrigin ? undefined : '2 2'}
                />
                <text
                  x={padding.left - 10}
                  y={svgY + 4}
                  textAnchor="end"
                  className="text-[11px] font-mono-numbers fill-slate-500 select-none"
                >
                  {yVal}
                </text>
              </g>
            );
          })}

          {/* Content clipped inside plot bounds */}
          <g clipPath="url(#plotClip)">
            {/* Amplitude Envelope Band for Sine/Cosine */}
            {showAmplitudeBand && (func === 'sin' || func === 'cos') && (
              <rect
                x={padding.left}
                y={toSvgY(params.k + Math.abs(params.a))}
                width={plotWidth}
                height={Math.max(0, toSvgY(params.k - Math.abs(params.a)) - toSvgY(params.k + Math.abs(params.a)))}
                fill="url(#ampGradient)"
              />
            )}

            {/* Midline Line y = k */}
            {showMidline && (
              <g>
                <line
                  x1={padding.left}
                  y1={toSvgY(params.k)}
                  x2={width - padding.right}
                  y2={toSvgY(params.k)}
                  stroke="#8b5cf6"
                  strokeWidth="1.5"
                  strokeDasharray="5 3"
                />
                <text
                  x={width - padding.right - 8}
                  y={toSvgY(params.k) - 6}
                  textAnchor="end"
                  fill="#7c3aed"
                  className="text-[10px] font-mono-numbers font-medium"
                >
                  midline y = {formatNumber(params.k)}
                </text>
              </g>
            )}

            {/* Asymptotes for tan/cot/sec/csc */}
            {asymptotes.map((asympX, i) => (
              <line
                key={`asymp-${i}`}
                x1={toSvgX(asympX)}
                y1={padding.top}
                x2={toSvgX(asympX)}
                y2={height - padding.bottom}
                stroke="#f43f5e"
                strokeWidth="1.2"
                strokeDasharray="4 3"
              />
            ))}

            {/* 1 Cycle Period Bracket */}
            {showPeriodBracket && periodStart >= viewWindow.xMin - 1 && periodEnd <= viewWindow.xMax + 1 && (
              <g>
                <line
                  x1={toSvgX(periodStart)}
                  y1={toSvgY(params.k)}
                  x2={toSvgX(periodStart)}
                  y2={toSvgY(params.k) + 30}
                  stroke="#0284c7"
                  strokeWidth="1"
                  strokeDasharray="2 2"
                />
                <line
                  x1={toSvgX(periodEnd)}
                  y1={toSvgY(params.k)}
                  x2={toSvgX(periodEnd)}
                  y2={toSvgY(params.k) + 30}
                  stroke="#0284c7"
                  strokeWidth="1"
                  strokeDasharray="2 2"
                />
                <line
                  x1={toSvgX(periodStart)}
                  y1={toSvgY(params.k) + 26}
                  x2={toSvgX(periodEnd)}
                  y2={toSvgY(params.k) + 26}
                  stroke="#0284c7"
                  strokeWidth="1.5"
                />
                <rect
                  x={(toSvgX(periodStart) + toSvgX(periodEnd)) / 2 - 40}
                  y={toSvgY(params.k) + 16}
                  width="80"
                  height="18"
                  rx="4"
                  fill="#ffffff"
                  stroke="#0284c7"
                  strokeWidth="1"
                />
                <text
                  x={(toSvgX(periodStart) + toSvgX(periodEnd)) / 2}
                  y={toSvgY(params.k) + 29}
                  textAnchor="middle"
                  fill="#0369a1"
                  className="text-[10px] font-mono-numbers font-semibold"
                >
                  T = {formatPiFraction(periodLength)}
                </text>
              </g>
            )}

            {/* Ghost Base Parent Curve: y = f(x) */}
            {showBase && basePath && (
              <path
                d={basePath}
                fill="none"
                stroke="#94a3b8"
                strokeWidth="1.5"
                strokeDasharray="4 3"
                opacity="0.8"
              />
            )}

            {/* Step intermediate curve (if active) */}
            {stepPath && (
              <path
                d={stepPath}
                fill="none"
                stroke="#d97706"
                strokeWidth="2"
                strokeDasharray="3 2"
                opacity="0.85"
              />
            )}

            {/* Target Curve for matching game */}
            {targetPath && (
              <path
                d={targetPath}
                fill="none"
                stroke="#059669"
                strokeWidth="2.5"
                strokeDasharray="6 4"
                opacity="0.9"
              />
            )}

            {/* Transformed Main Curve */}
            {activePath && (
              <path
                d={activePath}
                fill="none"
                stroke="#2563eb"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {/* Landmark Key Points (Peaks, Valleys, Midline Crossings) */}
            {landmarks.map((pt, i) => {
              const svgX = toSvgX(pt.x);
              const svgY = toSvgY(pt.y);
              const isMax = pt.type === 'max';
              const isMin = pt.type === 'min';

              return (
                <g
                  key={`lm-${i}`}
                  className="cursor-pointer"
                  onClick={() => {
                    setActiveTooltip(pt);
                    if (onPointClick) onPointClick(pt);
                  }}
                  onMouseEnter={() => setActiveTooltip(pt)}
                >
                  <circle
                    cx={svgX}
                    cy={svgY}
                    r={isMax || isMin ? 5 : 4}
                    fill={isMax ? '#ef4444' : isMin ? '#0284c7' : '#8b5cf6'}
                    stroke="#ffffff"
                    strokeWidth="1.5"
                    className="hover:scale-125 transition-transform"
                  />
                </g>
              );
            })}
          </g>

          {/* Outer Border */}
          <rect
            x={padding.left}
            y={padding.top}
            width={plotWidth}
            height={plotHeight}
            fill="none"
            stroke="#cbd5e1"
            strokeWidth="1"
          />

          {/* Live Mouse Crosshair */}
          {hoverPos && (
            <g className="pointer-events-none">
              <line
                x1={hoverPos.canvasX}
                y1={padding.top}
                x2={hoverPos.canvasX}
                y2={height - padding.bottom}
                stroke="#64748b"
                strokeWidth="1"
                strokeDasharray="2 2"
              />
              <line
                x1={padding.left}
                y1={hoverPos.canvasY}
                x2={width - padding.right}
                y2={hoverPos.canvasY}
                stroke="#64748b"
                strokeWidth="1"
                strokeDasharray="2 2"
              />
              {/* Coordinate pill at cursor */}
              <g transform={`translate(${Math.min(width - 120, hoverPos.canvasX + 10)}, ${Math.max(padding.top + 20, hoverPos.canvasY - 10)})`}>
                <rect
                  x="0"
                  y="-16"
                  width="105"
                  height="22"
                  rx="4"
                  fill="#0f172a"
                  opacity="0.9"
                />
                <text
                  x="6"
                  y="-1"
                  fill="#ffffff"
                  className="text-[10px] font-mono-numbers"
                >
                  x: {formatPiFraction(hoverPos.x, 0.05)} | y: {hoverPos.y.toFixed(2)}
                </text>
              </g>
            </g>
          )}

          {/* Active Landmark Tooltip */}
          {activeTooltip && (
            <g
              transform={`translate(${Math.min(width - 160, toSvgX(activeTooltip.x) - 70)}, ${Math.max(padding.top + 10, toSvgY(activeTooltip.y) - 34)})`}
              className="pointer-events-none"
            >
              <rect
                x="0"
                y="0"
                width="145"
                height="26"
                rx="6"
                fill="#1e293b"
                stroke="#475569"
                strokeWidth="1"
                filter="drop-shadow(0 2px 4px rgba(0,0,0,0.15))"
              />
              <text
                x="72"
                y="17"
                textAnchor="middle"
                fill="#f8fafc"
                className="text-[11px] font-mono-numbers font-medium"
              >
                {activeTooltip.label}
              </text>
            </g>
          )}
        </svg>
      </div>

      {/* Graph Legend / Status Bar */}
      <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-y-2 text-xs text-slate-600">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-1 bg-blue-600 rounded-full"></span>
            <span className="font-medium text-slate-800">Transformed Curve</span>
          </div>

          {showBase && (
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-0.5 border-t border-dashed border-slate-400"></span>
              <span className="text-slate-500">Parent y = {func}(x)</span>
            </div>
          )}

          {targetParams && (
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-1 bg-emerald-600 rounded-full border-t border-dashed border-emerald-400"></span>
              <span className="text-emerald-700 font-medium">Target to Match</span>
            </div>
          )}

          {stepParams && (
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-1 bg-amber-600 rounded-full border-t border-dashed border-amber-400"></span>
              <span className="text-amber-700 font-medium">Step Preview</span>
            </div>
          )}

          {showMidline && (
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-0.5 border-t border-dashed border-violet-500"></span>
              <span className="text-violet-700">Midline y = {formatNumber(params.k)}</span>
            </div>
          )}
        </div>

        <div className="text-[11px] text-slate-400">
          Click any landmark point for exact coordinates
        </div>
      </div>
    </div>
  );
};
