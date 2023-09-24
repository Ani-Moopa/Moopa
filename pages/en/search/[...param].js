import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion as m } from "framer-motion";
import Skeleton from "react-loading-skeleton";
import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";
import Footer from "@/components/shared/footer";

import Image from "next/image";
import { aniAdvanceSearch } from "@/lib/anilist/aniAdvanceSearch";
import MultiSelector from "@/components/search/dropdown/multiSelector";
import SingleSelector from "@/components/search/dropdown/singleSelector";
import {
  animeFormatOptions,
  formatOptions,
  genreOptions,
  mangaFormatOptions,
  mediaType,
  seasonOptions,
  tagsOption,
  yearOptions,
} from "@/components/search/selection";
import InputSelect from "@/components/search/dropdown/inputSelect";
import { Cog6ToothIcon, TrashIcon } from "@heroicons/react/20/solid";
import useDebounce from "@/lib/hooks/useDebounce";
import { NewNavbar } from "@/components/shared/NavBar";
import MobileNav from "@/components/shared/MobileNav";

export async function getServerSideProps(context) {
  const { param } = context.query;

  const { search, format, genres, season, year } = context.query;

  let getFormat;
  let getSeason;
  let getYear;
  let getGenres = [];

  if (genres) {
    const gr = genreOptions.find(
      (i) => i.value.toLowerCase() === genres.toLowerCase()
    );
    getGenres.push(gr);
  }

  if (season) {
    getSeason = seasonOptions.find(
      (i) => i.value.toLowerCase() === season.toLowerCase()
    );
    if (!year) {
      const now = new Date().getFullYear();
      getYear = yearOptions.find((i) => i.value === now.toString());
    } else {
      getYear = yearOptions.find((i) => i.value === year);
    }
  }

  if (format) {
    getFormat = formatOptions.find(
      (i) => i.value.toLowerCase() === format.toLowerCase()
    );
  }

  if (!param && param.length !== 1) {
    return {
      notFound: true,
    };
  }

  const typeIndex = param[0] === "anime" ? 0 : 1;

  return {
    props: {
      index: typeIndex,
      query: search || null,
      formats: getFormat || null,
      seasons: getSeason || null,
      years: getYear || null,
      genres: getGenres || null,
    },
  };
}

