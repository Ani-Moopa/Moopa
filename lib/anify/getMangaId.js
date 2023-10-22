import axios from "axios";

export async function fetchInfo(romaji, english, native) {
  try {
    const { data: getManga } = await axios.get(
      `https://api.anify.tv/search-advanced?query=${
        english || romaji
      }&type=manga`
    );

    const findManga = getManga.find(
      (manga) =>
        manga.title.romaji === romaji ||
        manga.title.english === english ||
        manga.title.native === native
    );

    if (!findManga) {
      return null;
    }

    return { id: findManga.id };
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}

export default async function getMangaId(romaji, english, native) {
  try {
    const data = await fetchInfo(romaji, english, native);
    if (data) {
      return data;
    } else {
      return { message: "Schedule not found" };
    }
  } catch (error) {
    return { error };
  }
}
