import { useState, useEffect } from "react";
import { toast } from "react-toastify";

function useMedia(username, accessToken, status) {
  const [media, setMedia] = useState([]);

  const fetchGraphQL = async (query, variables) => {
    const response = await fetch("https://graphql.anilist.co/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, variables }),
    });
    return response.json();
  };

  useEffect(() => {
    if (!username || !accessToken) return;
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
    fetchGraphQL(queryMedia, { username, status: status?.stats }).then((data) =>
      setMedia(data.data.MediaListCollection.lists)
    );
  }, [username, accessToken, status?.stats]);

  return media;
}

export function useAniList(session, stats) {
  const accessToken = session?.user?.token;
  const username = session?.user?.name;
  const status = stats || null;
  const media = useMedia(username, accessToken, status);

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

  const markComplete = (mediaId) => {
    if (!accessToken) return;
    const completeQuery = `
      mutation($mediaId: Int ) {
        SaveMediaListEntry(mediaId: $mediaId, status: COMPLETED) {
          id
          mediaId
          status
        }
      }
    `;
    fetchGraphQL(completeQuery, { mediaId }).then((data) =>
      console.log({ Complete: data })
    );
  };

  const markPlanning = (mediaId) => {
    if (!accessToken) return;
    const completeQuery = `
      mutation($mediaId: Int ) {
        SaveMediaListEntry(mediaId: $mediaId, status: PLANNING) {
          id
          mediaId
          status
        }
      }
    `;
    fetchGraphQL(completeQuery, { mediaId }).then((data) =>
      console.log({ added_to_list: data })
    );
  };

  const markProgress = (mediaId, progress, stats, volumeProgress) => {
    if (!accessToken) return;
    const progressWatched = `
      mutation($mediaId: Int, $progress: Int, $status: MediaListStatus, $progressVolumes: Int) {
        SaveMediaListEntry(mediaId: $mediaId, progress: $progress, status: $status, progressVolumes: $progressVolumes) {
          id
          mediaId
          progress
          status
        }
      }
  `;
    fetchGraphQL(progressWatched, {
      mediaId,
      progress,
      status: stats,
      progressVolumes: volumeProgress,
    }).then(() => {
      console.log(`Progress Updated: ${progress}`);
      toast.success(`Progress Updated: ${progress}`, {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        theme: "dark",
      });
    });
  };

  return { media, markComplete, markProgress, markPlanning };
}
