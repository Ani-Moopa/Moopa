import { rateLimitStrict, redis } from "@/lib/redis";
import { AnifyRecentEpisode } from "@/utils/types";
import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

let API_URL: string | null;
API_URL = process.env.API_URI || null;
if (API_URL && API_URL.endsWith("/")) {
  API_URL = API_URL.slice(0, -1);
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (redis) {
      try {
        const ipAddress: any = req.socket.remoteAddress;
        await rateLimitStrict?.consume(ipAddress);
      } catch (error: any) {
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
      let datas: AnifyRecentEpisode[] = [];

      const fetchData = async (page: any) => {
        const { data } = await axios.get(
          `https://api.anify.tv/recent?type=anime&page=${page}&perPage=45&fields=[id,slug,title,currentEpisode,coverImage,episodes]`
        );

        // const filtered = data?.results?.filter((i) => i.type !== "ONA");
        // hasNextPage = data?.hasNextPage;

        const newData = data.map((i: AnifyRecentEpisode) => {
          const getGogo = i.episodes?.data?.find(
            (x) => x.providerId === "gogoanime"
          );
          const getGogoEpisode = getGogo?.episodes?.find(
            (x) => x.number === i.currentEpisode
          );

          return {
            id: i.id,
            slug: getGogoEpisode?.id,
            title: i.title,
            currentEpisode: i.currentEpisode,
            coverImage: i.coverImage,
          };
        });

        datas = newData;
      };

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
