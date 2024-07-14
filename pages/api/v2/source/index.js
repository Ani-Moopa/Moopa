import { rateLimiterRedis, redis } from "@/lib/redis";
import { getAnimeSource } from "@/lib/consumet/anime/source";
import axios from "axios";

async function consumetSource(id) {
  try {
    const data = await getAnimeSource(id)

    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function anifySource(providerId, watchId, episode, id, sub) {
  try {
    const { data } = await axios.get(
      `https://api.anify.tv/sources?providerId=${providerId}&watchId=${encodeURIComponent(
        watchId
      )}&episodeNumber=${episode}&id=${id}&subType=${sub}`
    );
    return data;
  } catch (error) {
    return { error: error.message, status: error.response.status };
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  if (redis) {
    try {
      const ipAddress = req.socket.remoteAddress;
      await rateLimiterRedis.consume(ipAddress);
    } catch (error) {
      return res.status(429).json({
        error: `Too Many Requests, retry after ${error.msBeforeNext / 1000}`,
      });
    }
  }

  const { source, providerId, watchId, episode, id, sub = "sub" } = req.body;

  if (source === "anify") {
    const data = await anifySource(providerId, watchId, episode, id, sub);
    return res.status(200).json(data);
  }

  if (source === "consumet") {
    const data = await consumetSource(watchId);
    return res.status(200).json(data);
  }
}
