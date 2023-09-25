import axios from "axios";
import { rateLimitStrict, rateLimiterRedis, redis } from "@/lib/redis";
import appendImagesToEpisodes from "@/utils/combineImages";
import appendMetaToEpisodes from "@/utils/appendMetaToEpisodes";

const CONSUMET_URI = process.env.API_URI;
const API_KEY = process.env.API_KEY;

const isAscending = (data) => {
  for (let i = 1; i < data.length; i++) {
    if (data[i].number < data[i - 1].number) {
      return false;
    }
  }
  return true;
};

async function fetchConsumet(id, dub) {
  try {
    if (dub) {
      return [];
    }

    const { data } = await axios.get(
      `${CONSUMET_URI}/meta/anilist/episodes/${id}`
    );

    if (data?.message === "Anime not found" && data?.length < 1) {
      return [];
    }

    const reformatted = data.map((item) => ({
      id: item?.id || null,
      title: item?.title || null,
      img: item?.image || null,
      number: item?.number || null,
      createdAt: item?.createdAt || null,
      description: item?.description || null,
      url: item?.url || null,
    }));

    const array = [
      {
        map: true,
        providerId: "gogoanime",
        episodes: isAscending(reformatted)
          ? reformatted
          : reformatted.reverse(),
      },
    ];

    return array;
  } catch (error) {
    console.error("Error fetching and processing data:", error.message);
    return [];
  }
}

async function fetchAnify(id) {
  try {
    if (!process.env.API_KEY) {
      return [];
    }

    const { data } = await axios.get(
      `https://api.anify.tv/episodes/${id}?apikey=${API_KEY}`
    );

    if (!data) {
      return [];
    }

    const filtered = data.filter(
      (item) => item.providerId !== "animepahe" && item.providerId !== "kass"
    );
    const modifiedData = filtered.map((provider) => {
      if (provider.providerId === "gogoanime") {
        const reversedEpisodes = [...provider.episodes].reverse();
        return { ...provider, episodes: reversedEpisodes };
      }
      return provider;
    });

    return modifiedData;
  } catch (error) {
    console.error("Error fetching and processing data:", error.message);
    return [];
  }
}

async function fetchCoverImage(id) {
  try {
    if (!process.env.API_KEY) {
      return [];
    }

    const { data } = await axios.get(
      `https://api.anify.tv/episode-covers/${id}?apikey=${API_KEY}`
    );

    if (!data) {
      return [];
    }

    return data;
  } catch (error) {
    console.error("Error fetching and processing data:", error.message);
    return [];
  }
}

export default async function handler(req, res) {
  const { id, releasing = "false", dub = false, refresh = null } = req.query;

  // if releasing is true then cache for 10 minutes, if it false cache for 1 month;
  const cacheTime = releasing === "true" ? 60 * 10 : 60 * 60 * 24 * 30;

  let cached;
  let meta;

  if (redis) {
    try {
      const ipAddress = req.socket.remoteAddress;
      refresh
        ? await rateLimitStrict.consume(ipAddress)
        : await rateLimiterRedis.consume(ipAddress);
    } catch (error) {
      return res.status(429).json({
        error: `Too Many Requests, retry after ${error.msBeforeNext / 1000}`,
      });
    }

    if (refresh) {
      await redis.del(id);
      console.log("deleted cache");
    } else {
      cached = await redis.get(id);
      console.log("using redis");
    }

    meta = await redis.get(`meta:${id}`);
  }

  if (cached && !refresh) {
    if (dub) {
      const filtered = JSON.parse(cached).filter((item) =>
        item.episodes.some((epi) => epi.hasDub === true)
      );
      return res.status(200).json(filtered);
    } else {
      return res.status(200).json(JSON.parse(cached));
    }
  } else {
    const [consumet, anify, cover] = await Promise.all([
      fetchConsumet(id, dub),
      fetchAnify(id),
      fetchCoverImage(id),
    ]);

    const hasImage = consumet.map((i) =>
      i.episodes.some(
        (e) => e.img !== null || !e.img.includes("https://s4.anilist.co/")
      )
    );

    const rawData = [...consumet, ...anify];

    let data = rawData;

    if (meta) {
      data = await appendMetaToEpisodes(rawData, JSON.parse(meta));
    } else if (cover && cover?.length > 0 && !hasImage.includes(true))
      data = await appendImagesToEpisodes(rawData, cover);

    if (redis && cacheTime !== null) {
      await redis.set(
        id,
        JSON.stringify(data.filter((i) => i.episodes.length > 0)),
        "EX",
        cacheTime
      );
    }

    if (dub) {
      const filtered = data.filter((item) =>
        item.episodes.some((epi) => epi.hasDub === true)
      );
      return res.status(200).json(filtered);
    }

    console.log("fresh data");

    return res.status(200).json(data.filter((i) => i.episodes.length > 0));
  }
}
