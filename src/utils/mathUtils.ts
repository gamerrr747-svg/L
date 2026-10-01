import { TrigFunctionType, TransformationParams, LandmarkPoint, FunctionProperties } from '../types/trig';

export const PI = Math.PI;

/**
 * Format radians into exact or clean pi-fraction strings
 */
export function formatPiFraction(rad: number, tolerance = 0.005): string {
  if (Math.abs(rad) < tolerance) return '0';
  const sign = rad < 0 ? '-' : '';
  const absRad = Math.abs(rad);
  const factor = absRad / PI;

  // Check known common fractions of PI
  const commonFractions: [number, number][] = [
    [1, 6], [1, 4], [1, 3], [1, 2],
    [2, 3], [3, 4], [5, 6], [1, 1],
    [7, 6], [5, 4], [4, 3], [3, 2],
    [5, 3], [7, 4], [11, 6], [2, 1],
    [5, 2], [3, 1], [7, 2], [4, 1]
  ];

  for (const [num, den] of commonFractions) {
    if (Math.abs(factor - num / den) < tolerance) {
      if (den === 1) {
        return num === 1 ? `${sign}π` : `${sign}${num}π`;
      }
      return num === 1 ? `${sign}π/${den}` : `${sign}${num}π/${den}`;
    }
  }

  // Fallback to numeric
  return `${sign}${(absRad / PI).toFixed(2)}π`;
}

/**
 * Format decimal to clean fraction or decimal string
 */
export function formatNumber(val: number): string {
  if (Math.abs(val) < 0.0001) return '0';
  if (Number.isInteger(val)) return val.toString();
  // check simple halves, thirds, quarters
  const fracMap: Record<number, string> = {
    0.5: '1/2',
    '-0.5': '-1/2',
    0.25: '1/4',
    '-0.25': '-1/4',
    0.75: '3/4',
    '-0.75': '-3/4',
    0.33333333: '1/3',
    0.66666667: '2/3',
    1.5: '3/2',
    '-1.5': '-3/2',
    2.5: '5/2',
    '-2.5': '-5/2',
  };
  const rounded = parseFloat(val.toFixed(2));
  if (fracMap[rounded]) return fracMap[rounded];
  return rounded.toString();
}

/**
 * Safe evaluation of trig function
 */
export function evaluateTrig(func: TrigFunctionType, x: number): number | null {
  switch (func) {
    case 'sin':
      return Math.sin(x);
    case 'cos':
      return Math.cos(x);
    case 'tan': {
      // Check near pi/2 + k*pi
      const mod = (x % PI + PI) % PI;
      if (Math.abs(mod - PI / 2) < 0.0001) return null;
      const val = Math.tan(x);
      return Math.abs(val) > 20 ? null : val;
    }
    case 'cot': {
      // Check near k*pi
      const mod = (x % PI + PI) % PI;
      if (Math.abs(mod) < 0.0001 || Math.abs(mod - PI) < 0.0001) return null;
      const sinVal = Math.sin(x);
      if (Math.abs(sinVal) < 0.0001) return null;
      const val = Math.cos(x) / sinVal;
      return Math.abs(val) > 20 ? null : val;
    }
    case 'sec': {
      const cosVal = Math.cos(x);
      if (Math.abs(cosVal) < 0.0001) return null;
      const val = 1 / cosVal;
      return Math.abs(val) > 20 ? null : val;
    }
    case 'csc': {
      const sinVal = Math.sin(x);
      if (Math.abs(sinVal) < 0.0001) return null;
      const val = 1 / sinVal;
      return Math.abs(val) > 20 ? null : val;
    }
    default:
      return Math.sin(x);
  }
}

/**
 * Evaluate transformed function: y = a * f(b(x - h)) + k
 */
export function evaluateTransformed(
  func: TrigFunctionType,
  params: TransformationParams,
  x: number
): number | null {
  const { a, b, h, k } = params;
  const inner = b * (x - h);
  const baseVal = evaluateTrig(func, inner);
  if (baseVal === null) return null;
  return a * baseVal + k;
}

/**
 * Construct beautiful LaTeX/formatted equation string
 */
