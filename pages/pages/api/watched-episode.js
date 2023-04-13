// pages/api/update-user.js
import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db("authbase");
  const collection = db.collection("users");

  const { username, id, newData } = req.body; // id is the user ID and newData is the new data you want to set

  try {
    const result = await collection.updateOne(
      {
        name: username,
        "recentWatch.id": id,
        "recentWatch.episode.id": { $ne: newData.id },
      },
      { $addToSet: { "recentWatch.$.episode": newData } }
    );

    if (result.modifiedCount === 0) {
      const updateResult = await collection.updateOne(
        {
          name: username,
          "recentWatch.id": id,
          "recentWatch.episode.id": newData.id,
          "recentWatch.episode.time": { $ne: newData.time },
        },
        { $set: { "recentWatch.$.episode.$[elem].time": newData.time } },
        { arrayFilters: [{ "elem.id": newData.id }] }
      );
      if (updateResult.modifiedCount === 0) {
        console.log("The episode already exists with the same time.");
      }
    }

    console.log("Successfully updated the recentWatch collection.");

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Unable to update user data", dat: newData });
  }
}
