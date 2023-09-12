import { Redis } from "ioredis";

const REDIS_URL = process.env.REDIS_URL;

let redis;

if (REDIS_URL) {
  redis = new Redis(REDIS_URL);
} else {
  console.warn("REDIS_URL is not defined. Redis caching will be disabled.");
}

export default redis;
