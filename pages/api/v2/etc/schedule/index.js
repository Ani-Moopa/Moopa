import axios from "axios";
import cron from "cron";
import { rateLimiterRedis, redis } from "@/lib/redis";

const API_KEY = process.env.API_KEY;

// Function to fetch new data
async function fetchData() {
  try {
    const { data } = await axios.get(
      `https://api.anify.tv/schedule?apikey=${API_KEY}`
    );
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}

// Function to refresh the cache with new data
async function refreshCache() {
  const newData = await fetchData();
  if (newData) {
    if (redis) {
      await redis.set(
        "schedule",
        JSON.stringify(newData),
        "EX",
        60 * 60 * 24 * 7
      );
    }
    console.log("Cache refreshed successfully.");
  }
}

// Schedule cache refresh every Monday at 00:00 AM (local time)
const job = new cron.CronJob("0 0 * * 1", () => {
  refreshCache();
});
job.start();

export default async function handler(req, res) {
  try {
    let cached;
    if (redis) {
      try {
        const ipAddress = req.socket.remoteAddress;
        await rateLimiterRedis.consume(ipAddress);
      } catch (error) {
        return res.status(429).json({
          error: `Too Many Requests, retry after ${error.msBeforeNext / 1000}`,
        });
      }
      cached = await redis.get("schedule");
    }
    if (cached) {
      return res.status(200).json(JSON.parse(cached));
    } else {
      const data = await fetchData();

      if (data) {
        // cacheData.put("schedule", data, 1000 * 60 * 60 * 24 * 7);
        if (redis) {
          await redis.set(
            "schedule",
            JSON.stringify(data),
            "EX",
            60 * 60 * 24 * 7
          );
        }
        return res.status(200).json(data);
      } else {
        return res.status(404).json({ message: "Schedule not found" });
      }
    }
  } catch (error) {
    res.status(500).json({ error });
  }
}
