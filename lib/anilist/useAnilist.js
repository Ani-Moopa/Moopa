import { useState, useEffect } from "react";
import { toast } from "react-toastify";

export const useAniList = (session, stats) => {
  const [media, setMedia] = useState([]);
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

  const markComplete = async (mediaId) => {
    if (!accessToken) return;
    const completeQuery = `
      mutation($mediaId: Int) {
        SaveMediaListEntry(mediaId: $mediaId, status: COMPLETED) {
          id
          mediaId
          status
        }
      }
    `;
    const data = await fetchGraphQL(completeQuery, { mediaId });
    console.log({ Complete: data });
  };

  const markPlanning = async (mediaId) => {
    if (!accessToken) return;
    const planningQuery = `
      mutation($mediaId: Int ) {
        SaveMediaListEntry(mediaId: $mediaId, status: PLANNING) {
          id
          mediaId
          status
        }
      }
    `;
    const data = await fetchGraphQL(planningQuery, { mediaId });
    console.log({ added_to_list: data });
  };

  const getUserLists = async (id) => {
    const getLists = `
      query ($id: Int) {
        Media(id: $id) {
          mediaListEntry {
            customLists
          }
          id
          type
          title {
            romaji
            english
            native
          }
        }
      }
    `;
    const data = await fetchGraphQL(getLists, { id });
    return data;
  };

  const customLists = async (lists) => {
    const setList = `
      mutation($lists: [String]){
        UpdateUser(animeListOptions: { customLists: $lists }){
          id
        }
      }
    `;
    const data = await fetchGraphQL(setList, { lists });
    return data;
  };

  const markProgress = async (mediaId, progress, stats, volumeProgress) => {
    if (!accessToken) return;
    const progressWatched = `
    mutation($mediaId: Int, $progress: Int, $status: MediaListStatus, $progressVolumes: Int, $lists: [String]) {
      SaveMediaListEntry(mediaId: $mediaId, progress: $progress, status: $status, progressVolumes: $progressVolumes, customLists: $lists) {
        id
        mediaId
        progress
        status
      }
    }
  `;

    const user = await getUserLists(mediaId);
    const media = user?.data?.Media;
    if (media) {
      let checkList = media?.mediaListEntry?.customLists
        ? Object.entries(media?.mediaListEntry?.customLists).map(
            ([key, value]) => key
          ) || []
        : [];

      if (!checkList?.includes("Watched using Madara")) {
        checkList.push("Watched using Madara");
        await customLists(checkList);
      }

      let lists = media?.mediaListEntry?.customLists
        ? Object.entries(media?.mediaListEntry?.customLists)
            .filter(([key, value]) => value === true)
            .map(([key, value]) => key) || []
        : [];
      if (!lists?.includes("Watched using Madara")) {
        lists.push("Watched using Madara");
      }
      if (lists.length > 0) {
        await fetchGraphQL(progressWatched, {
          mediaId,
          progress,
          status: stats,
          progressVolumes: volumeProgress,
          lists,
        });
        console.log(`Progress Updated: ${progress}`);
        toast.success(`Progress Updated: ${progress}`, {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          draggable: true,
          theme: "dark",
        });
      }
    }
  };

  return { media, markComplete, markProgress, markPlanning, getUserLists };
};
