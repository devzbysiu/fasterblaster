export function waitFor<T>(
  fn: () => T | null,
  timeout: number,
  interval = 100,
): Promise<T | null> {
  return new Promise((resolve) => {
    const start = Date.now();
    const check = () => {
      const result = fn();
      if (result) return resolve(result);
      if (Date.now() - start >= timeout) return resolve(null);
      setTimeout(check, interval);
    };
    check();
  });
}
