import {
  createUser,
  deleteUser,
  getUser,
  updateUser,
} from "../../../prisma/user";

export default async function handler(req, res) {
  try {
    switch (req.method) {
      case "POST": {
        const { name, setting } = req.body;
        const new_user = await createUser(name, setting);
        if (!new_user) {
          return res.status(200).json({ message: "User is already created" });
        } else {
          return res.status(201).json(new_user);
        }
      }
      case "PUT": {
        const { name, anime } = req.body;
        const user = await updateUser(name, anime);
        if (!user) {
          return res.status(200).json({ message: "Title is already there" });
        } else {
          return res.status(200).json(user);
        }
      }
      case "GET": {
        const { name } = req.query;
        const user = await getUser(name);
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        } else {
          return res.status(200).json(user);
        }
      }
      case "DELETE": {
        const { name } = req.body;
        const user = await deleteUser(name);
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        } else {
          return res.status(200).json(user);
        }
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
