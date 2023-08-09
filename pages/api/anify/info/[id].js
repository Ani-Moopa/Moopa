import axios from "axios";
import cacheData from "memory-cache";

const API_KEY = process.env.API_KEY;

// Function to fetch new data
export async function fetchInfo(id) {
  try {
    const { data } = await axios.get(
      `https://api.anify.tv/info/${id}?apikey=${API_KEY}`
    );
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}

export default async function handler(req, res) {
  try {
    const id = req.query.id;
    const cached = cacheData.get(id);
    if (cached) {
      return res.status(200).json(cached);
    } else {
      const data = await fetchInfo(id);
      if (data) {
        res.status(200).json(data);
        cacheData.put(id, data, 1000 * 60 * 10);
      } else {
        res.status(404).json({ message: "Schedule not found" });
      }
    }
  } catch (error) {
    res.status(500).json({ error });
  }
}
