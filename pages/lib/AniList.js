export async function aniListData({ sort, page = 1 }) {
  const resAnilist = await fetch(`https://graphql.anilist.co`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `
            query (
      $id: Int
      $page: Int
      $perPage: Int
      $search: String
      $sort: [MediaSort]
    ) {
      Page(page: $page, perPage: $perPage) {
        pageInfo {
          total
          currentPage
          lastPage
          hasNextPage
          perPage
        }
        media(id: $id, search: $search, sort: $sort type: ANIME) {
          id
          idMal
          title {
            romaji
            english
          }
          coverImage {
            extraLarge
          }
          description
        }
      }
    }
  `,
      variables: {
        page: page,
        perPage: 15,
        sort,
      },
    }),
  });
  const anilistData = await resAnilist.json();
  const data = anilistData.data.Page.media;
  // console.log(resAnilist);
  return {
    props: {
      data,
    },
  };
}
