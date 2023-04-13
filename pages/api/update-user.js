// pages/api/update-user.js
import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db("authbase");
  const collection = db.collection("users");

  const { name, newData } = req.body; // id is the user ID and newData is the new data you want to set

  try {
    const result = await collection.updateOne(
      { name: name },
      { $addToSet: newData }
    );

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Unable to update user data" });
  }
}
