import axios from "axios";
import cacheData from "memory-cache";

export async function fetchInfo(id, key) {
  try {
    const { data } = await axios.get(
      `https://api.anify.tv/info/${id}?apikey=${key}`
    );
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}

export default async function getAnifyInfo(id, key) {
  try {
    const cached = cacheData.get(id);
    if (cached) {
      return cached;
    } else {
      const data = await fetchInfo(id, key);
      if (data) {
        cacheData.put(id, data, 1000 * 60 * 10);
        return data;
      } else {
        return { message: "Schedule not found" };
      }
    }
  } catch (error) {
    return { error };
  }
}
