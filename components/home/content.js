import Link from "next/link";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { MdChevronRight } from "react-icons/md";
import {
  ChevronRightIcon,
  ArrowRightCircleIcon,
} from "@heroicons/react/24/outline";

import { parseCookies } from "nookies";

import { ChevronLeftIcon } from "@heroicons/react/20/solid";
import { ExclamationCircleIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/router";

export default function Content({ ids, section, data, og, userName }) {
  const router = useRouter();

  const [startX, setStartX] = useState(null);
  const containerRef = useRef(null);
  const [cookie, setCookie] = useState(null);

  const [isDragging, setIsDragging] = useState(false);
  const [clicked, setClicked] = useState(false);

  const [lang, setLang] = useState("en");

  useEffect(() => {
    const click = localStorage.getItem("clicked");

    if (click) {
      setClicked(JSON.parse(click));
    }

    let lang = null;
    if (!cookie) {
      const cookie = parseCookies();
      lang = cookie.lang || null;
      setCookie(cookie);
    }
    if (lang === "en" || lang === null) {
      setLang("en");
    } else if (lang === "id") {
      setLang("id");
    }
  }, []);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - containerRef.current.offsetLeft);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startX) * 3;
    containerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleClick = (e) => {
    if (isDragging) {
      e.preventDefault();
    }
  };

  const [scrollLeft, setScrollLeft] = useState(false);
  const [scrollRight, setScrollRight] = useState(true);

  const slideLeft = () => {
    var slider = document.getElementById(ids);
    slider.scrollLeft = slider.scrollLeft - 500;
  };
  const slideRight = () => {
    var slider = document.getElementById(ids);
    slider.scrollLeft = slider.scrollLeft + 500;
  };

  const handleScroll = (e) => {
    const scrollLeft = e.target.scrollLeft > 31;
    const scrollRight =
      e.target.scrollLeft < e.target.scrollWidth - e.target.clientWidth;
    setScrollLeft(scrollLeft);
    setScrollRight(scrollRight);
  };

  function handleAlert(e) {
    if (localStorage.getItem("clicked")) {
      const existingDataString = localStorage.getItem("clicked");
      const existingData = JSON.parse(existingDataString);

      existingData[e] = true;

      const updatedDataString = JSON.stringify(existingData);

      localStorage.setItem("clicked", updatedDataString);
    } else {
      const newData = {
        [e]: true,
      };

      const newDataString = JSON.stringify(newData);

      localStorage.setItem("clicked", newDataString);
    }
  }

  const array = data;
  let filteredData = array?.filter((item) => item !== null);
  const slicedData =
    filteredData?.length > 15 ? filteredData?.slice(0, 15) : filteredData;

  const goToPage = () => {
    if (section === "Trending Now") {
      router.push(`/${lang}/anime/trending`);
    }
    if (section === "Popular Anime") {
      router.push(`/${lang}/anime/popular`);
    }
    if (section === "Your Plan") {
      router.push(`/${lang}/profile/${userName}/#planning`);
    }
    if (section === "On-Going Anime" || section === "Your Watch List") {
      router.push(`/${lang}/profile/${userName}/#current`);
    }
  };

  return (
    <div>
      <div
        className={`flex items-center justify-between lg:justify-normal lg:gap-3 px-5 ${
          section === "Recommendations" ? "" : "cursor-pointer"
        }`}
        onClick={goToPage}
      >
        <h1 className="font-karla text-[20px] font-bold">{section}</h1>
        <ChevronRightIcon className="w-5 h-5" />
      </div>
      <div className="relative flex items-center lg:gap-2">
        <div
          onClick={slideLeft}
          className={`flex items-center mb-5 cursor-pointer hover:text-action absolute left-0 bg-gradient-to-r from-[#141519] z-40 h-full hover:opacity-100 ${
            scrollLeft ? "lg:visible" : "invisible"
          }`}
        >
          <ChevronLeftIcon className="w-7 h-7 stroke-2" />
        </div>
        <div
          id={ids}
          className="scroll flex h-full w-full select-none overflow-x-scroll overflow-y-hidden scrollbar-hide lg:gap-8 gap-4 lg:p-10 py-8 px-5 z-30 scroll-smooth"
          onScroll={handleScroll}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          onClick={handleClick}
          ref={containerRef}
        >
          {slicedData?.map((anime) => {
            const progress = og?.find((i) => i.mediaId === anime.id);

            return (
              <div
                key={anime.id}
                className="flex flex-col gap-3 shrink-0 cursor-pointer"
              >
                <Link
                  href={`/${lang}/anime/${anime.id}`}
                  className="hover:scale-105 hover:shadow-lg group relative duration-300 ease-out"
                >
                  {ids === "onGoing" && (
                    <div className="h-[190px] lg:h-[265px] w-[135px] lg:w-[185px] bg-gradient-to-b from-transparent to-black absolute z-40 rounded-md whitespace-normal font-karla group">
                      <div className="flex flex-col items-center h-full justify-end text-center pb-5">
                        <h1 className="line-clamp-1 w-[70%] text-[10px]">
                          {anime.title.romaji || anime.title.english}
                        </h1>
                        {checkProgress(progress) &&
                          !clicked?.hasOwnProperty(anime.id) && (
                            <ExclamationCircleIcon className="w-7 h-7 absolute z-40 -top-3 -right-3" />
                          )}
                        {checkProgress(progress) && (
                          <div
                            onClick={() => handleAlert(anime.id)}
                            className="group-hover:visible invisible absolute top-0 bg-black bg-opacity-20 w-full h-full z-20 text-center"
                          >
                            <h1 className="text-[12px] lg:text-sm pt-28 lg:pt-44 font-bold opacity-100">
                              {checkProgress(progress)}
                            </h1>
                          </div>
                        )}
                        {anime.nextAiringEpisode && (
                          <div className="flex gap-1 text-[13px] lg:text-base">
                            <h1>
                              Episode {anime.nextAiringEpisode.episode} in
                            </h1>
                            <h1 className="font-bold">
                              {convertSecondsToTime(
                                anime?.nextAiringEpisode?.timeUntilAiring
                              )}
                            </h1>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  <Image
                    draggable={false}
                    src={
                      anime.image ||
                      anime.coverImage?.extraLarge ||
                      anime.coverImage?.large ||
                      "https://cdn.discordapp.com/attachments/986579286397964290/1058415946945003611/gray_pfp.png"
                    }
                    alt={
                      anime.title.romaji || anime.title.english || "coverImage"
                    }
                    width={500}
                    height={300}
                    placeholder="blur"
                    blurDataURL={
                      anime.image ||
                      anime.coverImage?.extraLarge ||
                      anime.coverImage?.large ||
                      "https://cdn.discordapp.com/attachments/986579286397964290/1058415946945003611/gray_pfp.png"
                    }
                    className="z-20 h-[190px] w-[135px] lg:h-[265px] lg:w-[185px] object-cover rounded-md brightness-90"
                  />
                </Link>
                {ids !== "onGoing" && (
                  <Link
                    href={`/en/anime/${anime.id}`}
                    className="w-[135px] lg:w-[185px] line-clamp-2"
                  >
                    <h1 className="font-karla font-semibold xl:text-base text-[15px]">
                      {anime.status === "RELEASING" ? (
                        <span className="dots bg-green-500" />
                      ) : anime.status === "NOT_YET_RELEASED" ? (
                        <span className="dots bg-red-500" />
                      ) : null}
                      {anime.title.romaji}
                    </h1>
                  </Link>
                )}
              </div>
            );
          })}
          {filteredData.length >= 10 && section !== "Recommendations" && (
            <div
              key={section}
              className="flex cursor-pointer"
              onClick={goToPage}
            >
              <div className="h-[190px] w-[135px] lg:h-[265px] lg:w-[185px] object-cover rounded-md border-secondary border-2 flex flex-col gap-2 items-center text-center justify-center text-[#6a6a6a] hover:text-[#9f9f9f] hover:border-[#757575] transition-colors duration-200">
                <h1 className="whitespace-pre-wrap text-sm">
                  More on {section}
                </h1>
                <ArrowRightCircleIcon className="w-5 h-5" />
              </div>
            </div>
          )}
        </div>
        <MdChevronRight
          onClick={slideRight}
          size={30}
          className={`hidden md:block mb-5 cursor-pointer hover:text-action absolute right-0 bg-gradient-to-l from-[#141519] z-40 h-full hover:opacity-100 hover:bg-gradient-to-l ${
            scrollRight ? "visible" : "hidden"
          }`}
        />
      </div>
    </div>
  );
}

function convertSecondsToTime(sec) {
  let days = Math.floor(sec / (3600 * 24));
  let hours = Math.floor((sec % (3600 * 24)) / 3600);
  let minutes = Math.floor((sec % 3600) / 60);

  let time = "";

  if (days > 0) {
    time += `${days}d `;
    time += `${hours}h`;
  } else {
    time += `${hours}h `;
    time += `${minutes}m`;
  }

  return time.trim();
}

function checkProgress(entry) {
  const { progress, media } = entry;
  const { episodes, nextAiringEpisode } = media;

  if (nextAiringEpisode !== null) {
    const { episode } = nextAiringEpisode;

    if (episode - progress > 1) {
      const missedEpisodes = episode - progress - 1;
      return `${missedEpisodes} episode${missedEpisodes > 1 ? "s" : ""} behind`;
    }
  }

  return;
}
