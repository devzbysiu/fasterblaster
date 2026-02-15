import { describe, it, expect, vi } from 'vitest';
import { waitFor } from '../wait-for';

describe('waitFor', () => {
  it('resolves immediately when fn returns a value', async () => {
    const result = await waitFor(() => 'found', 1000);
    expect(result).toBe('found');
  });

  it('resolves after several polls', async () => {
    let calls = 0;
    const fn = () => {
      calls++;
      return calls >= 3 ? 'done' : null;
    };
    const result = await waitFor(fn, 1000, 10);
    expect(result).toBe('done');
    expect(calls).toBe(3);
  });

  it('returns null on timeout', async () => {
    const result = await waitFor(() => null, 50, 10);
    expect(result).toBeNull();
  });

  it('respects custom interval', async () => {
    const fn = vi.fn().mockReturnValue(null);
    await waitFor(fn, 100, 40);
    // With 100ms timeout and 40ms interval: initial call + ~2 retries
    expect(fn.mock.calls.length).toBeGreaterThanOrEqual(2);
    expect(fn.mock.calls.length).toBeLessThanOrEqual(5);
  });
});
