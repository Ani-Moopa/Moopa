import { gql } from "@apollo/client";

export default gql`
  query {
    Viewer {
      id
      name
      avatar {
        large
        medium
      }
      bannerImage
    }
  }
`;
