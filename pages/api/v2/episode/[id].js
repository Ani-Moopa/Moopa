import axios from "axios";
import { rateLimitStrict, rateLimiterRedis, redis } from "@/lib/redis";
import appendMetaToEpisodes from "@/utils/appendMetaToEpisodes";

let CONSUMET_URI;

CONSUMET_URI = process.env.API_URI || null;
if (CONSUMET_URI && CONSUMET_URI.endsWith("/")) {
  CONSUMET_URI = CONSUMET_URI.slice(0, -1);
}

const API_KEY = process.env.API_KEY;

const isAscending = (data) => {
  for (let i = 1; i < data.length; i++) {
    if (data[i].number < data[i - 1].number) {
      return false;
    }
  }
  return true;
};

function filterData(data, type) {
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
              ...episode,
            })
          ),
        };
      }
    }
    return item;
  });

  const noEmpty = filteredData.filter((i) => i !== null);
  return noEmpty;
}

async function fetchConsumet(id) {
  try {
    async function fetchData(dub) {
      const { data } = await axios.get(
        `${CONSUMET_URI}/meta/anilist/episodes/${id}${dub ? "?dub=true" : ""}`
      );
      if (data?.message === "Anime not found" && data?.length < 1) {
        return [];
      }

      if (dub) {
        if (!data?.some((i) => i.id.includes("dub"))) return [];
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

      return reformatted;
    }

    const [subData, dubData] = await Promise.all([
      fetchData(),
      fetchData(true),
    ]);

    const array = [
      {
        map: true,
        providerId: "gogoanime",
        episodes: {
          sub: isAscending(subData) ? subData : subData.reverse(),
          dub: isAscending(dubData) ? dubData : dubData.reverse(),
        },
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
    const { data } = await axios.get(`https://api.anify.tv/episodes/${id}`);

    if (!data) {
      return [];
    }

    const filtered = data.filter((item) => item.providerId !== "kass");
    // const modifiedData = filtered.map((provider) => {
    //   if (provider.providerId === "gogoanime") {
    //     const reversedEpisodes = [...provider.episodes].reverse();
    //     return { ...provider, episodes: reversedEpisodes };
    //   }
    //   return provider;
    // });

    // return modifiedData;
    return filtered;
  } catch (error) {
    console.error("Error fetching and processing data:", error.message);
    return [];
  }
}

async function fetchCoverImage(id, available = false) {
  try {
    if (!process.env.API_KEY) {
      return [];
    }

    if (available) {
      return null;
    }

    const { data } = await axios.get(
      `https://api.anify.tv/content-metadata/${id}`
    );

    if (!data) {
      return [];
    }

    const getData = data[0].data;

    return getData;
  } catch (error) {
    console.error("Error fetching and processing data:", error.message);
    return [];
  }
}

export default async function handler(req, res) {
  const { id, releasing = "false", dub = false, refresh = null } = req.query;

  // if releasing is true then cache for 1 hour, if it false cache for 1 month;
  let cacheTime = null;
  if (releasing === "true") {
    cacheTime = 60 * 60; // 1 hour
  } else if (releasing === "false") {
    cacheTime = 60 * 60 * 24 * 30; // 1 month
  }

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
      await redis.del(`episode:${id}`);
      console.log("deleted cache");
    } else {
      cached = await redis.get(`episode:${id}`);
      console.log("using redis");
    }

    meta = await redis.get(`meta:${id}`);
  }

  if (cached && !refresh) {
    if (dub) {
      const filteredData = filterData(JSON.parse(cached), "dub");

      let filtered = filteredData.filter((item) =>
        item?.episodes?.some((epi) => epi.hasDub !== false)
      );

      if (meta) {
        filtered = await appendMetaToEpisodes(filtered, JSON.parse(meta));
      }

      return res.status(200).json(filtered);
    } else {
      const filteredData = filterData(JSON.parse(cached), "sub");

      let filtered = filteredData;

      if (meta) {
        filtered = await appendMetaToEpisodes(filteredData, JSON.parse(meta));
      }

      return res.status(200).json(filtered);
    }
  } else {
    const [consumet, anify, cover] = await Promise.all([
      fetchConsumet(id, dub),
      fetchAnify(id),
      fetchCoverImage(id, meta),
    ]);

    // const hasImage = consumet.map((i) =>
    //   i.episodes?.sub?.some(
    //     (e) => e.img !== null || !e.img.includes("https://s4.anilist.co/")
    //   )
    // );

    let subDub = "sub";
    if (dub) {
      subDub = "dub";
    }

    const rawData = [...consumet, ...anify];

    const filteredData = filterData(rawData, subDub);

    let data = filteredData;

    if (meta) {
      data = await appendMetaToEpisodes(filteredData, JSON.parse(meta));
    } else if (cover && !cover.some((e) => e.img === null)) {
      if (redis) await redis.set(`meta:${id}`, JSON.stringify(cover));
      data = await appendMetaToEpisodes(filteredData, cover);
    }

    if (redis && cacheTime !== null) {
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

    console.log("fresh data");

    return res.status(200).json(data.filter((i) => i.episodes.length > 0));
  }
}
