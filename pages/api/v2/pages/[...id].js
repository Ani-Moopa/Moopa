import axios from "axios";

async function fetchData(id, number, provider, readId) {
  try {
    const { data } = await axios.get(
      `https://api.anify.tv/pages?id=${id}&chapterNumber=${number}&providerId=${provider}&readId=${encodeURIComponent(
        readId
      )}`
    );

    if (!data) {
      return null;
    }

    return data;
  } catch (error) {
    return null;
  }
}

export default async function handler(req, res) {
  const [id, number, provider, readId] = req.query.id;

  try {
    const data = await fetchData(id, number, provider, readId);
    // if (!data) {
    //   return res.status(400).json({ error: "Invalid query" });
    // }

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
