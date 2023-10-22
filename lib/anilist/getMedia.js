import { useEffect, useState } from "react";

export default function GetMedia(session, stats) {
  const [anime, setAnime] = useState([]);
  const [manga, setManga] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const accessToken = session?.user?.token || null;
  const username = session?.user?.name;
  const status = stats || null;

  const fetchGraphQL = async (query, variables) => {
    const response = await fetch("https://graphql.anilist.co/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      },
      body: JSON.stringify({ query, variables }),
    });
    return response.json();
  };

  useEffect(() => {
    if (!username || !accessToken) return;
    const queryMedia = `
      query ($username: String, $status: MediaListStatus, $sort: [RecommendationSort]) {
  Page(page: 1, perPage: 10) {
    recommendations(sort: $sort, onList: true) {
      mediaRecommendation {
        id
        title {
          userPreferred
        }
        description
        format
        type
        status(version: 2)
        bannerImage
        isAdult
        coverImage {
          extraLarge
        }
      }
    }
  }
  anime: MediaListCollection(userName: $username, type: ANIME, status: $status, sort: UPDATED_TIME_DESC) {
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
          status
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
  manga: MediaListCollection(userName: $username, type: MANGA, status: $status, sort: UPDATED_TIME_DESC) {
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
          status
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
    fetchGraphQL(queryMedia, {
      username,
      status: status?.stats,
      sort: "ID_DESC",
    }).then((data) => {
      setAnime(data.data.anime?.lists);
      setManga(data.data.manga?.lists);
      setRecommendations(
        data.data.Page.recommendations.map((i) => i.mediaRecommendation)
      );
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username, accessToken, status?.stats]);

  return { anime, manga, recommendations };
}
