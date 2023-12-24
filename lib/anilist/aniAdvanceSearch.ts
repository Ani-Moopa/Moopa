import { AnifySearchAdvanceTypes } from "types/info/AnifySearchAdvanceTypes";
import { advanceSearchQuery } from "../graphql/query";

export type AniAdvanceSearch = {
  search?: string;
  type?: string;
  genres?: any[];
  page?: number;
  sort?: string;
  format?:
    | "TV"
    | "TV_SHORT"
    | "MOVIE"
    | "SPECIAL"
    | "OVA"
    | "ONA"
    | "MUSIC"
    | "MANGA"
    | "NOVEL"
    | "ONE_SHOT"
    | undefined;
  season?: string;
  seasonYear?: number;
  perPage?: number;
};

export async function aniAdvanceSearch({
  search,
  type = "ANIME",
  genres,
  page,
  sort,
  format,
  season,
  seasonYear,
  perPage,
}: AniAdvanceSearch) {
  const categorizedGenres = genres?.reduce((result, item) => {
    const existingEntry = result[item.type];

    if (existingEntry) {
      existingEntry.push(item.value);
    } else {
      result[item.type] = [item.value];
    }

    return result;
  }, {});

  if (type === "MANGA") {
    const controller = new AbortController();
    const signal = controller.signal;

    const response = await fetch("https://api.anify.tv/search-advanced", {
      method: "POST",
      signal: signal,
      body: JSON.stringify({
        sort: "averageRating",
        sortDirection: "DESC",
        ...(categorizedGenres && { ...categorizedGenres }),
        ...(search && { query: search }),
        ...(page && { page: page }),
        ...(perPage && { perPage: perPage }),
        ...(format && { format: [format] }),
        ...(seasonYear && { year: Number(seasonYear) }),
        ...(type && { type: format === "NOVEL" ? "novel" : type }),
      }),
    });

    const data: AnifySearchAdvanceTypes = await response.json();
    return {
      pageInfo: {
        hasNextPage: page ?? 0 < data.total,
        currentPage: page,
        lastPage: Math.ceil(data.lastPage),
        perPage: perPage ?? 20,
        total: data.total,
      },
      media: data.results?.map((item) => ({
        averageScore: item.averageRating,
        bannerImage: item.bannerImage,
        chapters: item.totalChapters,
        coverImage: {
          color: item.color,
          extraLarge: item.coverImage,
          large: item.coverImage,
        },
        description: item.description,
        duration: item?.duration ?? null,
        endDate: {
          day: null,
          month: null,
          year: null,
        },
        mappings: item.mappings,
        format: item.format,
        genres: item.genres,
        id: item.id,
        isAdult: false,
        mediaListEntry: null,
        nextAiringEpisode: null,
        popularity: item.averagePopularity,
        season: null,
        seasonYear: item.year,
        startDate: {
          day: null,
          month: null,
          year: item.year,
        },
        status: item.status,
        studios: { edges: [] },
        title: {
          userPreferred:
            item.title.english ?? item.title.romaji ?? item.title.native,
        },
        type: item.type,
        volumes: item.totalVolumes ?? null,
      })),
    };
  } else {
    const response = await fetch("https://graphql.anilist.co/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: advanceSearchQuery,
        variables: {
          ...(search && {
            search: search,
            ...(!sort && { sort: "SEARCH_MATCH" }),
          }),
          ...(type && { type: type }),
          ...(seasonYear && { seasonYear: seasonYear }),
          ...(season && {
            season: season,
            ...(!seasonYear && { seasonYear: new Date().getFullYear() }),
          }),
          ...(categorizedGenres && { ...categorizedGenres }),
          ...(format && { format: format }),
          // ...(genres && { genres: genres }),
          // ...(tags && { tags: tags }),
          ...(perPage && { perPage: perPage }),
          ...(sort && { sort: sort }),
          ...(page && { page: page }),
        },
      }),
    });

    const datas = await response.json();
    // console.log(datas);
    const data = datas.data.Page;
    return data;
  }
}