export function buildEquationString(
  func: TrigFunctionType,
  params: TransformationParams
): string {
  const { a, b, h, k } = params;

  let aStr = '';
  if (a === -1) aStr = '-';
  else if (a !== 1) aStr = formatNumber(a);

  let inner = '';
  // b handling
  if (b === 1) {
    if (Math.abs(h) < 0.001) {
      inner = 'x';
    } else if (h > 0) {
      inner = `x - ${formatPiFraction(h)}`;
    } else {
      inner = `x + ${formatPiFraction(Math.abs(h))}`;
    }
  } else if (b === -1) {
    if (Math.abs(h) < 0.001) {
      inner = '-x';
    } else {
      const hStr = h > 0 ? `- ${formatPiFraction(h)}` : `+ ${formatPiFraction(Math.abs(h))}`;
      inner = `-(x ${hStr})`;
    }
  } else {
    const bStr = formatNumber(b);
    if (Math.abs(h) < 0.001) {
      inner = `${bStr}x`;
    } else {
      const hStr = h > 0 ? `- ${formatPiFraction(h)}` : `+ ${formatPiFraction(Math.abs(h))}`;
      inner = `${bStr}(x ${hStr})`;
    }
  }

  let kStr = '';
  if (Math.abs(k) > 0.001) {
    kStr = k > 0 ? ` + ${formatNumber(k)}` : ` - ${formatNumber(Math.abs(k))}`;
  }

  return `y = ${aStr}${func}(${inner})${kStr}`;
}

/**
 * Calculate fundamental properties for given function and transformation
 */
export function calculateProperties(
  func: TrigFunctionType,
  params: TransformationParams
): FunctionProperties {
  const { a, b, h, k } = params;
  const absA = Math.abs(a);
  const absB = Math.abs(b);

  const basePeriod = func === 'tan' || func === 'cot' ? PI : 2 * PI;
  const periodVal = basePeriod / (absB || 1);
  const periodStr = formatPiFraction(periodVal);

  let domain = 'x ∈ ℝ';
  let range = '';
  let asymptotes = undefined;

  if (func === 'sin' || func === 'cos') {
    const minVal = parseFloat((k - absA).toFixed(2));
    const maxVal = parseFloat((k + absA).toFixed(2));
    range = `[${minVal}, ${maxVal}]`;
  } else if (func === 'tan' || func === 'cot') {
    range = 'y ∈ ℝ (-∞, +∞)';
    if (func === 'tan') {
      domain = `x ≠ ${formatPiFraction(h)} + (π/2 + kπ)/${absB}`;
      asymptotes = `x = ${formatPiFraction(h)} + π/(2·${formatNumber(absB)}) + k·(π/${formatNumber(absB)})`;
    } else {
      domain = `x ≠ ${formatPiFraction(h)} + kπ/${absB}`;
      asymptotes = `x = ${formatPiFraction(h)} + k·(π/${formatNumber(absB)})`;
    }
  } else if (func === 'sec' || func === 'csc') {
    const lowerBound = parseFloat((k - absA).toFixed(2));
    const upperBound = parseFloat((k + absA).toFixed(2));
    range = `(-∞, ${lowerBound}] ∪ [${upperBound}, +∞)`;
    domain = func === 'sec' 
      ? `x ≠ ${formatPiFraction(h)} + π/(2·${absB}) + kπ/${absB}`
      : `x ≠ ${formatPiFraction(h)} + kπ/${absB}`;
  }

  // Parity
  let parity: 'even' | 'odd' | 'neither' = 'neither';
  if (Math.abs(h) < 0.001 && Math.abs(k) < 0.001) {
    if (func === 'cos' || func === 'sec') {
      parity = 'even';
    } else {
      parity = 'odd';
    }
  }

  const phaseShift = Math.abs(h) < 0.001 
    ? 'None (0)' 
    : `${formatPiFraction(Math.abs(h))} to the ${h > 0 ? 'Right (+)' : 'Left (-)'}`;

  const amplitude = (func === 'sin' || func === 'cos') 
    ? `${absA} (vertical stretch/compression)`
    : 'Not defined (curves extend to ±∞; vertical scaling factor = ' + absA + ')';

  const zerosGeneral = func === 'sin'
    ? `x = ${formatPiFraction(h)} + k·(π/${formatNumber(absB)}) (when k=0)`
    : func === 'cos'
    ? `x = ${formatPiFraction(h)} + (π/2 + kπ)/${formatNumber(absB)} (when k=0)`
    : 'Depends on vertical offset k';

  return {
    domain,
    range,
    fundamentalPeriod: periodStr,
    fundamentalPeriodValue: periodVal,
    amplitude,
    midline: k,
    phaseShift,
    parity,
    asymptotes,
    zerosGeneral
  };
}

