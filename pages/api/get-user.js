import clientPromise from "../../lib/mongodb";

export async function getUser(userId) {
  const client = await clientPromise;
  const db = client.db("authbase");

  const collection = db.collection("users");
  const user = await collection.findOne({ id: userId });

  if (user && user._id) {
    user._id = String(user._id);
  }

  return user;
}

export default async function handler(req, res) {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  const user = await getUser(userId);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.status(200).json(user);
}
