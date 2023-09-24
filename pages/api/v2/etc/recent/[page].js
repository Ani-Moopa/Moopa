import { rateLimiterRedis, redis } from "@/lib/redis";

const API_URL = process.env.API_URI;

export default async function handler(req, res) {
  try {
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
    const page = req.query.page || 1;

    var hasNextPage = true;
    var datas = [];

    async function fetchData(page) {
      const data = await fetch(
        `${API_URL}/meta/anilist/recent-episodes?page=${page}&perPage=30&provider=gogoanime`
      ).then((res) => res.json());

      const filtered = data?.results?.filter((i) => i.type !== "ONA");
      hasNextPage = data?.hasNextPage;
      datas = filtered;
    }

    await fetchData(page);

    return res.status(200).json({ hasNextPage, results: datas });
  } catch (error) {
    res.status(500).json({ error });
  }
}
