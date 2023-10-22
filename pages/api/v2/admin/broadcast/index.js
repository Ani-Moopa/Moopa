import { rateLimitStrict, redis } from "@/lib/redis";
import { getServerSession } from "next-auth";
import { authOptions } from "pages/api/auth/[...nextauth]";

export default async function handler(req, res) {
  // Check if the custom header "X-Your-Custom-Header" is present and has a specific value
  const sessions = await getServerSession(req, res, authOptions);

  const admin = sessions?.user?.name === process.env.ADMIN_USERNAME;
  // if req.method === POST and admin === false return 401
  if (!admin && req.method === "DELETE") {
    return res.status(401).json({ message: "Unauthorized" });
  }

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

      if (req.method === "POST") {
        const { message, startAt = undefined, show = false } = req.body;
        if (!message) {
          return res.status(400).json({ message: "Message is required" });
        }

        const broadcastContent = {
          message,
          startAt,
          show,
        };
        await redis.set(`broadcasts`, JSON.stringify(broadcastContent));
        return res.status(200).json({ message: "Broadcast created" });
      } else if (req.method === "DELETE") {
        const br = await redis.get(`broadcasts`);
        // set broadcast show as false
        if (br) {
          const broadcast = JSON.parse(br);
          broadcast.show = false;
          await redis.set(`broadcasts`, JSON.stringify(broadcast));
        }
        return res.status(200).json({ message: "Broadcast deleted" });
      } else if (req.method === "GET") {
        const getId = await redis.get(`broadcasts`);
        if (getId) {
          const broadcast = JSON.parse(getId);
          return res.status(200).json({
            message: broadcast.message,
            startAt: broadcast.startAt,
            show: broadcast.show,
          });
        } else {
          return res.status(200).json({ message: "No broadcast" });
        }
      }
    }

    return res.status(200).json({ message: "redis is not defined" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
