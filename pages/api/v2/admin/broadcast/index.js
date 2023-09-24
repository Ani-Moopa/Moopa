import { rateLimitStrict, redis } from "@/lib/redis";
// import { getServerSession } from "next-auth";
// import { authOptions } from "pages/api/auth/[...nextauth]";

export default async function handler(req, res) {
  // Check if the custom header "X-Your-Custom-Header" is present and has a specific value
  const customHeaderValue = req.headers["x-broadcast-key"];

  if (customHeaderValue !== "get-broadcast") {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    if (redis) {
      try {
        const ipAddress = req.socket.remoteAddress;
        await rateLimitStrict.consume(ipAddress);
      } catch (error) {
        return res.status(429).json({
          error: `Too Many Requests, retry after ${error.msBeforeNext / 1000}`,
        });
      }

      const getId = await redis.get(`broadcast`);
      if (getId) {
        const broadcast = JSON.parse(getId);
        return res
          .status(200)
          .json({ message: broadcast.message, startAt: broadcast.startAt });
      } else {
        return res.status(200).json({ message: "No broadcast" });
      }
    }

    return res.status(200).json({ message: "redis is not defined" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
