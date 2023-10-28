import { rateLimitStrict, redis } from "@/lib/redis";

let API_URL;
API_URL = process.env.API_URI || null;
if (API_URL && API_URL.endsWith("/")) {
  API_URL = API_URL.slice(0, -1);
}

export default async function handler(req, res) {
  try {
    if (redis) {
      try {
        const ipAddress = req.socket.remoteAddress;
        await rateLimitStrict.consume(ipAddress);
      } catch (error) {
        return res.status(429).json({
          error: `Too Many Requests, retry after ${error.msBeforeNext / 1000}`,
        });
      }
    }

    let cache;

    if (redis) {
      cache = await redis.get(`recent-episode`);
    }

    if (cache) {
      return res.status(200).json({ results: JSON.parse(cache) });
    } else {
      const page = req.query.page || 1;

      var hasNextPage = true;
      var datas = [];

      async function fetchData(page) {
        const data = await fetch(
          `https://api.anify.tv/recent?type=anime&page=${page}&perPage=45`
        ).then((res) => res.json());

        // const filtered = data?.results?.filter((i) => i.type !== "ONA");
        // hasNextPage = data?.hasNextPage;
        datas = data;
      }

      await fetchData(page);

      if (redis) {
        await redis.set(`recent-episode`, JSON.stringify(datas), "EX", 60 * 60);
      }

      return res.status(200).json({ results: datas });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
}
