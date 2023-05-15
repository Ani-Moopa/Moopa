import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion as m } from "framer-motion";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useRouter } from "next/router";
import Link from "next/link";
import Navbar from "../../components/navbar";
import Head from "next/head";
import Footer from "../../components/footer";

import { useAniList } from "../../lib/useAnilist";
import Image from "next/image";

const genre = [
  "Action",
  "Adventure",
  "Comedy",
  "Drama",
  "Ecchi",
  "Fantasy",
  "Horror",
  "Mahou Shoujo",
  "Mecha",
  "Music",
  "Mystery",
  "Psychological",
  "Romance",
  "Sci-Fi",
  "Slice of Life",
  "Sports",
  "Supernatural",
  "Thriller",
];

const types = ["ANIME", "MANGA"];

const sorts = [
  { name: "Title", value: "TITLE_ROMAJI" },
  { name: "Popularity", value: "POPULARITY_DESC" },
  { name: "Trending", value: "TRENDING_DESC" },
  { name: "Favourites", value: "FAVOURITES_DESC" },
  { name: "Average Score", value: "SCORE_DESC" },
  { name: "Date Added", value: "ID_DESC" },
  { name: "Release Date", value: "START_DATE_DESC" },
];

export default function Card() {
  const router = useRouter();

  const { aniAdvanceSearch } = useAniList();

  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);

  let hasil = null;
  let tipe = "ANIME";
  let s = undefined;
  let y = NaN;
  let gr = undefined;

  const query = router.query;
  gr = query.genres;

  if (query.param !== "anime" && query.param !== "manga") {
    hasil = query.param;
  } else if (query.param === "anime") {
    hasil = null;
    tipe = "ANIME";
    if (
      query.season !== "WINTER" &&
      query.season !== "SPRING" &&
      query.season !== "SUMMER" &&
      query.season !== "FALL"
    ) {
      s = undefined;
      y = NaN;
    } else {
      s = query.season;
      y = parseInt(query.seasonYear);
    }
  } else if (query.param === "manga") {
    hasil = null;
    tipe = "MANGA";
    if (
      query.season !== "WINTER" &&
      query.season !== "SPRING" &&
      query.season !== "SUMMER" &&
      query.season !== "FALL"
    ) {
      s = undefined;
      y = NaN;
    } else {
      s = query.season;
      y = parseInt(query.seasonYear);
    }
  }

  // console.log(tags);

  const [search, setQuery] = useState(hasil);
  const [type, setSelectedType] = useState(tipe);
  // const [genres, setSelectedGenre] = useState();
  const [sort, setSelectedSort] = useState();

  const [isVisible, setIsVisible] = useState(false);

  const inputRef = useRef(null);

  const [page, setPage] = useState(1);
  const [nextPage, setNextPage] = useState(true);

  async function advance() {
    setLoading(true);
    const data = await aniAdvanceSearch({
      search: search,
      type: type,
      genres: gr,
      page: page,
      sort: sort,
      season: s,
      seasonYear: y,
    });
    if (data.media.length === 0) {
      setNextPage(false);
    } else if (data !== null && page > 1) {
      setData((prevData) => {
        return [...(prevData ?? []), ...data.media];
      });
      setNextPage(data.pageInfo.hasNextPage);
    } else {
      setData(data.media);
    }
    setNextPage(data.pageInfo.hasNextPage);
    setLoading(false);
  }

  useEffect(() => {
    setData(null);
    setPage(1);
    setNextPage(true);
    advance();
  }, [search, type, sort, s, y, gr]);

  useEffect(() => {
    advance();
  }, [page]);

  useEffect(() => {
    function handleScroll() {
      if (page > 10 || !nextPage) {
        window.removeEventListener("scroll", handleScroll);
        return;
      }

      if (
        window.innerHeight + window.pageYOffset >=
        document.body.offsetHeight - 3
      ) {
        setPage((prevPage) => prevPage + 1);
      }
    }

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [page, nextPage]);

  const handleKeyDown = async (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      const inputValue = event.target.value;
      if (inputValue === "") {
        setQuery(null);
      } else {
        setQuery(inputValue);
      }
    }
  };

  function trash() {
    setQuery(null);
    inputRef.current.value = "";
    // setSelectedGenre(null);
    setSelectedSort(["POPULARITY_DESC"]);
    router.push(`/search/${tipe.toLocaleLowerCase()}`);
  }

  function handleVisible() {
    setIsVisible(!isVisible);
  }

  function handleTipe(e) {
    setSelectedType(e.target.value);
    router.push(`/search/${e.target.value.toLowerCase()}`);
  }

  // );

  return (
    <>
      <Head>
        <title>Moopa - search</title>
        <link rel="icon" href="/c.svg" />
      </Head>
      <div className="bg-primary">
        <Navbar />
        <div className="min-h-screen mt-10 mb-14 text-white items-center gap-5 xl:gap-0 flex flex-col">
          <div className="w-screen px-10 xl:w-[80%] xl:h-[10rem] flex text-center xl:items-end xl:pb-10 justify-center lg:gap-7 xl:gap-10 gap-3 font-karla font-light">
            <div className="text-start">
              <h1 className="font-bold xl:pb-5 pb-3 hidden lg:block text-md pl-1 font-outfit">
                TITLE
              </h1>
              <input
                className="xl:w-[297px] md:w-[297px] lg:w-[230px] xl:h-[46px] h-[35px] xxs:w-[230px] xs:w-[280px] bg-secondary rounded-[10px] font-karla font-light text-[#ffffff89] text-center"
                placeholder="search here..."
                type="text"
                onKeyDown={handleKeyDown}
                ref={inputRef}
              />
            </div>

            {/* TYPE */}
            <div className="hidden lg:block text-start">
              <h1 className="font-bold xl:pb-5 pb-3 text-md pl-1 font-outfit">
                TYPE
              </h1>
              <select
                className="xl:w-[297px] xl:h-[46px] lg:h-[35px] lg:w-[230px] bg-secondary rounded-[10px]  justify-between flex items-center text-center"
                value={type}
                onChange={(e) => handleTipe(e)}
              >
                {types.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            {/* SORT */}
            <div className="hidden lg:block text-start">
              <h1 className="font-bold xl:pb-5 lg:pb-3 text-md pl-1 font-outfit">
                SORT
              </h1>
              <select
                className="xl:w-[297px] xl:h-[46px] lg:h-[35px] lg:w-[230px] bg-secondary rounded-[10px] flex items-center text-center"
                onChange={(e) => {
                  setSelectedSort(e.target.value);
                  setData(null);
                }}
              >
                <option value={["POPULARITY_DESC"]}>Sort By</option>
                {sorts.map((sort) => (
                  <option key={sort.value} value={sort.value}>
                    {sort.name}
                  </option>
                ))}
              </select>
            </div>

            {/* OPTIONS */}
            <div className="flex lg:gap-7 text-center gap-3 items-end">
              <div
                className="xl:w-[73px] w-[50px] xl:h-[46px] h-[35px] bg-secondary rounded-[10px]  justify-center flex items-center cursor-pointer hover:bg-[#272b35] transition-all duration-300 group"
                onClick={handleVisible}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 group-hover:stroke-action"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75"
                  />
                </svg>
              </div>

              {/* TRASH ICON */}
              <div
                className="xl:w-[73px] w-[50px] xl:h-[46px] h-[35px] bg-secondary rounded-[10px]  justify-center flex items-center cursor-pointer hover:bg-[#272b35] transition-all duration-300 group"
                onClick={trash}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 group-hover:stroke-action"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="w-screen xl:w-[64%] flex xl:justify-end xl:pl-0">
            <AnimatePresence>
              {isVisible && (
                <m.div
                  key="imagine"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="xl:pb-16"
                >
                  <div className="text-start items-center xl:items-start flex w-screen xl:w-auto px-8 xl:px-0 flex-row justify-between xl:flex-col pb-5 lg:pb-0 ">
                    <h1 className="font-bold xl:pb-5 text-md pl-1 font-outfit">
                      GENRE
                    </h1>
                    <select
                      className="w-[195px] xl:w-[297px] xl:h-[46px] h-[35px] bg-secondary rounded-[10px] flex items-center text-center cursor-pointer hover:bg-[#272b35] transition-all duration-300"
                      onChange={(e) => {
                        // setSelectedGenre(
                        //   e.target.value === "undefined"
                        //     ? undefined
                        //     : e.target.value
                        // );
                        router.push(
                          `/search/${tipe.toLocaleLowerCase()}/?genres=${
                            e.target.value
                          }`
                        );
                      }}
                    >
                      <option value="undefined">Select a Genre</option>
                      {genre.map((option) => {
                        return (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                  <div className="xl:hidden text-start items-center xl:items-start flex w-screen xl:w-auto px-8 xl:px-0 flex-row justify-between xl:flex-col pb-5 ">
                    <h1 className="font-bold xl:pb-5 text-md pl-1 font-outfit">
                      TYPE
                    </h1>
                    <select
                      className="w-[195px] h-[35px] bg-secondary rounded-[10px] flex items-center text-center cursor-pointer hover:bg-[#272b35] transition-all duration-300"
                      value={type}
                      onChange={(e) => setSelectedType(e.target.value)}
                    >
                      {types.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="xl:hidden text-start items-center xl:items-start flex w-screen xl:w-auto px-8 xl:px-0 flex-row justify-between xl:flex-col ">
                    <h1 className="font-bold xl:pb-5 text-md pl-1 font-outfit">
                      SORT
                    </h1>
                    <select
                      className="w-[195px] h-[35px] bg-secondary rounded-[10px] flex items-center text-center cursor-pointer hover:bg-[#272b35] transition-all duration-300"
                      onChange={(e) => {
                        setSelectedSort(e.target.value);
                      }}
                    >
                      <option value={["POPULARITY_DESC"]}>Sort By</option>
                      {sorts.map((sort) => (
                        <option key={sort.value} value={sort.value}>
                          {sort.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </m.div>
              )}
            </AnimatePresence>
          </div>
          {gr && (
            <div className="lg:w-[70%] px-5 lg:px-4 w-screen lg:mb-6">
              <h1 className="font-bold text-[25px] font-karla">
                Looking for : {gr}
              </h1>
            </div>
          )}
          <div className="flex flex-col gap-14 items-center">
            <AnimatePresence>
              <div
                key="card-keys"
                className="grid pt-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-6 justify-items-center grid-cols-2 xxs:grid-cols-3 w-screen px-2 xl:w-auto xl:gap-10 gap-2 xl:gap-y-24 gap-y-12 overflow-hidden"
              >
                {loading
                  ? ""
                  : !data?.length && (
                      <div className="w-screen text-[#ff7f57] xl:col-start-3 col-start-2 items-center flex justify-center text-center font-bold font-karla xl:text-2xl">
                        Oops!<br></br> Nothing's Found...
                      </div>
                    )}
                {data &&
                  data?.map((anime, index) => {
                    return (
                      <m.div
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1, transition: { duration: 0.35 } }}
                        className="w-[146px] xxs:w-[115px] xs:w-[135px] xl:w-[185px]"
                        key={index}
                      >
                        <Link
                          href={
                            anime.format === "MANGA" || anime.format === "NOVEL"
                              ? `/manga/detail/id?aniId=${anime.id}&aniTitle=${anime.title.userPreferred}`
                              : `/anime/${anime.id}`
                          }
                          className=""
                        >
                          <Image
                            className="object-cover bg-[#3B3C41] w-[146px] h-[208px] xxs:w-[115px] xxs:h-[163px] xs:w-[135px] xs:h-[192px] xl:w-[185px] xl:h-[265px] hover:scale-105 scale-100 transition-all cursor-pointer duration-200 ease-out rounded-[10px]"
                            src={anime.coverImage.extraLarge}
                            alt={anime.title.userPreferred}
                            width={500}
                            height={500}
                          />
                        </Link>
                        <Link href={`/anime/${anime.id}`}>
                          <h1 className="font-outfit font-bold xl:text-base text-[15px] pt-4 line-clamp-2">
                            {anime.status === "RELEASING" ? (
                              <span className="dots bg-green-500" />
                            ) : anime.status === "NOT_YET_RELEASED" ? (
                              <span className="dots bg-red-500" />
                            ) : null}
                            {anime.title.userPreferred}
                          </h1>
                        </Link>
                        <h2 className="font-outfit xl:text-[15px] text-[11px] font-light pt-2 text-[#8B8B8B]">
                          {anime.format || <p>-</p>} &#183;{" "}
                          {anime.status || <p>-</p>} &#183;{" "}
                          {anime.episodes || 0} Episodes
                        </h2>
                      </m.div>
                    );
                  })}

                {loading && (
                  <>
                    <SkeletonTheme baseColor="#232329" highlightColor="#2a2a32">
                      {[1, 2, 4, 5, 6, 7, 8].map((item) => (
                        <div
                          key={item}
                          className="flex flex-col w-[135px] xl:w-[185px] gap-5"
                          style={{ scale: 0.98 }}
                        >
                          <Skeleton className="h-[192px] w-[135px] xl:h-[265px] xl:w-[185px]" />
                          <Skeleton width={110} height={30} />
                        </div>
                      ))}
                    </SkeletonTheme>
                  </>
                )}
              </div>
              {!loading && page > 10 && nextPage && (
                <button
                  onClick={() => setPage((p) => p + 1)}
                  className="bg-secondary xl:w-[30%] w-[80%] h-10 rounded-md"
                >
                  Load More
                </button>
              )}
            </AnimatePresence>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}
