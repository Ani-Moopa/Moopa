import { rateLimitStrict, redis } from "@/lib/redis";
// import { getServerSession } from "next-auth";
// import { authOptions } from "pages/api/auth/[...nextauth]";

export default async function handler(req, res) {
  //   const session = await getServerSession(req, res, authOptions);
  //   const admin = session?.user?.name === process.env.ADMIN_USERNAME;
  // create random id each time the endpoint is called
  const id = Math.random().toString(36).substr(2, 9);

  //   if (!admin) {
  //     return res.status(401).json({ message: "Unauthorized" });
  //   }
  const { data } = req.body;

  // if method is not POST return message "Method not allowed"
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
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

      const getId = await redis.get(`report:${id}`);
      if (getId) {
        return res
          .status(200)
          .json({ message: `Data already exist for id: ${id}` });
      }
      await redis.set(`report:${id}`, JSON.stringify(data));
      return res
        .status(200)
        .json({ message: `Report has successfully sent, with Id of ${id}` });
    }

    return res.status(200).json({ message: "redis is not defined" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