export default function Card({
  index,
  query,
  genres,
  formats,
  seasons,
  years,
}) {
  const inputRef = useRef(null);
  const router = useRouter();
  // const { data: session } = useSession();

  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);

  const [search, setQuery] = useState(query);
  const debounceSearch = useDebounce(search, 500);

  const [type, setSelectedType] = useState(mediaType[index]);
  const [year, setYear] = useState(years);
  const [season, setSeason] = useState(seasons);
  const [sort, setSelectedSort] = useState();
  const [genre, setGenre] = useState(genres);
  const [format, setFormat] = useState(formats);

  const [isVisible, setIsVisible] = useState(false);

  const [page, setPage] = useState(1);
  const [nextPage, setNextPage] = useState(true);

  async function advance() {
    setLoading(true);
    const data = await aniAdvanceSearch({
      search: debounceSearch,
      type: type?.value,
      genres: genre,
      page: page,
      sort: sort?.value,
      format: format?.value,
      season: season?.value,
      seasonYear: year?.value,
    });
    if (data?.media?.length === 0) {
      setNextPage(false);
    } else if (data !== null && page > 1) {
      setData((prevData) => {
        return [...(prevData ?? []), ...data?.media];
      });
      setNextPage(data?.pageInfo.hasNextPage);
    } else {
      setData(data?.media);
    }
    setNextPage(data?.pageInfo.hasNextPage);
    setLoading(false);
  }

  useEffect(() => {
    setData(null);
    setPage(1);
    setNextPage(true);
    advance();
  }, [
    debounceSearch,
    type?.value,
    sort?.value,
    genre,
    format?.value,
    season?.value,
    year?.value,
  ]);

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
    setQuery();
    setGenre();
    setFormat();
    setSelectedSort();
    setSeason();
    setYear();
    router.push(`/en/search/${mediaType[index]?.value?.toLowerCase()}`);
  }

  function handleVisible() {
    setIsVisible(!isVisible);
  }

  return (
    <>
      <Head>
        <title>Moopa - search</title>
        <meta name="title" content="Search" />
        <meta name="description" content="Search your favourites Anime/Manga" />
        <link rel="icon" href="/svg/c.svg" />
      </Head>

      <NewNavbar
        scrollP={10}
        withNav={true}
        shrink={true}
        paddingY="py-1 lg:py-3"
      />
      <MobileNav hideProfile={true} />
      <main className="w-screen min-h-screen z-40 py-14 lg:py-24">
        <div className="max-w-screen-xl flex flex-col gap-3 mx-auto">
          <div className="w-full flex justify-between items-end gap-2 my-3 lg:gap-10 px-5 xl:px-0 relative">
            <div className="hidden lg:flex items-end w-full gap-5 z-50">
              <InputSelect
                inputRef={inputRef}
                data={mediaType}
                label="Search"
                keyDown={handleKeyDown}
                query={search}
                setQuery={setQuery}
                selected={type}
                setSelected={setSelectedType}
              />
              {/* GENRES */}
              <MultiSelector
                data={genreOptions}
                other={tagsOption}
                selected={genre}
                setSelected={setGenre}
                label="Genres"
                inputRef={inputRef}
              />
              {/* SORT */}
              {/* <SingleSelector
                data={sortOptions}
                selected={sort}
                setSelected={setSelectedSort}
                label="Sort"
              /> */}
              {/* FORMAT */}
              <SingleSelector
                data={index === 0 ? animeFormatOptions : mangaFormatOptions}
                selected={format}
                setSelected={setFormat}
                label="Format"
              />
              {/* SEASON */}
              <SingleSelector
                data={seasonOptions}
                selected={season}
                setSelected={setSeason}
                label="Season"
              />
              {/* YEAR */}
              <SingleSelector
                data={yearOptions}
                selected={year}
                setSelected={setYear}
                label="Year"
              />
            </div>
            <div className="w-full lg:hidden">
              <InputSelect
                inputRef={inputRef}
                data={mediaType}
                label="Search"
                keyDown={handleKeyDown}
                query={search}
                setQuery={setQuery}
                selected={type}
                setSelected={setSelectedType}
              />
            </div>

            <div className="flex gap-2">
              <div
                className="lg:hidden py-2 px-2 bg-secondary rounded flex justify-center items-center cursor-pointer hover:bg-opacity-75 transition-all duration-100 group"
                onClick={handleVisible}
              >
                <Cog6ToothIcon className="w-5 h-5" />
              </div>
              <div
                className="py-2 px-2 bg-secondary rounded flex justify-center items-center cursor-pointer hover:bg-opacity-75 transition-all duration-100 group"
                onClick={trash}
              >
                <TrashIcon className="w-5 h-5" />
              </div>
            </div>
          </div>
          {isVisible && (
            <div className="lg:hidden w-full flex justify-center z-40">
              <div className="grid grid-cols-2 grid-rows-2 place-items-center w-full px-5 z-30 gap-4">
                {/* GENRES */}
                <MultiSelector
                  data={genreOptions}
                  other={tagsOption}
                  selected={genre}
                  setSelected={setGenre}
                  label="Genres"
                  inputRef={inputRef}
                />
                {/* SORT */}
                {/* <SingleSelector
                data={sortOptions}
                selected={sort}
                setSelected={setSelectedSort}
                label="Sort"
              /> */}
                {/* FORMAT */}
                <SingleSelector
                  data={index === 0 ? animeFormatOptions : mangaFormatOptions}
                  selected={format}
                  setSelected={setFormat}
                  label="Format"
                />
                {/* SEASON */}
                <SingleSelector
                  data={seasonOptions}
                  selected={season}
                  setSelected={setSeason}
                  label="Season"
                />
                {/* YEAR */}
                <SingleSelector
                  data={yearOptions}
                  selected={year}
                  setSelected={setYear}
                  label="Year"
                />
              </div>
            </div>
          )}
          {/* <div> */}
          <div className="flex flex-col gap-14 items-center z-30">
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
                              ? `/en/manga/${anime.id}`
                              : `/en/anime/${anime.id}`
                          }
                          title={anime.title.userPreferred}
                        >
                          <Image
                            className="object-cover bg-[#3B3C41] w-[146px] h-[208px] xxs:w-[115px] xxs:h-[163px] xs:w-[135px] xs:h-[192px] xl:w-[185px] xl:h-[265px] hover:scale-105 scale-100 transition-all cursor-pointer duration-200 ease-out rounded-[10px]"
                            src={anime.coverImage.extraLarge}
                            alt={anime.title.userPreferred}
                            width={500}
                            height={500}
                          />
                        </Link>
                        <Link
                          href={`/en/anime/${anime.id}`}
                          title={anime.title.userPreferred}
                        >
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
                          {anime.episodes
                            ? `${anime.episodes || "N/A"} Episodes`
                            : `${anime.chapters || "N/A"} Chapters`}
                        </h2>
                      </m.div>
                    );
                  })}

                {loading && (
                  <>
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
          {/* </div> */}
        </div>
      </main>
      <Footer />
    </>
  );
}
