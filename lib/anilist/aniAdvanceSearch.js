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
