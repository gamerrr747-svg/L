import React, { useState, useEffect, useRef } from 'react';
import { TrigFunctionType } from '../types/trig';
import { formatPiFraction, PI } from '../utils/mathUtils';
import { Play, Pause, RotateCcw, Compass, ArrowRight } from 'lucide-react';

export const UnitCircleExplorer: React.FC = () => {
  const [angle, setAngle] = useState<number>(PI / 3); // 60 degrees default
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1);
  const [selectedFunc, setSelectedFunc] = useState<TrigFunctionType>('sin');
  const animRef = useRef<number | null>(null);

  // Common benchmark angles in Grade 10 curriculum
  const standardAngles = [
    { deg: 0, rad: 0, label: '0' },
    { deg: 30, rad: PI / 6, label: 'π/6' },
    { deg: 45, rad: PI / 4, label: 'π/4' },
    { deg: 60, rad: PI / 3, label: 'π/3' },
    { deg: 90, rad: PI / 2, label: 'π/2' },
    { deg: 120, rad: (2 * PI) / 3, label: '2π/3' },
    { deg: 135, rad: (3 * PI) / 4, label: '3π/4' },
    { deg: 150, rad: (5 * PI) / 6, label: '5π/6' },
    { deg: 180, rad: PI, label: 'π' },
    { deg: 210, rad: (7 * PI) / 6, label: '7π/6' },
    { deg: 225, rad: (5 * PI) / 4, label: '5π/4' },
    { deg: 240, rad: (4 * PI) / 3, label: '4π/3' },
    { deg: 270, rad: (3 * PI) / 2, label: '3π/2' },
    { deg: 300, rad: (5 * PI) / 3, label: '5π/3' },
    { deg: 315, rad: (7 * PI) / 4, label: '7π/4' },
    { deg: 330, rad: (11 * PI) / 6, label: '11π/6' },
    { deg: 360, rad: 2 * PI, label: '2π' },
  ];

  // Animation loop
  useEffect(() => {
    if (!isPlaying) {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      return;
    }

    let lastTime = performance.now();
    const animate = (time: number) => {
      const dt = (time - lastTime) / 1000;
      lastTime = time;
      setAngle((prev) => (prev + dt * speed * 0.75) % (2 * PI));
      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [isPlaying, speed]);

  const deg = Math.round((angle * 180) / PI);
  const cosVal = Math.cos(angle);
  const sinVal = Math.sin(angle);
  const tanVal = Math.abs(cosVal) > 0.0001 ? Math.tan(angle) : null;
  const cotVal = Math.abs(sinVal) > 0.0001 ? 1 / Math.tan(angle) : null;

  // Determine quadrant
  const normalized = ((angle % (2 * PI)) + 2 * PI) % (2 * PI);
  let quadrant = 'Quadrant I';
  if (normalized > PI / 2 && normalized <= PI) quadrant = 'Quadrant II';
  else if (normalized > PI && normalized <= (3 * PI) / 2) quadrant = 'Quadrant III';
  else if (normalized > (3 * PI) / 2 && normalized < 2 * PI) quadrant = 'Quadrant IV';

  // Unit circle SVG dimensions
  const cRadius = 110;
  const cCenterX = 150;
  const cCenterY = 150;

  const pointX = cCenterX + cosVal * cRadius;
  const pointY = cCenterY - sinVal * cRadius; // SVG inverted Y

  // Right wave SVG dimensions
  const wWidth = 460;
  const wHeight = 300;
  const wPadding = { top: 25, right: 25, bottom: 35, left: 35 };
  const wPlotW = wWidth - wPadding.left - wPadding.right;
  const wPlotH = wHeight - wPadding.top - wPadding.bottom;

  // Wave coordinate conversions: x in [0, 2pi], y in [-1.5, 1.5]
  const waveToSvgX = (rad: number) => wPadding.left + (rad / (2 * PI)) * wPlotW;
  const waveToSvgY = (y: number) => wPadding.top + ((1.5 - y) / 3) * wPlotH;

  // Generate continuous wave path up to current angle
  const wavePath = Array.from({ length: 150 }, (_, i) => {
    const rad = (i / 149) * 2 * PI;
    let y = 0;
    if (selectedFunc === 'sin') y = Math.sin(rad);
    else if (selectedFunc === 'cos') y = Math.cos(rad);
    else if (selectedFunc === 'tan') y = Math.max(-2, Math.min(2, Math.tan(rad)));
    return { rad, y };
  });

  const waveSvgPath = wavePath.reduce((acc, pt, i) => {
    const x = waveToSvgX(pt.rad);
    const y = waveToSvgY(pt.y);
    return i === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
  }, '');

  // Traced portion up to current angle
  const currentWaveX = waveToSvgX(normalized);
  const currentWaveY = waveToSvgY(
    selectedFunc === 'sin' ? sinVal : selectedFunc === 'cos' ? cosVal : Math.max(-2, Math.min(2, tanVal ?? 0))
  );

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 mb-1">
            <span>CURRICULUM 10.2.3.1</span>
            <span aria-hidden="true">·</span>
            <span>Unit Circle Foundations</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Unit Circle to Wave Unfolder
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Rotate the terminal ray around the unit circle to see how the (cos α, sin α) coordinates directly trace the trigonometric curves.
          </p>
        </div>

        {/* Function Toggle Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl self-start md:self-auto">
          {(['sin', 'cos', 'tan'] as TrigFunctionType[]).map((f) => (
            <button
              key={f}
              onClick={() => setSelectedFunc(f)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors capitalize ${
                selectedFunc === f
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {f === 'sin' ? 'Sine y = sin(x)' : f === 'cos' ? 'Cosine y = cos(x)' : 'Tangent y = tan(x)'}
            </button>
          ))}
        </div>
      </div>

      {/* Main Dual Stage: Left Unit Circle, Right Wave Display */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Unit Circle */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col items-center">
          <div className="w-full flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-indigo-600" />
              Unit Circle (R = 1)
            </span>
            <span className="text-xs font-medium text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
              {quadrant}
            </span>
          </div>

          <div className="relative my-2 select-none">
            <svg width={300} height={300} className="overflow-visible">
              {/* Axes */}
              <line x1={20} y1={cCenterY} x2={280} y2={cCenterY} stroke="#cbd5e1" strokeWidth={1.5} />
              <line x1={cCenterX} y1={20} x2={cCenterX} y2={280} stroke="#cbd5e1" strokeWidth={1.5} />

              <text x={286} y={cCenterY + 4} className="text-[11px] fill-slate-500 font-mono-numbers">x (cos)</text>
              <text x={cCenterX - 4} y={14} className="text-[11px] fill-slate-500 font-mono-numbers text-center">y (sin)</text>

              {/* Unit Circle */}
              <circle
                cx={cCenterX}
                cy={cCenterY}
                r={cRadius}
                fill="none"
                stroke="#6366f1"
                strokeWidth={2}
                opacity={0.8}
              />

              {/* Tangent line at x = 1 (if tan selected) */}
              {selectedFunc === 'tan' && (
                <line
                  x1={cCenterX + cRadius}
                  y1={20}
                  x2={cCenterX + cRadius}
                  y2={280}
                  stroke="#ec4899"
                  strokeWidth={1.5}
                  strokeDasharray="3 3"
                />
              )}

              {/* Right Triangle formed by angle */}
              <polygon
                points={`${cCenterX},${cCenterY} ${pointX},${cCenterY} ${pointX},${pointY}`}
                fill="rgba(99, 102, 241, 0.08)"
                stroke="none"
              />

              {/* Horizontal Cosine Leg (blue) */}
              <line
                x1={cCenterX}
                y1={cCenterY}
                x2={pointX}
                y2={cCenterY}
                stroke="#0284c7"
                strokeWidth={3}
              />

              {/* Vertical Sine Leg (indigo/rose) */}
              <line
                x1={pointX}
                y1={cCenterY}
                x2={pointX}
                y2={pointY}
                stroke="#6366f1"
                strokeWidth={3}
              />

              {/* Hypotenuse Terminal Ray */}
              <line
                x1={cCenterX}
                y1={cCenterY}
                x2={pointX}
                y2={pointY}
                stroke="#334155"
                strokeWidth={2}
              />

              {/* Circular Arc for Angle */}
              <path
                d={`M ${cCenterX + 30} ${cCenterY} A 30 30 0 ${normalized > PI ? 1 : 0} 0 ${
                  cCenterX + 30 * Math.cos(normalized)
                } ${cCenterY - 30 * Math.sin(normalized)}`}
                fill="none"
                stroke="#f59e0b"
                strokeWidth={2}
              />
              <text
                x={cCenterX + 38 * Math.cos(normalized / 2)}
                y={cCenterY - 38 * Math.sin(normalized / 2)}
                fill="#d97706"
                className="text-[10px] font-bold"
              >
                α
              </text>

              {/* Terminal Point Drag Handle */}
              <circle
                cx={pointX}
                cy={pointY}
                r={7}
                fill="#4f46e5"
                stroke="#ffffff"
                strokeWidth={2}
                className="cursor-pointer filter drop-shadow-sm hover:scale-125 transition-transform"
              />

              {/* Quadrant Markers */}
              <text x={230} y={70} className="text-[10px] font-semibold fill-slate-300">QI (All +)</text>
              <text x={45} y={70} className="text-[10px] font-semibold fill-slate-300">QII (Sin +)</text>
              <text x={45} y={235} className="text-[10px] font-semibold fill-slate-300">QIII (Tan +)</text>
              <text x={220} y={235} className="text-[10px] font-semibold fill-slate-300">QIV (Cos +)</text>
            </svg>
          </div>

          {/* Angle Numeric Coordinates Box */}
          <div className="w-full grid grid-cols-2 gap-2 mt-2 pt-3 border-t border-slate-100 text-xs">
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
              <span className="text-[11px] text-slate-500 block">Angle α</span>
              <span className="text-sm font-bold text-slate-800 font-mono-numbers">
                {deg}° <span className="text-xs font-normal text-slate-500">({formatPiFraction(normalized)})</span>
              </span>
            </div>

            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
              <span className="text-[11px] text-slate-500 block">Point B(x, y)</span>
              <span className="text-xs font-bold text-slate-800 font-mono-numbers">
                ({cosVal.toFixed(3)}, {sinVal.toFixed(3)})
              </span>
            </div>

            <div className="bg-sky-50/70 p-2.5 rounded-xl border border-sky-200/60">
              <span className="text-[11px] text-sky-700 block font-medium">cos(α) = x</span>
              <span className="text-sm font-bold text-sky-900 font-mono-numbers">
                {cosVal.toFixed(4)}
              </span>
            </div>

            <div className="bg-indigo-50/70 p-2.5 rounded-xl border border-indigo-200/60">
              <span className="text-[11px] text-indigo-700 block font-medium">sin(α) = y</span>
              <span className="text-sm font-bold text-indigo-900 font-mono-numbers">
                {sinVal.toFixed(4)}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Rolling Wave Unfolder */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                <span>Wave Unrolling Over [0, 2π]</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </span>
              <span className="text-xs font-mono-numbers text-slate-500">
                x = {formatPiFraction(normalized)} rad
              </span>
            </div>

            {/* SVG Wave */}
            <div className="relative w-full overflow-hidden bg-slate-50/50 rounded-xl border border-slate-200/80 my-2">
              <svg viewBox={`0 0 ${wWidth} ${wHeight}`} className="w-full h-auto select-none block">
                {/* Horizontal Midline */}
                <line
                  x1={wPadding.left}
                  y1={waveToSvgY(0)}
                  x2={wWidth - wPadding.right}
                  y2={waveToSvgY(0)}
                  stroke="#94a3b8"
                  strokeWidth={1.5}
                />

                {/* Vertical Axis */}
                <line
                  x1={wPadding.left}
                  y1={wPadding.top}
                  x2={wPadding.left}
                  y2={wHeight - wPadding.bottom}
                  stroke="#94a3b8"
                  strokeWidth={1.5}
                />

                {/* X-axis Radian Marks */}
                {[0, PI / 2, PI, (3 * PI) / 2, 2 * PI].map((xVal, i) => (
                  <g key={`w-xtick-${i}`}>
                    <line
                      x1={waveToSvgX(xVal)}
                      y1={wPadding.top}
                      x2={waveToSvgX(xVal)}
                      y2={wHeight - wPadding.bottom}
                      stroke="#e2e8f0"
                      strokeDasharray="2 2"
                    />
                    <text
                      x={waveToSvgX(xVal)}
                      y={wHeight - wPadding.bottom + 16}
                      textAnchor="middle"
                      className="text-[10px] font-mono-numbers fill-slate-500"
                    >
                      {formatPiFraction(xVal)}
                    </text>
                  </g>
                ))}

                {/* Y-axis values */}
                {[-1, 0, 1].map((yVal, i) => (
                  <g key={`w-ytick-${i}`}>
                    <line
                      x1={wPadding.left}
                      y1={waveToSvgY(yVal)}
                      x2={wWidth - wPadding.right}
                      y2={waveToSvgY(yVal)}
                      stroke="#e2e8f0"
                      strokeDasharray="2 2"
                    />
                    <text
                      x={wPadding.left - 8}
                      y={waveToSvgY(yVal) + 4}
                      textAnchor="end"
                      className="text-[10px] font-mono-numbers fill-slate-500"
                    >
                      {yVal}
                    </text>
                  </g>
                ))}

                {/* Full parent wave (background guide) */}
                <path
                  d={waveSvgPath}
                  fill="none"
                  stroke="#cbd5e1"
                  strokeWidth={2}
                  strokeDasharray="4 2"
                />

                {/* Traced portion up to current angle */}
                <path
                  d={wavePath
                    .filter((pt) => pt.rad <= normalized)
                    .reduce((acc, pt, i) => {
                      const x = waveToSvgX(pt.rad);
                      const y = waveToSvgY(pt.y);
                      return i === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
                    }, '')}
                  fill="none"
                  stroke="#4f46e5"
                  strokeWidth={3}
                  strokeLinecap="round"
                />

                {/* Connecting tracer point */}
                <circle
                  cx={currentWaveX}
                  cy={currentWaveY}
                  r={6}
                  fill="#4f46e5"
                  stroke="#ffffff"
                  strokeWidth={2}
                />

                {/* Horizontal Projection Beam from Circle to Wave */}
                <line
                  x1={wPadding.left}
                  y1={currentWaveY}
                  x2={currentWaveX}
                  y2={currentWaveY}
                  stroke="#6366f1"
                  strokeWidth={1.5}
                  strokeDasharray="3 2"
                  opacity={0.7}
                />
              </svg>
            </div>
          </div>

          {/* Interactive Playback & Angle Scrubber Controls */}
          <div className="space-y-4 pt-3 border-t border-slate-100">
            {/* Scrubber */}
            <div>
              <div className="flex items-center justify-between text-xs text-slate-600 mb-1.5 font-medium">
                <span>Angle Scrubber (Drag or Play)</span>
                <span className="font-mono-numbers font-semibold text-indigo-700">
                  {deg}° · {formatPiFraction(normalized)} rad
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={2 * PI}
                step={0.02}
                value={normalized}
                onChange={(e) => {
                  setAngle(parseFloat(e.target.value));
                  setIsPlaying(false);
                }}
                className="w-full accent-indigo-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
              />
            </div>

            {/* Standard Special Angle Presets */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
              <span className="text-[11px] text-slate-400 font-medium shrink-0 mr-1">Special:</span>
              {standardAngles.map((sa) => (
                <button
                  key={sa.label}
                  onClick={() => {
                    setAngle(sa.rad);
                    setIsPlaying(false);
                  }}
                  className={`px-2 py-1 text-[11px] font-mono-numbers rounded-md border transition-colors shrink-0 ${
                    Math.abs(normalized - sa.rad) < 0.05
                      ? 'bg-indigo-600 text-white border-indigo-600 font-bold'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-300'
                  }`}
                >
                  {sa.label}
                </button>
              ))}
            </div>

            {/* Animation Toolbar */}
            <div className="flex items-center justify-between gap-3 pt-1">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl text-white transition-colors ${
                    isPlaying ? 'bg-amber-600 hover:bg-amber-700' : 'bg-indigo-600 hover:bg-indigo-700'
                  }`}
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-3.5 h-3.5" />
                      <span>Pause Rotation</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5" />
                      <span>Animate Rotation</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => {
                    setAngle(0);
                    setIsPlaying(false);
                  }}
                  className="p-2 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                  title="Reset to 0 rad"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              {/* Speed Controller */}
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <span>Speed:</span>
                {[0.5, 1, 2].map((s) => (
                  <button
                    key={s}
                    onClick={() => setSpeed(s)}
                    className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                      speed === s ? 'bg-slate-900 text-white' : 'bg-slate-100 hover:bg-slate-200'
                    }`}
                  >
                    {s}x
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
