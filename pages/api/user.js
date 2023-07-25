import { createUser, getUser } from "../../prisma/user";

export default async function handler(req, res) {
  try {
    switch (req.method) {
      case "POST": {
        const { name, setting, animeWatched } = JSON.parse(req.body);
        const new_user = await createUser(name, setting);
        return res.status(201).json(new_user);
      }
      case "GET": {
        const { name } = req.query;
        const user = await getUser(name);
        return res.status(200).json(user);
      }
    }
  } catch (error) {}
}
