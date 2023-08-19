import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";

import {
  createList,
  deleteEpisode,
  getEpisode,
  updateUserEpisode,
} from "../../../../prisma/user";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (session) {
    // Signed in
    try {
      switch (req.method) {
        case "POST": {
          const { name, id } = JSON.parse(req.body);

          if (session.user.name !== name) {
            return res.status(401).json({ message: "Unauthorized" });
          } else {
            const episode = await createList(name, id);
            if (!episode) {
              return res
                .status(200)
                .json({ message: "Episode is already created" });
            } else {
              return res.status(201).json(episode);
            }
          }
        }
        case "PUT": {
          const {
            name,
            id,
            watchId,
            title,
            image,
            number,
            duration,
            timeWatched,
            aniTitle,
            provider,
            nextId,
            nextNumber,
          } = JSON.parse(req.body);
          const episode = await updateUserEpisode({
            name,
            id,
            watchId,
            title,
            image,
            number,
            duration,
            timeWatched,
            aniTitle,
            provider,
            nextId,
            nextNumber,
          });
          if (!episode) {
            return res
              .status(200)
              .json({ message: "Episode is already there" });
          } else {
            return res.status(200).json(episode);
          }
        }
        case "GET": {
          const { name, id } = req.query;
          // console.log(req.query);
          const episode = await getEpisode(name, id);
          if (!episode) {
            return res.status(404).json({ message: "Episode not found" });
          } else {
            return res.status(200).json(episode);
          }
        }
        case "DELETE": {
          const { name, id } = req.body;
          if (session.user.name !== name) {
            return res.status(401).json({ message: "Unauthorized" });
          } else {
            const episode = await deleteEpisode(name, id);
            if (!episode) {
              return res.status(404).json({ message: "Episode not found" });
            } else {
              return res.status(200).json({ message: "Episode deleted" });
            }
          }
        }
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  } else {
    // Not Signed in
    res.status(401);
  }
  res.end();
}
