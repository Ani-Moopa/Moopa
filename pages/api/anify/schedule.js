import axios from "axios";
import cacheData from "memory-cache";
import cron from "cron";

const API_KEY = process.env.API_KEY;

// Function to fetch new data
async function fetchData() {
  try {
    const { data } = await axios.get(
      `https://api.anify.tv/schedule?apikey=${API_KEY}`
    );
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}

// Function to refresh the cache with new data
async function refreshCache() {
  const newData = await fetchData();
  if (newData) {
    cacheData.put("schedule", newData, 1000 * 60 * 15);
    console.log("Cache refreshed successfully.");
  }
}

// Schedule cache refresh every Monday at 00:00 AM (local time)
const job = new cron.CronJob("0 0 * * 1", () => {
  refreshCache();
});
job.start();

export default async function handler(req, res) {
  try {
    const cached = cacheData.get("schedule");
    if (cached) {
      return res.status(200).json(cached);
    } else {
      const data = await fetchData();

      if (data) {
        res.status(200).json(data);
        cacheData.put("schedule", data, 1000 * 60 * 60 * 24 * 7);
      } else {
        res.status(404).json({ message: "Schedule not found" });
      }
    }
  } catch (error) {
    res.status(500).json({ error });
  }
}
