import axios from "axios";
import cacheData from "memory-cache";

const API_URL = process.env.API_URI;

export default async function handler(req, res) {
  try {
    const id = req.query.id;
    const dub = req.query.dub || false;
    const refresh = req.query.refresh || false;

    const providers = ["enime", "gogoanime"];
    const datas = [];

    const cached = cacheData.get(id + dub);

    if (refresh) {
      cacheData.del(id + dub);
    }

    if (!refresh && cached) {
      return res.status(200).json(cached);
    } else {
      async function fetchData(provider) {
        try {
          const data = await fetch(
            dub && provider === "gogoanime"
              ? `${API_URL}/meta/anilist/info/${id}?dub=true`
              : `${API_URL}/meta/anilist/info/${id}?provider=${provider}`
          ).then((res) => {
            if (!res.ok) {
              switch (res.status) {
                case 404: {
                  return null;
                }
              }
            }
            return res.json();
          });
          if (data.episodes.length > 0) {
            datas.push({
              providerId: provider,
              episodes: dub ? data.episodes : data.episodes.reverse(),
            });
          }
        } catch (error) {
          console.error(
            `Error fetching data for provider '${provider}':`,
            error
          );
        }
      }
      if (dub === false) {
        await Promise.all(providers.map((provider) => fetchData(provider)));
      } else {
        await fetchData("gogoanime");
      }

      if (datas.length === 0) {
        return res.status(404).json({ message: "Anime not found" });
      } else {
        cacheData.put(id + dub, { data: datas }, 1000 * 60 * 60 * 10); 
        res.status(200).json({ data: datas });
      }
    }
  } catch (error) {
    res.status(500).json({ error });
  }
}
