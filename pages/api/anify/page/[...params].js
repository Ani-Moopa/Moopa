import axios from "axios";
import cacheData from "memory-cache";

const API_KEY = process.env.API_KEY;

// Function to fetch new data
async function fetchData(id, providerId, chapterId) {
  try {
    const res = await fetch(
      `https://api.anify.tv/pages?id=${id}&providerId=${providerId}&readId=${chapterId}&apikey=${API_KEY}`
    );
    const data = await res.json();
    return data;
    // return { id, providerId, chapterId };
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}

export default async function handler(req, res) {
  try {
    const id = req.query.params;
    const chapter = req.query.chapter;
    // res.status(200).json({ id, chapter });
    const cached = cacheData.get(chapter);
    if (cached) {
      return res.status(200).json(cached);
    } else {
      const data = await fetchData(id[0], id[1], chapter);
      if (data) {
        res.status(200).json(data);
        cacheData.put(id[2], data, 1000 * 60 * 10);
      } else {
        res.status(404).json({ message: "Manga/Novel not found :(" });
      }
    }
  } catch (error) {
    res.status(500).json({ error });
  }
}
