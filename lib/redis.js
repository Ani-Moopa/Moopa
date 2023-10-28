import { Redis } from "ioredis";
import { RateLimiterRedis } from "rate-limiter-flexible";

const REDIS_URL = process.env.REDIS_URL;

let redis;
let rateLimiterRedis;
let rateLimitStrict;
let rateSuperStrict;

if (REDIS_URL) {
  redis = new Redis(REDIS_URL);
  redis.on("error", (err) => {
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
