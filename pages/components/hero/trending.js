import React from "react";
import { useQuery, gql } from "@apollo/client";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import Link from "next/link";
import Image from "next/image";

const Trending = () => {
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
          description
          bannerImage
          type
          popularity
          averageScore
        }
      }
    }
  `;

  // use useQuery hook to execute query and get data
  const { loading, error, data } = useQuery(ANIME_QUERY, {
    variables: {
      page: 1,
      perPage: 15,
      sort: "TRENDING_DESC",
    },
  });

  // render component
  if (loading) return <p></p>;
  if (error) return <p>Error :(</p>;

  const { media } = data.Page;

  const slideLeft = () => {
    var slider = document.getElementById("slider");
    slider.scrollLeft = slider.scrollLeft - 500;
  };
  const slideRight = () => {
    var slider = document.getElementById("slider");
    slider.scrollLeft = slider.scrollLeft + 500;
  };

  return (
    <div className="relative flex items-center gap-0 lg:gap-2">
      <MdChevronLeft
        onClick={slideLeft}
        size={40}
        className="mb-5 cursor-pointer opacity-50 hover:opacity-100"
      />
      <div
        id="slider"
        className="scroll flex h-full w-full items-center overflow-x-scroll scroll-smooth whitespace-nowrap  overflow-y-hidden scrollbar-hide lg:gap-5 "
      >
        {media.map((anime) => {
          const url = encodeURIComponent(
            anime.title.english || anime.title.romaji
          );

          return (
            <div
              key={anime.id}
              className="flex shrink-0 cursor-pointer lg:items-center "
            >
              <Link href={`/anime/${anime.id}`}>
                <Image
                  src={anime.coverImage.large}
                  alt={anime.title.romaji || anime.title.english}
                  width={209}
                  height={300}
                  skeleton={
                    <div
                      style={{
                        backgroundColor: "lightgray",
                        width: 209,
                        height: 300,
                      }}
                    />
                  }
                  className="z-20 h-[230px] w-[168px] object-cover p-2 duration-300 ease-in-out hover:scale-105 lg:h-[290px]  lg:w-[209px]"
                />
              </Link>
            </div>
          );
        })}
      </div>
      <MdChevronRight
        onClick={slideRight}
        size={40}
        className="mb-5 cursor-pointer opacity-50 hover:opacity-100"
      />
    </div>
  );
};

export default Trending;
