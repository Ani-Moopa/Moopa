import { toast } from "sonner";

export const useAniList = (session) => {
  const accessToken = session?.user?.token;

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

  const quickSearch = async ({ search, type, isAdult = false }) => {
    if (!search || search === " ") return;
    const searchQuery = `
    query ($type: MediaType, $search: String, $isAdult: Boolean) {
  Page(perPage: 8) {
    pageInfo {
      total
      hasNextPage
    }
    results: media(type: $type, isAdult: $isAdult, search: $search) {
      id
      title {
        userPreferred
      }
      coverImage {
        medium
      }
      type
      format
      bannerImage
      isLicensed
      genres
      startDate {
        year
      }
    }
  }
}   
    `;
    const data = await fetchGraphQL(searchQuery, { search, type, isAdult });
    return data;
  };

  const multiSearch = async (search) => {
    if (!search || search === " ") return;
    const searchQuery = `
    query ($search: String, $isAdult: Boolean) {
  anime: Page(perPage: 8) {
    pageInfo {
      total
      hasNextPage
    }
    results: media(type: ANIME, isAdult: $isAdult, search: $search) {
      id
      title {
        userPreferred
      }
      coverImage {
        medium
      }
      type
      format
      bannerImage
      isLicensed
      genres
      startDate {
        year
      }
    }
  }
  manga: Page(perPage: 8) {
    pageInfo {
      total
      hasNextPage
    }
    results: media(type: MANGA, isAdult: $isAdult, search: $search) {
      id
      title {
        userPreferred
      }
      coverImage {
        medium
      }
      type
      format
      bannerImage
      isLicensed
      startDate {
        year
      }
    }
  }
}
`;
    const data = await fetchGraphQL(searchQuery, { search });
    return data;
  };

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
            progress
            status
            customLists
            repeat
          }
          id
          type
          title {
            romaji
            english
            native
          }
          format
          episodes
          nextAiringEpisode {
              episode
          }
        }
      }
    `;
    const data = await fetchGraphQL(getLists, { id });
    return data;
  };

  const markProgress = async (mediaId, progress, stats, volumeProgress) => {
    if (!accessToken) return;
    const progressWatched = `
    mutation($mediaId: Int, $progress: Int, $status: MediaListStatus, $progressVolumes: Int, $lists: [String], $repeat: Int) {
      SaveMediaListEntry(mediaId: $mediaId, progress: $progress, status: $status, progressVolumes: $progressVolumes, customLists: $lists, repeat: $repeat) {
        id
        mediaId
        progress
        status
      }
    }
  `;

    const user = await getUserLists(mediaId);
    const media = user?.data?.Media;

    if (media && media.type !== "MANGA") {
      let customList;

      if (session.user.name) {
        const res = await fetch(
          `/api/user/profile?name=${session.user.name}`
        ).then((res) => res.json());
        customList = res?.setting === null ? true : res?.setting?.CustomLists;
      }

      let lists = media.mediaListEntry?.customLists
        ? Object.entries(media.mediaListEntry?.customLists)
            .filter(([key, value]) => value === true)
            .map(([key, value]) => key) || []
        : [];

      if (customList === true && !lists?.includes("Watched using Moopa")) {
        lists.push("Watched using Moopa");
      }

      const singleEpisode =
        (!media.episodes ||
          (media.format === "MOVIE" && media.episodes === 1)) &&
        1;
      const videoEpisode = Number(progress) || singleEpisode;
      const mediaEpisode =
        media.nextAiringEpisode?.episode || media.episodes || singleEpisode;
      const status =
        media.mediaListEntry?.status === "REPEATING" ? "REPEATING" : "CURRENT";

      let variables = {
        mediaId,
        progress,
        status,
        progressVolumes: volumeProgress,
        lists,
      };

      if (videoEpisode === mediaEpisode) {
        variables.status = "COMPLETED";
        if (media.mediaListEntry?.status === "REPEATING")
          variables.repeat = media.mediaListEntry.repeat + 1;
      }

      // if (lists.length > 0) {
      await fetchGraphQL(progressWatched, variables);
      console.log(`Progress Updated: ${progress}`, status);
      toast.success(`Progress Updated: ${progress}`, {
        position: "bottom-right",
      });
      // }
    } else if (media && media.type === "MANGA") {
      let variables = {
        mediaId,
        progress,
        status: stats,
        progressVolumes: volumeProgress,
      };

      await fetchGraphQL(progressWatched, variables);
      console.log(`Progress Updated: ${progress}`, status);
      toast.success(`Progress Updated: ${progress}`, {
        position: "bottom-right",
      });
    }
  };

  return {
    markComplete,
    markProgress,
    markPlanning,
    getUserLists,
    multiSearch,
    quickSearch,
  };
};
