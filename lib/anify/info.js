import axios from "axios";

export async function fetchInfo(id) {
  try {
    const { data } = await axios.get(`https://api.anify.tv/info/${id}`);
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}

export default async function getAnifyInfo(id) {
  try {
    const data = await fetchInfo(id);
    if (data) {
      return data;
    } else {
      return { message: "Anify Info Not Found!" };
    }
  } catch (error) {
    return { error };
  }
}
