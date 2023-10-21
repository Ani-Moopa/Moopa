import { redis } from "../redis";

// Function to fetch new data
async function fetchData(id, providerId, chapter, key) {
  try {
    const res = await fetch(
      `https://api.anify.tv/pages?id=${id}&providerId=${providerId}&readId=${chapter.id}&chapterNumber=${chapter.number}&apikey=${key}`
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
  chapter,
  key
) {
  try {
    let cached;
    if (redis) {
      cached = await redis.get(chapter.id);
    }
    if (cached) {
      return JSON.parse(cached);
    } else {
      const data = await fetchData(mediaId, providerId, chapter, key);
      if (!data.error) {
        if (redis) {
          await redis.set(chapter.id, JSON.stringify(data), "EX", 60 * 10);
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
