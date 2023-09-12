const getUpcomingAnime = async () => {
  // Determine the current season and year
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  let currentSeason, currentYear;

  if (currentMonth < 3) {
    currentSeason = "WINTER";
    currentYear = currentDate.getFullYear();
  } else if (currentMonth < 6) {
    currentSeason = "SPRING";
    currentYear = currentDate.getFullYear();
  } else if (currentMonth < 9) {
    currentSeason = "SUMMER";
    currentYear = currentDate.getFullYear();
  } else {
    currentSeason = "FALL";
    currentYear = currentDate.getFullYear();
  }

  const query = `
    query ($season: MediaSeason, $year: Int, $format: MediaFormat, $excludeFormat: MediaFormat, $status: MediaStatus, $minEpisodes: Int, $page: Int) {
      Page(page: $page) {
        pageInfo {
          hasNextPage
          total
        }
        media(season: $season, seasonYear: $year, format: $format, format_not: $excludeFormat, status: $status, episodes_greater: $minEpisodes, isAdult: false, type: ANIME, sort: TITLE_ROMAJI) {
          id
          idMal
          title {
            romaji
            native
            english
          }
          startDate {
            year
            month
            day
          }
          status
          season
          format
          description
          bannerImage
          coverImage {
            extraLarge
            color
          }
          airingSchedule(notYetAired: true, perPage: 1) {
            nodes {
              episode
              airingAt
            }
          }
        }
      }
    }
  `;

  const variables = {
    season: "FALL",
    year: currentYear,
    format: "TV",
  };

  let response = await fetch("https://graphql.anilist.co", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      query,
      variables: variables ? variables : undefined,
    }),
  });

  let json = await response.json();

  let currentSeasonAnime = json.data.Page.media;
  let nextAiringAnime = currentSeasonAnime.filter(
    (anime) => anime.airingSchedule.nodes?.[0]?.episode === 1
  );

  if (nextAiringAnime.length >= 1) {
    nextAiringAnime.sort(
      (a, b) =>
        a.airingSchedule.nodes?.[0].airingAt -
        b.airingSchedule.nodes?.[0].airingAt
    );
    return nextAiringAnime; // return all upcoming anime, not just the first two
  }

  return null;
};

export default getUpcomingAnime;
