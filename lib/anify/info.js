import axios from "axios";
import { redis } from "../redis";

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
    let cached;
    if (redis) {
      cached = await redis.get(id);
    }
    if (cached) {
      return JSON.parse(cached);
    } else {
      const data = await fetchInfo(id, key);
      if (data) {
        if (redis) {
          await redis.set(id, JSON.stringify(data), "EX", 60 * 10);
        }
        return data;
      } else {
        return { message: "Schedule not found" };
      }
    }
  } catch (error) {
    return { error };
  }
}