/**
 * Generate landmark points within 1 to 2 cycles
 */
export function getLandmarkPoints(
  func: TrigFunctionType,
  params: TransformationParams
): LandmarkPoint[] {
  const { a, b, h, k } = params;
  const absB = Math.abs(b) || 1;
  const period = (func === 'tan' || func === 'cot' ? PI : 2 * PI) / absB;
  const points: LandmarkPoint[] = [];

  // Generate 5 key points for 1 full cycle starting from phase shift h
  if (func === 'sin') {
    const quarter = period / 4;
    // 1. Start on midline
    points.push({
      x: h,
      y: k,
      label: `Start (${formatPiFraction(h)}, ${formatNumber(k)})`,
      type: 'midline'
    });
    // 2. Quarter cycle
    points.push({
      x: h + quarter,
      y: k + a,
      label: a > 0 ? `Max (${formatPiFraction(h + quarter)}, ${formatNumber(k + a)})` : `Min (${formatPiFraction(h + quarter)}, ${formatNumber(k + a)})`,
      type: a > 0 ? 'max' : 'min'
    });
    // 3. Half cycle
    points.push({
      x: h + 2 * quarter,
      y: k,
      label: `Midline (${formatPiFraction(h + 2 * quarter)}, ${formatNumber(k)})`,
      type: 'midline'
    });
    // 4. Three-quarter cycle
    points.push({
      x: h + 3 * quarter,
      y: k - a,
      label: a > 0 ? `Min (${formatPiFraction(h + 3 * quarter)}, ${formatNumber(k - a)})` : `Max (${formatPiFraction(h + 3 * quarter)}, ${formatNumber(k - a)})`,
      type: a > 0 ? 'min' : 'max'
    });
    // 5. Complete cycle
    points.push({
      x: h + period,
      y: k,
      label: `End (${formatPiFraction(h + period)}, ${formatNumber(k)})`,
      type: 'midline'
    });
  } else if (func === 'cos') {
    const quarter = period / 4;
    // 1. Start at extremum
    points.push({
      x: h,
      y: k + a,
      label: a > 0 ? `Max (${formatPiFraction(h)}, ${formatNumber(k + a)})` : `Min (${formatPiFraction(h)}, ${formatNumber(k + a)})`,
      type: a > 0 ? 'max' : 'min'
    });
    // 2. Quarter cycle on midline
    points.push({
      x: h + quarter,
      y: k,
      label: `Midline (${formatPiFraction(h + quarter)}, ${formatNumber(k)})`,
      type: 'midline'
    });
    // 3. Half cycle at opposite extremum
    points.push({
      x: h + 2 * quarter,
      y: k - a,
      label: a > 0 ? `Min (${formatPiFraction(h + 2 * quarter)}, ${formatNumber(k - a)})` : `Max (${formatPiFraction(h + 2 * quarter)}, ${formatNumber(k - a)})`,
      type: a > 0 ? 'min' : 'max'
    });
    // 4. Three-quarter cycle on midline
    points.push({
      x: h + 3 * quarter,
      y: k,
      label: `Midline (${formatPiFraction(h + 3 * quarter)}, ${formatNumber(k)})`,
      type: 'midline'
    });
    // 5. Full cycle back at peak
    points.push({
      x: h + period,
      y: k + a,
      label: a > 0 ? `Max (${formatPiFraction(h + period)}, ${formatNumber(k + a)})` : `Min (${formatPiFraction(h + period)}, ${formatNumber(k + a)})`,
      type: a > 0 ? 'max' : 'min'
    });
  } else if (func === 'tan') {
    // Zero on midline at h
    points.push({
      x: h,
      y: k,
      label: `Center (${formatPiFraction(h)}, ${formatNumber(k)})`,
      type: 'midline'
    });
    // Reference point at h + period/4 -> y = k + a
    points.push({
      x: h + period / 4,
      y: k + a,
      label: `Ref Pt (${formatPiFraction(h + period / 4)}, ${formatNumber(k + a)})`,
      type: 'intercept'
    });
    points.push({
      x: h - period / 4,
      y: k - a,
      label: `Ref Pt (${formatPiFraction(h - period / 4)}, ${formatNumber(k - a)})`,
      type: 'intercept'
    });
  }

  return points;
}
