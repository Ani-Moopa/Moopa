import axios from "axios";
import cron from "cron";
import { rateLimiterRedis, redis } from "@/lib/redis";
import { NextApiRequest, NextApiResponse } from "next";

// Function to fetch new data
async function fetchData() {
  try {
    const { data } = await axios.get(
      `https://api.anify.tv/schedule?fields=[id,coverImage,title,bannerImage]`
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

interface Title {
  romaji: string;
  english: string;
  native: string;
}

type CachedData = {
  id: string;
  title: Title;
  coverImage: string;
  bannerImage: string;
  airingAt: number;
  airingEpisode: number;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    let cached: CachedData | null = null;
    if (redis) {
      try {
        const ipAddress: any = req.socket.remoteAddress;
        await rateLimiterRedis?.consume(ipAddress);
      } catch (error: any) {
        return res.status(429).json({
          error: `Too Many Requests, retry after ${error.msBeforeNext / 1000}`,
        });
      }
      const cachedData = await redis.get("schedule");
      cached = cachedData ? JSON.parse(cachedData) : null;
    }

    if (cached) {
      return res.status(200).json(cached);
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
