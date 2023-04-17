import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion as m } from "framer-motion";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { useRouter } from "next/router";
import "react-loading-skeleton/dist/skeleton.css";
import Link from "next/link";
import Navbar from "../../components/navbar";
import Head from "next/head";
import Footer from "../../components/footer";

import { useAniList } from "../../lib/useAnilist";

const genre = [
  "Action",
  "Adventure",
  "Cars",
  "Comedy",
  "Drama",
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
  "POPULARITY_DESC",
  "POPULARITY",
  "TRENDING_DESC",
  "TRENDING",
  "UPDATED_AT_DESC",
  "UPDATED_AT",
  "START_DATE_DESC",
  "START_DATE",
  "END_DATE_DESC",
  "END_DATE",
  "FAVOURITES_DESC",
  "FAVOURITES",
  "SCORE_DESC",
  "SCORE",
  "TITLE_ROMAJI_DESC",
  "TITLE_ROMAJI",
  "TITLE_ENGLISH_DESC",
  "TITLE_ENGLISH",
  "TITLE_NATIVE_DESC",
  "TITLE_NATIVE",
  "EPISODES_DESC",
  "EPISODES",
  "ID",
  "ID_DESC",
];

export default function Card() {
  const router = useRouter();

  const { aniAdvanceSearch } = useAniList();

  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);

  let hasil = null;
  let tipe = "ANIME";

  const query = router.query;
  if (query.param !== "anime" && query.param !== "manga") {
    hasil = query.param;
  } else if (query.param === "anime") {
    hasil = null;
    tipe = "ANIME";
  } else if (query.param === "manga") {
    hasil = null;
    tipe = "MANGA";
  }
  // console.log(hasil);

  const [search, setQuery] = useState(hasil);
  const [type, setSelectedType] = useState(tipe);
  const [seasonYear, setSeasonYear] = useState();
  const [season, setSeason] = useState();
  const [genres, setSelectedGenre] = useState();
  const [perPage, setPerPage] = useState(25);
  const [sort, setSelectedSort] = useState(["POPULARITY_DESC"]);

  const [isVisible, setIsVisible] = useState(false);

  const inputRef = useRef(null);

  async function advance() {
    setLoading(true);
    const data = await aniAdvanceSearch(
      search,
      type,
      seasonYear,
      season,
      genres,
      perPage,
      sort
    );
    setData(data);
    setLoading(false);
  }

  useEffect(() => {
    advance();
  }, [search, type, seasonYear, season, genres, perPage, sort]);

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
    setSelectedGenre(null);
    setSelectedSort(["POPULARITY_DESC"]);
  }

  function handleVisible() {
    setIsVisible(!isVisible);
  }

  function handleTipe(e) {
    setSelectedType(e.target.value);
    router.push(`/search/${e.target.value.toLowerCase()}`);
  }

  // console.log(genres);

  return (
    <>
      <Head>
        <title>Moopa - search</title>
        <link rel="icon" href="/c.svg" />
      </Head>
      <div className="bg-primary">
        <Navbar />
        <div className="min-h-screen mt-10 mb-14 text-white items-center gap-5 lg:gap-0 flex flex-col">
          <div className="w-screen px-10 lg:w-[80%] lg:h-[10rem] flex text-center lg:items-end lg:pb-16 justify-center lg:gap-10 gap-3 font-karla font-light">
            <div className="text-start">
              <h1 className="font-bold lg:pb-5 pb-3 hidden lg:block text-md pl-1 font-outfit">
                TITLE
              </h1>
              <input
                className="lg:w-[297px] lg:h-[46px] h-[35px] w-[230px] xs:w-[280px] bg-secondary rounded-[10px] font-karla font-light text-[#ffffff89] text-center"
                placeholder="search here..."
                type="text"
                onKeyDown={handleKeyDown}
                ref={inputRef}
              />
            </div>

            {/* TYPE */}
            <div className="hidden lg:block text-start">
              <h1 className="font-bold pb-5 text-md pl-1 font-outfit">TYPE</h1>
              <select
                className="w-[297px] h-[46px] bg-secondary rounded-[10px]  justify-between pl-[7.5rem] pr-5 flex items-center"
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
              <h1 className="font-bold pb-5 text-md pl-1 font-outfit">SORT</h1>
              <select
                className="w-[297px] h-[46px] bg-secondary rounded-[10px] flex items-center text-center"
                onChange={(e) => setSelectedSort(e.target.value)}
              >
                <option value={["POPULARITY_DESC"]}>Sort By</option>
                {sorts.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            {/* OPTIONS */}
            <div className="flex lg:gap-7 text-center gap-3 items-end">
              <div
                className="lg:w-[73px] w-[50px] lg:h-[46px] h-[35px] bg-secondary rounded-[10px]  justify-center flex items-center cursor-pointer hover:bg-[#272b35] transition-all duration-300 group"
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
                className="lg:w-[73px] w-[50px] lg:h-[46px] h-[35px] bg-secondary rounded-[10px]  justify-center flex items-center cursor-pointer hover:bg-[#272b35] transition-all duration-300 group"
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
          <div className="w-screen lg:w-[64%] flex lg:justify-end lg:pl-0">
            <AnimatePresence>
              {isVisible && (
                <m.div
                  key="imagine"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="lg:pb-16"
                >
                  <div className="text-start items-center lg:items-start flex w-screen lg:w-auto px-8 lg:px-0 flex-row justify-between lg:flex-col pb-5 ">
                    <h1 className="font-bold lg:pb-5 text-md pl-1 font-outfit">
                      GENRE
                    </h1>
                    <select
                      className="w-[195px] lg:w-[297px] lg:h-[46px] h-[35px] bg-secondary rounded-[10px] flex items-center text-center cursor-pointer hover:bg-[#272b35] transition-all duration-300"
                      onChange={(e) => setSelectedGenre(e.target.value)}
                    >
                      <option value={["Action"]}>Select a Genre</option>
                      {genre.map((option) => {
                        // console.log(option);
                        return (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                  <div className="lg:hidden text-start items-center lg:items-start flex w-screen lg:w-auto px-8 lg:px-0 flex-row justify-between lg:flex-col pb-5 ">
                    <h1 className="font-bold lg:pb-5 text-md pl-1 font-outfit">
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

                  <div className="lg:hidden text-start items-center lg:items-start flex w-screen lg:w-auto px-8 lg:px-0 flex-row justify-between lg:flex-col ">
                    <h1 className="font-bold lg:pb-5 text-md pl-1 font-outfit">
                      SORT
                    </h1>
                    <select
                      className="w-[195px] h-[35px] bg-secondary rounded-[10px] flex items-center text-center cursor-pointer hover:bg-[#272b35] transition-all duration-300"
                      onChange={(e) => setSelectedSort(e.target.value)}
                    >
                      <option value={["POPULARITY_DESC"]}>Sort By</option>
                      {sorts.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                </m.div>
              )}
            </AnimatePresence>
          </div>
          <AnimatePresence>
            <div
              key="card-keys"
              className="grid pt-3 lg:grid-cols-5 justify-items-center grid-cols-3 w-screen px-2 lg:w-auto lg:gap-10 gap-2 lg:gap-y-24 gap-y-12 overflow-hidden"
            >
              {loading ? (
                <>
                  <SkeletonTheme baseColor="#3B3C41" highlightColor="#4D4E52">
                    {[1, 2, 4, 5, 6, 7, 8].map((item) => (
                      <div
                        key={item}
                        className="flex flex-col w-[115px] xs:w-[140px] lg:w-[228px] gap-5"
                        style={{ scale: 0.98 }}
                      >
                        <Skeleton className="lg:h-[313px] xs:h-[215px] h-[175px]" />
                        <Skeleton width={110} height={30} />
                      </div>
                    ))}
                  </SkeletonTheme>
                </>
              ) : data && data.media.length === 0 ? (
                <div className="w-screen text-[#ff7f57] lg:col-start-3 col-start-2 items-center flex justify-center text-center font-bold font-karla lg:text-2xl">
                  Oops!<br></br> Nothing's Found...
                </div>
              ) : (
                data.media.map((anime) => {
                  return (
                    <m.div
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1, transition: { duration: 0.35 } }}
                      className="w-[115px] xs:w-[140px] lg:w-[228px]"
                      key={anime.id}
                    >
                      <Link
                        href={
                          anime.format === "MANGA" || anime.format === "NOVEL"
                            ? `/manga/detail/id?aniId=${anime.id}&aniTitle=${anime.title.userPreferred}`
                            : `/anime/${anime.id}`
                        }
                        className=""
                      >
                        <div
                          className=" bg-[#3B3C41] lg:h-[313px] xs:h-[215px] h-[175px] hover:scale-105 scale-100 transition-all cursor-pointer duration-200 ease-out rounded-[10px]"
                          style={{
                            backgroundImage: `url(${anime.coverImage.extraLarge})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                          }}
                        />
                      </Link>
                      <Link href={`/anime/${anime.id}`}>
                        <h1 className="font-outfit font-bold lg:text-[20px] pt-4 line-clamp-2">
                          {anime.status === "RELEASING" ? (
                            <span className="dots bg-green-500" />
                          ) : anime.status === "NOT_YET_RELEASED" ? (
                            <span className="dots bg-red-500" />
                          ) : null}
                          {anime.title.userPreferred}
                        </h1>
                      </Link>
                      <h2 className="font-outfit lg:text-[15px] text-[11px] font-light pt-2 text-[#8B8B8B]">
                        {anime.format || <p>-</p>} &#183;{" "}
                        {anime.status || <p>-</p>} &#183; {anime.episodes || 0}{" "}
                        Episodes
                      </h2>
                    </m.div>
                  );
                })
              )}
            </div>
          </AnimatePresence>
        </div>
        <Footer />
      </div>
    </>
  );
}
