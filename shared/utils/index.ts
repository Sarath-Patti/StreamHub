export const getUptime = (): number => {
  return process.uptime();
};

export const getISOFormattedTimestamp = (): string => {
  return new Date().toISOString();
};

export const asyncHandler = <T>(
  fn: (...args: unknown[]) => Promise<T>
) => {
  return (...args: unknown[]): Promise<T> => {
    return fn(...args).catch((err) => {
      throw err;
    });
  };
};
