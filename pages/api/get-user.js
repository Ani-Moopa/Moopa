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
  const user = await getUser(userId);

  res.status(200).json(user);
}
