import axios from "axios";
import { rateLimiterRedis, redis } from "@/lib/redis";

const API_KEY = process.env.API_KEY;

export async function fetchInfo(id) {
  try {
    const { data } = await axios.get(
      `https://api.anify.tv/info/${id}?apikey=${API_KEY}`
    );
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}

export default async function handler(req, res) {
  const id = req.query.id;
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
    cached = await redis.get(id);
  }
  if (cached) {
    // console.log("Using cached data");
    return res.status(200).json(JSON.parse(cached));
  } else {
    const data = await fetchInfo(id);
    if (data) {
      // console.log("Setting cache");
      if (redis) {
        await redis.set(id, JSON.stringify(data), "EX", 60 * 10);
      }
      return res.status(200).json(data);
    } else {
      return res.status(404).json({ message: "Schedule not found" });
    }
  }
}
