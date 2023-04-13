import { gql } from "@apollo/client";

export default gql`
  query ($page: Int, $userId: Int, $type: MediaType, $status: MediaListStatus) {
    Page(page: $page, perPage: 100) {
      pageInfo {
        hasNextPage
      }
      mediaList(type: $type, userId: $userId) {
        status
        score(format: POINT_100)
        media {
          siteUrl
          id
          coverImage {
            large
            extraLarge
          }
          title {
            userPreferred
          }
        }
      }
    }
  }
`;
