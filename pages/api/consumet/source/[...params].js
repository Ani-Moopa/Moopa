import axios from "axios";
import cacheData from "memory-cache";

const API_URL = process.env.API_URI;

export default async function handler(req, res) {
  const query = req.query.params;
  try {
    const provider = query[0];
    const id = query[1];

    const cached = cacheData.get(id);
    if (cached) {
      return res.status(200).json(cached);
    } else {
      let datas;

      const { data } = await axios.get(
        `${API_URL}/meta/anilist/watch/${id}?provider=${provider}`
      );

      if (data) {
        datas = data;
        cacheData.put(id, data, 1000 * 60 * 5);
      }

      if (!datas) {
        return res.status(404).json({ message: "Source not found" });
      }

      res.status(200).json(datas);
    }
  } catch (error) {
    res.status(500).json({ error });
  }
}
