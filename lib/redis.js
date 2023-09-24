import { Redis } from "ioredis";
import { RateLimiterRedis } from "rate-limiter-flexible";

const REDIS_URL = process.env.REDIS_URL;

let redis;
let rateLimiterRedis;
let rateLimitStrict;

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

  rateLimiterRedis = new RateLimiterRedis(opt);
  rateLimitStrict = new RateLimiterRedis(optStrict);
} else {
  console.warn("REDIS_URL is not defined. Redis caching will be disabled.");
}

export { redis, rateLimiterRedis, rateLimitStrict };
