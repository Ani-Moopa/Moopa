import { META } from "@consumet/extensions"

const anime = new META.Anilist();

export async function getAnimeEpisode(id: string, isDub: boolean) {
    try {
        const data = await anime.fetchEpisodesListById(id, isDub);

        if (data.length === 0) return null;

        return data;
    } catch (error) {
        console.log(error);
        return null;
    }
}