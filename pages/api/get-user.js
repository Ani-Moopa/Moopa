import clientPromise from "../../lib/mongodb";

export async function getUser(userName) {
  const client = await clientPromise;
  const db = client.db("authbase");

  const collection = db.collection("users");
  const user = await collection.findOne({ name: userName });

  if (user && user._id) {
    user._id = String(user._id);
  }

  return user;
}

export default async function handler(req, res) {
  const { userName } = req.query;
  const user = await getUser(userName);

  res.status(200).json(user);
}
