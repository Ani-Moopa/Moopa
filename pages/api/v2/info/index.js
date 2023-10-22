import { redis } from "@/lib/redis";
import axios from "axios";

const API_KEY = process.env.API_KEY;

export async function fetchInfo(id) {
  try {
    // console.log(id);
    const { data } = await axios
      .get(`https://api.anify.tv/info/${id}?apikey=${API_KEY}`)
      .catch((err) => {
        return {
          data: null,
        };
      });

    if (!data) {
      return null;
    }

    const { data: Chapters } = await axios.get(
      `https://api.anify.tv/chapters/${data.id}?apikey=${API_KEY}`
    );

    if (!Chapters) {
      return null;
    }

    return { id: data.id, chapters: Chapters };
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}

export default async function handler(req, res) {
  //const [romaji, english, native] = req.query.title;
  const { id } = req.query;
  try {
    let cached;
    // const data = await fetchInfo(id);
    cached = await redis.get(`manga:${id}`);

    if (cached) {
      return res.status(200).json(JSON.parse(cached));
    }

    const manga = await fetchInfo(id);

    if (!manga) {
      return res.status(404).json({ error: "Manga not found" });
    }

    await redis.set(`manga:${id}`, JSON.stringify(manga), "ex", 60 * 60 * 24);

    res.status(200).json(manga);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
