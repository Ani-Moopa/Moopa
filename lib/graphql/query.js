const scheduleQuery = `
query ($weekStart: Int, $weekEnd: Int, $page: Int) {
  Page(page: $page) {
    pageInfo {
      hasNextPage
      total
    }
    airingSchedules(airingAt_greater: $weekStart, airingAt_lesser: $weekEnd) {
      id
      episode
      airingAt
      media {
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
        endDate {
          year
          month
          day
        }
        type
        status
        season
        format
        genres
        synonyms
        duration
        popularity
        episodes
        source(version: 2)
        countryOfOrigin
        hashtag
        averageScore
        siteUrl
        description
        bannerImage
        isAdult
        coverImage {
          extraLarge
          color
        }
        trailer {
          id
          site
          thumbnail
        }
        externalLinks {
          site
          url
        }
        rankings {
          rank
          type
          season
          allTime
        }
        studios(isMain: true) {
          nodes {
            id
            name
            siteUrl
          }
        }
        relations {
          edges {
            relationType(version: 2)
            node {
              id
              title {
                romaji
                native
                english
              }
              siteUrl
            }
          }
        }
      }
    }
  }
}
`;

const advanceSearchQuery = `
query ($page: Int = 1, $id: Int, $type: MediaType, $isAdult: Boolean = false, $search: String, $format: [MediaFormat], $status: MediaStatus, $countryOfOrigin: CountryCode, $source: MediaSource, $season: MediaSeason, $seasonYear: Int, $year: String, $onList: Boolean, $yearLesser: FuzzyDateInt, $yearGreater: FuzzyDateInt, $episodeLesser: Int, $episodeGreater: Int, $durationLesser: Int, $durationGreater: Int, $chapterLesser: Int, $chapterGreater: Int, $volumeLesser: Int, $volumeGreater: Int, $licensedBy: [Int], $isLicensed: Boolean, $genres: [String], $excludedGenres: [String], $tags: [String], $excludedTags: [String], $minimumTagRank: Int, $sort: [MediaSort] = [POPULARITY_DESC, SCORE_DESC]) {
  Page(page: $page, perPage: 20) {
    pageInfo {
      total
      perPage
      currentPage
      lastPage
      hasNextPage
    }
    media(id: $id, type: $type, season: $season, format_in: $format, status: $status, countryOfOrigin: $countryOfOrigin, source: $source, search: $search, onList: $onList, seasonYear: $seasonYear, startDate_like: $year, startDate_lesser: $yearLesser, startDate_greater: $yearGreater, episodes_lesser: $episodeLesser, episodes_greater: $episodeGreater, duration_lesser: $durationLesser, duration_greater: $durationGreater, chapters_lesser: $chapterLesser, chapters_greater: $chapterGreater, volumes_lesser: $volumeLesser, volumes_greater: $volumeGreater, licensedById_in: $licensedBy, isLicensed: $isLicensed, genre_in: $genres, genre_not_in: $excludedGenres, tag_in: $tags, tag_not_in: $excludedTags, minimumTagRank: $minimumTagRank, sort: $sort, isAdult: $isAdult) {
      id
      title {
        userPreferred
      }
      coverImage {
        extraLarge
        large
        color
      }
      startDate {
        year
        month
        day
      }
      endDate {
        year
        month
        day
      }
      bannerImage
      season
      seasonYear
      description
      type
      format
      status(version: 2)
      episodes
      duration
      chapters
      volumes
      genres
      isAdult
      averageScore
      popularity
      nextAiringEpisode {
        airingAt
        timeUntilAiring
        episode
      }
      mediaListEntry {
        id
        status
      }
      studios(isMain: true) {
        edges {
          isMain
          node {
            id
            name
          }
        }
      }
    }
  }
}`;

const currentUserQuery = `
query {
    Viewer {
      id
      name
      avatar {
        large
        medium
      }
      bannerImage
      mediaListOptions {
        animeList {
          customLists
        }
      }
    }
  }`;

const mediaInfoQuery = `
  query ($id: Int, $type:MediaType) {
    Media(id: $id, type:$type) {
        mediaListEntry {
          status
          progress
          progressVolumes
          status
        }
        id
        type
        format
        title {
            romaji
            english
            native
        }
        coverImage {
            extraLarge
            large
            color
        }
        startDate {
          year
          month
        }
        bannerImage
        description
        episodes
        nextAiringEpisode {
            episode
            airingAt
            timeUntilAiring
        }
        averageScore
        popularity
        status
        genres
        season
        seasonYear
        duration
        relations {
            edges {
                id
                relationType(version: 2)
                node {
                  id
                  title {
                    userPreferred
                  }
                  format
                  type
                  status(version: 2)
                  bannerImage
                  coverImage {
                    extraLarge
                    color
                  }
                }
            }
        }
        recommendations {
                nodes {
                    mediaRecommendation {
                        id
                        title {
                            romaji
                        }
                        coverImage {
                            extraLarge
                            large
                        }
                    }
            }
        }
        characters {
          edges {
            role
            node {
              id
              image {
                large
                medium
              }
              name {
                full
                userPreferred
              }
            }
          }
        }
    }
}`;

const mediaUserQuery = `
query ($username: String, $status: MediaListStatus) {
    MediaListCollection(userName: $username, type: ANIME, status: $status, sort: UPDATED_TIME_DESC) {
      user {
        id
        name
        about (asHtml: true)
        createdAt
        avatar {
            large
        }
        statistics {
          anime {
              count
              episodesWatched
              meanScore
              minutesWatched
          }
      }
        bannerImage
        mediaListOptions {
          animeList {
              sectionOrder
          }
        }
      }
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
  }`;

export {
  scheduleQuery,
  advanceSearchQuery,
  currentUserQuery,
  mediaInfoQuery,
  mediaUserQuery,
};
