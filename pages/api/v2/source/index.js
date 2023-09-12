import axios from "axios";

const CONSUMET_URI = process.env.API_URI;
const API_KEY = process.env.API_KEY;

async function consumetSource(id) {
  try {
    const { data } = await axios.get(
      `${CONSUMET_URI}/meta/anilist/watch/${id}`
    );
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function anifySource(providerId, watchId, episode, id, sub) {
  try {
    const { data } = await axios.get(
      `https://api.anify.tv/sources?providerId=${providerId}&watchId=${encodeURIComponent(
        watchId
      )}&episode=${episode}&id=${id}&subType=${sub}&apikey=${API_KEY}`
    );
    return data;
  } catch (error) {
    return null;
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { source, providerId, watchId, episode, id, sub = "sub" } = req.body;

  if (source === "anify") {
    const data = await anifySource(providerId, watchId, episode, id, sub);
    return res.status(200).json(data);
  }

  if (source === "consumet") {
    const data = await consumetSource(watchId);
    return res.status(200).json(data);
  }
}
