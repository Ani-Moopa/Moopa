export const GET_MEDIA_USER = `
query ($username: String, $status: MediaListStatus) {
    MediaListCollection(userName: $username, type: ANIME, status: $status, sort: SCORE_DESC) {
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
  }
`;
