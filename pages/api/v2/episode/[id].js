import axios from "axios";
import redis from "../../../../lib/redis";

const CONSUMET_URI = process.env.API_URI;
const API_KEY = process.env.API_KEY;

async function fetchConsumet(id, dub) {
  try {
    if (dub) {
      return [];
    }

    const { data } = await axios.get(`${CONSUMET_URI}/meta/anilist/info/${id}`);

    if (!data?.episodes?.length > 0) {
      return [];
    }

    const array = [
      {
        map: true,
        providerId: "gogoanime",
        episodes: data.episodes.reverse(),
      },
    ];

    return array;
  } catch (error) {
    console.error(error);
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
    console.error(error);
    return [];
  }
}

export default async function handler(req, res) {
  const { id, releasing = "false", dub = false } = req.query;

  // if releasing is true then cache for 10 minutes, if it false cache for 1 week;
  const cacheTime = releasing === "true" ? 60 * 10 : 60 * 60 * 24 * 7;

  let cached;

  if (redis) {
    cached = await redis.get(id);
    console.log("using redis");
  }

  if (cached) {
    if (dub) {
      const filtered = JSON.parse(cached).filter((item) =>
        item.episodes.some((epi) => epi.hasDub === true)
      );
      return res.status(200).json(filtered);
    } else {
      return res.status(200).json(JSON.parse(cached));
    }
  }

  const [consumet, anify] = await Promise.all([
    fetchConsumet(id, dub),
    fetchAnify(id),
  ]);

  const data = [...consumet, ...anify];

  if (redis && cacheTime !== null) {
    await redis.set(id, JSON.stringify(data), "EX", cacheTime);
  }

  if (dub) {
    const filtered = data.filter((item) =>
      item.episodes.some((epi) => epi.hasDub === true)
    );
    return res.status(200).json(filtered);
  }

  console.log("fresh data");

  return res.status(200).json(data);
}
