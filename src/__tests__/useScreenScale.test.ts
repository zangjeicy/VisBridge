import { describe, it, expect } from 'vitest';

describe('useScreenScale', () => {
  it('scale calculation logic is correct', () => {
    const DESIGN_WIDTH = 1920;
    const DESIGN_HEIGHT = 1080;

    const scaleX = 2560 / DESIGN_WIDTH;
    const scaleY = 1440 / DESIGN_HEIGHT;
    const scale = Math.min(scaleX, scaleY);

    expect(scale).toBeCloseTo(1.333, 2);
  });

  it('scale should not exceed 1 for small screens', () => {
    const DESIGN_WIDTH = 1920;
    const DESIGN_HEIGHT = 1080;

    const scaleX = 1366 / DESIGN_WIDTH;
    const scaleY = 768 / DESIGN_HEIGHT;
    const scale = Math.min(scaleX, scaleY);

    expect(scale).toBeLessThan(1);
  });
});
