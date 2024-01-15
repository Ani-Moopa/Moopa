// @ts-nocheck

import axios from "axios";
import { rateLimiterRedis, rateSuperStrict, redis } from "@/lib/redis";
import appendMetaToEpisodes from "@/utils/appendMetaToEpisodes";
import { NextApiRequest, NextApiResponse } from "next";
import { AnifyEpisode, ConsumetInfo, EpisodeData } from "types";
import { Episode } from "@/types/api/Episode";
import { getProviderWithMostEpisodesAndImage } from "@/utils/parseMetaData";

let CONSUMET_URI: string | null;

CONSUMET_URI = process.env.API_URI || null;
if (CONSUMET_URI && CONSUMET_URI.endsWith("/")) {
  CONSUMET_URI = CONSUMET_URI.slice(0, -1);
}

const isAscending = (data: Episode[]) => {
  for (let i = 1; i < data.length; i++) {
    if (data[i].number < data[i - 1].number) {
      return false;
    }
  }
  return true;
};

export interface RawEpisodeData {
  map?: boolean;
  providerId: string;
  episodes: {
    sub: Episode[];
    dub: Episode[];
  };
}

function filterData(data: RawEpisodeData[], type: "sub" | "dub") {
  // Filter the data based on the type (sub or dub) and providerId
  const filteredData = data.map((item) => {
    if (item?.map === true) {
      if (item.episodes[type].length === 0) {
        return null;
      } else {
        return {
          ...item,
          episodes: Object?.entries(item.episodes[type]).map(
            ([id, episode]) => ({
              ...episode
            })
          )
        };
      }
    }
    return item;
  });

  const noEmpty = filteredData.filter((i) => i !== null);
  return noEmpty;
}

async function fetchConsumet(id?: string | string[] | undefined) {
  try {
    const fetchData = async (dub?: any) => {
      const { data } = await axios.get<ConsumetInfo>(
        `${CONSUMET_URI}/meta/anilist/episodes/${id}${dub ? "?dub=true" : ""}`
      );
      if (data?.message === "Anime not found" && data?.length < 1) {
        return [];
      }

      if (dub) {
        if (!data?.some((i) => i.id.includes("dub"))) return [];
      }

      const reformatted = data?.map((item) => ({
        id: item.id,
        title: item?.title || null,
        img: item?.image || null,
        number: item?.number || null,
        createdAt: item?.airDate || null,
        description: item?.description || null
      }));

      return reformatted;
    };

    const [subData, dubData] = await Promise.all([
      fetchData(),
      fetchData(true)
    ]);

    if (subData.every((i) => i.id?.includes("dub"))) {
      // replace dub in title with sub
      subData.forEach((item) => {
        if (item.id?.includes("dub")) {
          item.id = item.id?.replace("dub", "anime");
        }
      });
      console.log("replaced dub with sub");
    }

    const array = [
      {
        map: true,
        providerId: "gogoanime",
        episodes: {
          sub: isAscending(subData) ? subData : subData.reverse(),
          dub: isAscending(dubData) ? dubData : dubData.reverse()
        }
      }
    ];

    return array;
  } catch (error: any) {
    console.error("Error fetching and processing data:", error.message);
    return [];
  }
}

async function fetchAnify(id?: string) {
  try {
    const { data } = await axios.get<AnifyEpisode[]>(
      `https://api.anify.tv/episodes/${id}`
    );

    if (!data) {
      return [];
    }

    const filtered = data.filter(
      (item) => item.providerId !== "9anime" && item.providerId !== "kass"
    );

    return filtered;
  } catch (error: any) {
    console.error("Error fetching and processing data:", error.message);
    return [];
  }
}

