const advance = `
  query ($search: String, $type: MediaType, $status: MediaStatus, $season: MediaSeason, $seasonYear: Int, $genres: [String], $tags: [String], $sort: [MediaSort], $page: Int, $perPage: Int) {
    Page (page: $page, perPage: $perPage) {
      pageInfo {
        total
        currentPage
        lastPage
        hasNextPage
      }
      media (search: $search, type: $type, status: $status, season: $season, seasonYear: $seasonYear, genre_in: $genres, tag_in: $tags, sort: $sort, isAdult: false) {
        id
        title {
            userPreferred
        }
        type
        episodes
        status
        format
        season
        seasonYear
        coverImage {
          extraLarge
          color
        }
        averageScore
        isAdult
      }
    }
  }
`;

export async function aniAdvanceSearch(options = {}) {
  const {
    search = null,
    type = "ANIME",
    seasonYear = NaN,
    season = undefined,
    genres = null,
    page = 1,
    perPage = null,
    sort = "POPULARITY_DESC",
  } = options;
  // console.log(page);
  const response = await fetch("https://graphql.anilist.co/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: advance,
      variables: {
        search: search,
        type: type,
        seasonYear: seasonYear,
        season: season,
        genres: genres,
        perPage: perPage,
        sort: sort,
        page: page,
      },
    }),
  });

  const datas = await response.json();
  // console.log(datas);
  const data = datas.data.Page;
  return data;
}
