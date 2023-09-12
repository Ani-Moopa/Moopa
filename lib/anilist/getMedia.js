import { useEffect, useState } from "react";

export default function GetMedia(session, stats) {
  const [media, setMedia] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const accessToken = session?.user?.token;
  const username = session?.user?.name;
  const status = stats || null;

  const fetchGraphQL = async (query, variables) => {
    const response = await fetch("https://graphql.anilist.co/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: accessToken ? `Bearer ${accessToken}` : undefined,
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
  MediaListCollection(userName: $username, type: ANIME, status: $status, sort: UPDATED_TIME_DESC) {
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
      setMedia(data.data.MediaListCollection.lists);
      setRecommendations(
        data.data.Page.recommendations.map((i) => i.mediaRecommendation)
      );
    });
  }, [username, accessToken, status?.stats]);

  return { media, recommendations };
}
