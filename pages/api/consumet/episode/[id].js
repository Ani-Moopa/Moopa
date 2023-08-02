import axios from "axios";
import cacheData from "memory-cache";

const API_URL = process.env.API_URI;

export default async function handler(req, res) {
  try {
    const id = req.query.id;
    const dub = req.query.dub || false;

    const cached = cacheData.get(id + dub);
    if (cached) {
      return res.status(200).json(cached);
    } else {
      const providers = ["enime", "gogoanime"];
      const datas = [];

      async function fetchData(provider) {
        try {
          const { data } = await axios.get(
            `${API_URL}/meta/anilist/info/${id}?provider=${provider}${
              dub && "&dub=true"
            }`
          );
          if (data.episodes.length > 0) {
            datas.push({
              providerId: provider,
              episodes: dub ? data.episodes : data.episodes.reverse(),
            });
          }
          // console.log(data);
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
        // cache for 15 minutes
        cacheData.put(id + dub, { data: datas }, 1000 * 60 * 15);

        res.status(200).json({ data: datas });
      }
    }
  } catch (error) {
    res.status(500).json({ error });
  }
}
