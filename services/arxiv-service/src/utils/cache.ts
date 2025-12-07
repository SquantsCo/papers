import NodeCache from 'node-cache';

const TTL = parseInt(process.env.CACHE_TTL || '7200', 10);

export const cache = new NodeCache({
  stdTTL: TTL,
  checkperiod: 120,
  useClones: false,
});

export const getCachedData = <T>(key: string): T | undefined => {
  return cache.get<T>(key);
};

export const setCachedData = <T>(key: string, value: T, ttl?: number): boolean => {
  return cache.set(key, value, ttl || TTL);
};

export const deleteCachedData = (key: string): number => {
  return cache.del(key);
};
