import { useState, useEffect } from "react";

export function useAniList(session, stats) {
  const [media, setMedia] = useState([]);
  // const [aniAdvanceSearch, setAniAdvanceSearch] = useState([]);

  // Queries

  const queryMedia = `
    query ($username: String, $status: MediaListStatus) {
      MediaListCollection(userName: $username, type: ANIME, status: $status) {
        lists {
          status
          name
          entries {
            id
            mediaId
            status
            progress
            score
            media {
              id
              nextAiringEpisode {
                  timeUntilAiring
                  episode
              }
              title {
                english
                romaji
              }
              episodes
              coverImage {
                large
              }
            }
          }
        }
      }
    }
  `;

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

  // Mutations

  const completeQuery = `
      mutation($mediaId: Int ) {
        SaveMediaListEntry(mediaId: $mediaId, status: COMPLETED) {
          id
          mediaId
          status
        }
      }
    `;

  const progressWatched = `
      mutation($mediaId: Int, $progress: Int, $status: MediaListStatus) {
        SaveMediaListEntry(mediaId: $mediaId, progress: $progress, status: $status) {
          id
          mediaId
          progress
          status
        }
      }
  `;

  const username = session?.user?.name;
  const accessToken = session?.user?.token;
  let statuss = stats || null;
  // console.log(session);

  useEffect(() => {
    async function fetchData() {
      if (!username || !accessToken) return;

      const response = await fetch("https://graphql.anilist.co/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: queryMedia,
          variables: {
            username: username,
            status: statuss?.stats,
          },
        }),
      });

      const data = await response.json();
      setMedia(data.data.MediaListCollection.lists);
    }

    fetchData();
  }, [queryMedia, username, accessToken, statuss?.stats]);

  async function markComplete(mediaId) {
    if (!accessToken) return;
    const response = await fetch("https://graphql.anilist.co/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        query: completeQuery,
        variables: {
          mediaId: mediaId,
        },
      }),
    });
    if (response.ok) {
      const data = await response.json();
      console.log({ Complete: data });
    } else if (response.status === 401) {
      console.log("Unauthorized");
    } else if (response.status === 400) {
      console.log("validation error");
    }
  }

  async function markProgress(mediaId, progress, stats) {
    if (!accessToken) return;
    const response = await fetch("https://graphql.anilist.co/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        query: progressWatched,
        variables: {
          mediaId: mediaId,
          progress: progress,
          status: stats,
        },
      }),
    });
    if (response.ok) {
      console.log(`Progress Updated: ${progress}`);
    } else if (response.status === 401) {
      console.log("Unauthorized");
    } else if (response.status === 400) {
      console.log("validation error");
    }
  }

  async function aniAdvanceSearch(options = {}) {
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

  return {
    media,
    markComplete,
    aniAdvanceSearch,
    markProgress,
  };
}
