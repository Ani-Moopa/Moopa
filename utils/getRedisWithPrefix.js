import { redis } from "@/lib/redis";

export async function getValuesWithPrefix(prefix) {
  let cursor = "0"; // Start at the beginning of the keyspace
  let values = [];

  do {
    const [newCursor, matchingKeys] = await redis.scan(
      cursor,
      "MATCH",
      prefix + "*",
      "COUNT",
      100
    );

    // Retrieve values for matching keys and add them to the array
    for (const key of matchingKeys) {
      const value = await redis.get(key);
      values.push(JSON.parse(value));
    }

    // Update the cursor for the next iteration
    cursor = newCursor;
  } while (cursor !== "0"); // Continue until the cursor is '0'

  return values;
}

export async function countKeysWithPrefix(prefix) {
  let cursor = "0"; // Start at the beginning of the keyspace
  let count = 0;

  do {
    const [newCursor, matchingKeys] = await redis.scan(
      cursor,
      "MATCH",
      prefix + "*",
      "COUNT",
      100
    );

    // Increment the count by the number of matching keys in this iteration
    count += matchingKeys.length;

    // Update the cursor for the next iteration
    cursor = newCursor;
  } while (cursor !== "0"); // Continue until the cursor is '0'

  return count;
}

export async function getValuesWithNumericKeys() {
  const allKeys = await redis.keys("*"); // Fetch all keys in Redis
  const numericKeys = allKeys.filter((key) => /^\d+$/.test(key)); // Filter keys that contain only numbers

  const values = [];

  for (const key of numericKeys) {
    const value = await redis.get(key); // Retrieve the value for each numeric key
    values.push(value);
  }

  return values;
}

export async function getKeysWithNumericKeys() {
  const allKeys = await redis.keys("*"); // Fetch all keys in Redis
  const numericKeys = allKeys.filter((key) => /^\d+$/.test(key)); // Filter keys that contain only numbers

  const values = [];

  for (const key of numericKeys) {
    const value = await redis.del(key);
  }

  return values;
}

export async function countNumericKeys() {
  const allKeys = await redis.keys("*"); // Fetch all keys in Redis
  const numericKeys = allKeys.filter((key) => /^\d+$/.test(key)); // Filter keys that contain only numbers

  return numericKeys.length; // Return the count of numeric keys
}
