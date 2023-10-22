import { advanceSearchQuery } from "../graphql/query";

export async function aniAdvanceSearch({
  search,
  type,
  genres,
  page,
  sort,
  format,
  season,
  seasonYear,
  perPage,
}) {
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
    const response = await fetch("https://api.anify.tv/search-advanced", {
      method: "POST",
      body: JSON.stringify({
        type: "manga",
        genres: categorizedGenres,
        ...(search && { query: search }),
        ...(page && { page: page }),
        ...(perPage && { perPage: perPage }),
        ...(format && { format: format }),
        ...(seasonYear && { year: seasonYear }),
        ...(type && { type: type }),
      }),
    });

    const data = await response.json();
    return {
      pageInfo: {
        hasNextPage: data.length >= (perPage ?? 20),
        currentPage: page,
        lastPage: Math.ceil(data.length / (perPage ?? 20)),
        perPage: perPage ?? 20,
        total: data.length,
      },
      media: data.map((item) => ({
        averageScore: item.averageRating,
        bannerImage: item.bannerImage,
        chapters: item.totalChapters,
        coverImage: {
          color: item.color,
          extraLarge: item.coverImage,
          large: item.coverImage,
        },
        description: item.description,
        duration: item.duration ?? null,
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
