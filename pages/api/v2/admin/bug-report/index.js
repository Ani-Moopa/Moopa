import { rateLimitStrict, redis } from "@/lib/redis";
// import { getServerSession } from "next-auth";
// import { authOptions } from "pages/api/auth/[...nextauth]";

export default async function handler(req, res) {
  //   const session = await getServerSession(req, res, authOptions);
  //   const admin = session?.user?.name === process.env.ADMIN_USERNAME;
  // create random id each time the endpoint is called
  const id = Math.random().toString(36).substr(2, 9);

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
        const { data } = req.body;

        data.id = id;

        await redis.set(`report:${id}`, JSON.stringify(data));
        return res
          .status(200)
          .json({ message: `Report has successfully sent, with Id of ${id}` });
      } else if (req.method === "DELETE") {
        const { reportId } = req.body;
        await redis.del(`report:${reportId}`);
        return res.status(200).json({ message: `Report has been deleted` });
      } else {
        return res.status(405).json({ message: "Method not allowed" });
      }
    }

    return res.status(200).json({ message: "redis is not defined" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
