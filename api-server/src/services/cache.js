const CACHE_TYPE = process.env.CACHE_TYPE || 'memory';

const memoryCache = new Map();

setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of memoryCache) {
    if (entry.expireAt && entry.expireAt < now) {
      memoryCache.delete(key);
    }
  }
}, 60 * 1000);

let redisClient = null;

function getRedisClient() {
  if (!redisClient) {
    const Redis = require('ioredis');

    const host = process.env.REDIS_HOST || 'localhost';
    const port = parseInt(process.env.REDIS_PORT) || 6379;

    const useTls =
      host.includes('cache.amazonaws.com') ||
      process.env.REDIS_TLS === 'true';

    const options = {
      host,
      port,
      retryStrategy(times) {
        if (times > 3) {
          console.error('[Cache] Redis 재시도 초과');
          return null;
        }
        console.log(`[Cache] Redis 재시도 ${times}회`);
        return 2000;
      },
    };

    if (useTls) {
      options.tls = {};
    }

    redisClient = new Redis(options);

    redisClient.on('connect', () => {
      console.log('[Cache] Redis 연결 성공');
    });

    redisClient.on('ready', async () => {
      console.log('[Cache] Redis ready 상태');
      try {
        const pong = await redisClient.ping();
        console.log('[Cache] Redis PING 결과:', pong);
      } catch (err) {
        console.error('[Cache] Redis PING 실패:', err.message);
      }
    });

    redisClient.on('error', (err) => {
      console.error('[Cache] Redis 연결 오류:', err.message);
    });
  }

  return redisClient;
}