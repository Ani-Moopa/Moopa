import { redis } from "../redis";

// Function to fetch new data
async function fetchData(id, providerId, chapterId, key) {
  try {
    const res = await fetch(
      `https://api.anify.tv/pages?id=${id}&providerId=${providerId}&readId=${chapterId}&apikey=${key}`
    );
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}

export default async function getAnifyPage(
  mediaId,
  providerId,
  chapterId,
  key
) {
  try {
    let cached;
    if (redis) {
      cached = await redis.get(chapterId);
    }
    if (cached) {
      return JSON.parse(cached);
    } else {
      const data = await fetchData(mediaId, providerId, chapterId, key);
      if (!data.error) {
        if (redis) {
          await redis.set(chapterId, JSON.stringify(data), "EX", 60 * 10);
        }
        return data;
      } else {
        return { message: "Manga/Novel not found :(" };
      }
    }
  } catch (error) {
    return { error };
  }
}
