import { Redis } from "ioredis";
import { RateLimiterRedis } from "rate-limiter-flexible";

const REDIS_URL: string | undefined = process.env.REDIS_URL;

let redis: Redis;
let rateLimiterRedis: RateLimiterRedis;
let rateLimitStrict: RateLimiterRedis;
let rateSuperStrict: RateLimiterRedis;

if (REDIS_URL) {
  redis = new Redis(REDIS_URL);
  redis.on("error", (err: Error) => {
    console.error("Redis error: ", err);
  });

  const opt = {
    storeClient: redis,
    keyPrefix: "rateLimit",
    points: 50,
    duration: 1,
  };

  const optStrict = {
    storeClient: redis,
    keyPrefix: "rateLimitStrict",
    points: 20,
    duration: 1,
  };

  const optSuperStrict = {
    storeClient: redis,
    keyPrefix: "rateLimitSuperStrict",
    points: 3,
    // duration 10 minutes
    duration: 10 * 60,
    blockDuration: 10 * 60,
  };

  rateLimiterRedis = new RateLimiterRedis(opt);
  rateLimitStrict = new RateLimiterRedis(optStrict);
  rateSuperStrict = new RateLimiterRedis(optSuperStrict);
} else {
  console.warn("REDIS_URL is not defined. Redis caching will be disabled.");
}

export { redis, rateLimiterRedis, rateLimitStrict, rateSuperStrict };
