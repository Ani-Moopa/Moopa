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
    query ($season: MediaSeason, $seasonYear: Int) {
      Page(page: 1, perPage: 20) {
        media(season: $season, seasonYear: $seasonYear, sort: POPULARITY_DESC, type: ANIME) {
          id
          coverImage{
            large
          }
          bannerImage
          title {
            english
            romaji
            native
          }
          nextAiringEpisode {
            episode
            airingAt
            timeUntilAiring
          }
        }
      }
    }
  `;

  const variables = {
    season: currentSeason,
    seasonYear: currentYear,
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
    (anime) =>
      anime.nextAiringEpisode !== null && anime.nextAiringEpisode.episode === 1
  );

  if (nextAiringAnime.length >= 1) {
    nextAiringAnime.sort(
      (a, b) => a.nextAiringEpisode.airingAt - b.nextAiringEpisode.airingAt
    );
    return nextAiringAnime; // return all upcoming anime, not just the first two
  }

  return null;
};

export default getUpcomingAnime;
