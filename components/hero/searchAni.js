import React from "react";
import { useQuery, gql } from "@apollo/client";
import Link from "next/link";

const SearchAni = ({ searchQuery }) => {
  const ANIME_QUERY = gql`
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
        media(id: $id, search: $search, sort: $sort, type: ANIME) {
          id
          idMal
          title {
            romaji
            english
          }
          coverImage {
            large
          }
        }
      }
    }
  `;

  // use useQuery hook to execute query and get data
  const { loading, error, data } = useQuery(ANIME_QUERY, {
    variables: {
      search: searchQuery,
      page: 1,
      perPage: 5,
      sort: "TRENDING_DESC",
    },
  });

  // render component
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  const { media } = data.Page;

  // const cleanDescription = description.replace(/<br>/g, '').replace(/\n/g, '  ');

  return (
    <main className="flex flex-col">
      <div className="my-10 mx-[1rem] flex flex-col gap-10 md:mx-auto md:w-full">
        {media.map((anime) => {})}
      </div>
    </main>
  );
};

export default SearchAni;
