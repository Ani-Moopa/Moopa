import { META } from "@consumet/extensions";

const anime = new META.Anilist();

export async function getAnimeSource(id: string) {
    try {
        const data = await anime.fetchEpisodeSources(id);

        if (!data) return null;

        return data
    } catch (error) {
        console.log(error);
        return null;        
    }
}