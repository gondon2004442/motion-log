export function clamp(n: number, a: number, b: number): number {
  return Math.max(a, Math.min(b, n));
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/** 0-1 t through cubic bezier (approx via sampling for scrub) */
export function easeCubic(
  t: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number
): number {
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  const cx = 3 * x1;
  const bx = 3 * (x2 - x1) - cx;
  const ax = 1 - cx - bx;
  const cy = 3 * y1;
  const by = 3 * (y2 - y1) - cy;
  const ay = 1 - cy - by;
  const sampleCurveX = (p: number) => ((ax * p + bx) * p + cx) * p;
  const sampleCurveY = (p: number) => ((ay * p + by) * p + cy) * p;
  const sampleDerivativeX = (p: number) => (3 * ax * p + 2 * bx) * p + cx;
  const solve = (x: number) => {
    let t2 = x;
    for (let i = 0; i < 8; i++) {
      const x2 = sampleCurveX(t2) - x;
      if (Math.abs(x2) < 1e-6) return t2;
      const d2 = sampleDerivativeX(t2);
      if (Math.abs(d2) < 1e-6) break;
      t2 -= x2 / d2;
    }
    let t0 = 0;
    let t1 = 1;
    t2 = x;
    while (t0 < t1) {
      const x2 = sampleCurveX(t2);
      if (Math.abs(x2 - x) < 1e-6) return t2;
      if (x > x2) t0 = t2;
      else t1 = t2;
      t2 = (t1 - t0) * 0.5 + t0;
    }
    return t2;
  };
  return sampleCurveY(solve(t));
}

export function throughEase(
  t: number,
  easing: string
): number {
  if (easing === "ease" || easing === "easeInOut")
    return easeCubic(t, 0.42, 0, 0.58, 1);
  if (easing === "linear" || easing === "easeInOutCubic(0.16,1,0.3,1)" || easing === "cubic(0.16,1,0.3,1)")
    return easeCubic(t, 0.16, 1, 0.3, 1);
  return t;
}
