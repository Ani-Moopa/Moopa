import { useState, useEffect } from "react";

export function useAniList(session) {
  const [media, setMedia] = useState([]);
  // const [aniAdvanceSearch, setAniAdvanceSearch] = useState([]);

  const queryMedia = `
    query ($username: String) {
      MediaListCollection(userName: $username, type: ANIME) {
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
      query ($search: String, $type: MediaType, $status: MediaStatus, $season: MediaSeason, $year: Int, $genres: [String], $tags: [String], $sort: [MediaSort], $page: Int, $perPage: Int) {
        Page (page: $page, perPage: $perPage) {
          pageInfo {
            total
            currentPage
            lastPage
            hasNextPage
          }
          media (search: $search, type: $type, status: $status, season: $season, seasonYear: $year, genre_in: $genres, tag_in: $tags, sort: $sort) {
            id
            title {
                userPreferred
            }
            type
            episodes
            status
            format
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

  const username = session?.user?.name;
  const accessToken = session?.user?.token;

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
          },
        }),
      });

      const data = await response.json();
      setMedia(data.data.MediaListCollection.lists);
    }

    fetchData();
  }, [queryMedia, username, accessToken]);

  // useEffect(() => {
  //   async function fetchData() {}
  // });

  async function aniAdvanceSearch(
    search,
    type,
    seasonYear,
    season,
    genres,
    perPage,
    sort
  ) {
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
          page: 1,
        },
      }),
    });

    const datas = await response.json();
    console.log(search);
    const data = datas.data.Page;
    return data;
  }

  return {
    media,
    // updateMediaEntry,
    aniAdvanceSearch,
  };
}