async function fetchCoverImage(id: string, available = false) {
  try {
    if (available) {
      return null;
    }

    const { data } = await axios.get(
      `https://api.anify.tv/content-metadata/${id}`
    );

    if (!data) {
      return [];
    }

    // const getData = getProviderWithMostEpisodesAndImage(data);
    // const getData = data?.[0]?.data;

    const tmdbCover = data.find((object) => { return object.providerId === "tmdb" });
    
    if(tmdbCover) return tmdbCover.data;
    return [];
  } catch (error: any) {
    console.error("Error fetching and processing data:", error.message);
    return [];
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id, releasing = "false", dub = false, refresh = null } = req.query;

  // if releasing is true then cache for 3 hour, if it false cache for 1 month;
  let cacheTime = null;
  if (releasing === "true") {
    cacheTime = 60 * 60 * 3; // 3 hours
  } else if (releasing === "false") {
    cacheTime = 60 * 60 * 24 * 30; // 1 month
  }

  let cached;
  let meta;
  let headers: any = {};

  if (redis) {
    try {
      const ipAddress: any = req.socket.remoteAddress;
      refresh
        ? await rateSuperStrict.consume(ipAddress)
        : await rateLimiterRedis.consume(ipAddress);

      headers = refresh
        ? await rateSuperStrict.get(ipAddress)
        : await rateLimiterRedis.get(ipAddress);
    } catch (error: any) {
      return res.status(429).json({
        error: `Too Many Requests, retry after ${getTimeFromMs(
          error.msBeforeNext
        )}`,
        remaining: error.remainingPoints
      });
    }

    meta = await redis.get(`meta:${id}`);
    const parsedMeta = JSON.parse(meta);
    if (parsedMeta?.length === 0) {
      await redis.del(`meta:${id}`);
      console.log("deleted meta cache");
      meta = null;
    }

    if (refresh !== null) {
      await redis.del(`episode:${id}`);
    } else {
      cached = await redis.get(`episode:${id}`);
      if (cached?.length === 0) {
        await redis.del(`episode:${id}`);
        cached = null;
      }
    }
  }

  if (cached && !refresh) {
    if (dub) {
      const filteredData: EpisodeData[] = filterData(JSON.parse(cached), "dub");

      let filtered = filteredData.filter((item) =>
        item?.episodes?.some((epi) => epi.hasDub !== false)
      );

      if (meta) {
        filtered = await appendMetaToEpisodes(filtered, JSON.parse(meta));
      }

      res.setHeader("X-RateLimit-Remaining", headers.remainingPoints);
      res.setHeader("X-RateLimit-BeforeReset", headers.msBeforeNext);

      return res
        .status(200)
        .json(filtered?.filter((i) => i?.providerId !== "9anime"));
    } else {
      const filteredData = filterData(JSON.parse(cached), "sub");

      let filtered = filteredData;

      if (meta) {
        filtered = await appendMetaToEpisodes(filteredData, JSON.parse(meta));
      }

      res.setHeader("X-RateLimit-Remaining", headers.remainingPoints);
      res.setHeader("X-RateLimit-BeforeReset", headers.msBeforeNext);

      return res
        .status(200)
        .send(filtered?.filter((i) => i?.providerId !== "9anime"));
    }
  } else {
    const [consumet, anify, cover] = await Promise.all([
      fetchConsumet(id),
      fetchAnify(id),
      fetchCoverImage(id, meta)
    ]);

    let subDub = "sub";
    if (dub) {
      subDub = "dub";
    }

    const rawData = [...consumet, ...anify];

    const filteredData = filterData(rawData, subDub);

    let data = filteredData;

    if (meta) {
      data = await appendMetaToEpisodes(filteredData, JSON.parse(meta));
    } else if (
      cover &&
      // !cover?.some((item: { img: null }) => item.img === null) &&
      cover?.length > 0
    ) {
      if (redis)
        await redis.set(`meta:${id}`, JSON.stringify(cover), "EX", cacheTime);
      data = await appendMetaToEpisodes(filteredData, cover);
    }

    if (redis && cacheTime !== null && rawData?.length > 0) {
      await redis.set(
        `episode:${id}`,
        JSON.stringify(rawData),
        "EX",
        cacheTime
      );
    }

    if (dub) {
      const filtered = data.filter(
        (item) => !item.episodes.some((epi) => epi.hasDub === false)
      );
      return res
        .status(200)
        .json(filtered.filter((i) => i.episodes.length > 0));
    }

    if (redis) {
      res.setHeader("X-RateLimit-Limit", refresh ? 1 : 50);
      res.setHeader("X-RateLimit-Remaining", headers.remainingPoints);
      res.setHeader("X-RateLimit-BeforeReset", headers.msBeforeNext);
    }

    return res.status(200).json(data.filter((i) => i.episodes.length > 0));
  }
}

function getTimeFromMs(time: number) {
  const timeInSeconds = time / 1000;

  if (timeInSeconds >= 3600) {
    const hours = Math.floor(timeInSeconds / 3600);
    return `${hours} hour${hours > 1 ? "s" : ""}`;
  } else if (timeInSeconds >= 60) {
    const minutes = Math.floor(timeInSeconds / 60);
    return `${minutes} minute${minutes > 1 ? "s" : ""}`;
  } else {
    return `${timeInSeconds} second${timeInSeconds > 1 ? "s" : ""}`;
  }
}
