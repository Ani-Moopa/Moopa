import Link from "next/link";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { MdChevronRight } from "react-icons/md";
import {
  ChevronRightIcon,
  ArrowRightCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

import { parseCookies } from "nookies";

import { ChevronLeftIcon } from "@heroicons/react/20/solid";
import { ExclamationCircleIcon, PlayIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

export default function Content({
  ids,
  section,
  data,
  userData,
  og,
  userName,
  setRemoved,
}) {
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
    if (section === "Recently Watched") {
      router.push(`/${lang}/anime/recently-watched`);
    }
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

  const removeItem = async (id) => {
    if (userName) {
      // remove from database
      const res = await fetch(`/api/user/update/episode`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: userName,
          id: id,
        }),
      });
      const data = await res.json();

      // remove from local storage
      const artplayerSettings =
        JSON.parse(localStorage.getItem("artplayer_settings")) || {};
      if (artplayerSettings[id]) {
        delete artplayerSettings[id];
        localStorage.setItem(
          "artplayer_settings",
          JSON.stringify(artplayerSettings)
        );
      }

      // update client
      setRemoved(id);

      if (data?.message === "Episode deleted") {
        toast.success("Episode removed from history", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          draggable: true,
          theme: "dark",
        });
      }
    } else {
      const artplayerSettings =
        JSON.parse(localStorage.getItem("artplayer_settings")) || {};
      if (artplayerSettings[id]) {
        delete artplayerSettings[id];
        localStorage.setItem(
          "artplayer_settings",
          JSON.stringify(artplayerSettings)
        );
      }

      setRemoved(id);
    }
  };

  return (
    <div>
      <div
        className={`flex items-center justify-between lg:justify-normal lg:gap-3 px-5 z-40 ${
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
          {ids !== "recentlyWatched"
            ? slicedData?.map((anime) => {
                const progress = og?.find((i) => i.mediaId === anime.id);

                return (
                  <div
                    key={anime.id}
                    className="flex flex-col gap-3 shrink-0 cursor-pointer"
                  >
                    <Link
                      href={`/${lang}/anime/${anime.id}`}
                      className="hover:scale-105 hover:shadow-lg duration-300 ease-out group relative"
                      title={anime.title.romaji}
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
                          anime.title.romaji ||
                          anime.title.english ||
                          "coverImage"
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
                        title={anime.title.romaji}
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
              })
            : userData
                ?.filter((i) => i.title && i.title !== null)
                ?.slice(0, 10)
                .map((i) => {
                  const time = i.timeWatched;
                  const duration = i.duration;
                  let prog = (time / duration) * 100;
                  if (prog > 90) prog = 100;

                  return (
                    <div
                      key={i.watchId}
                      className="flex flex-col gap-2 shrink-0 cursor-pointer relative group/item"
                    >
                      <div className="absolute z-40 top-1 right-1 group-hover/item:visible invisible hover:text-action">
                        <div
                          className="flex flex-col items-center group/delete"
                          onClick={() => removeItem(i.watchId)}
                        >
                          <XMarkIcon className="w-6 h-6 shrink-0 bg-primary p-1 rounded-full" />
                          <span className="absolute font-karla bg-secondary shadow-black shadow-2xl py-1 px-2 whitespace-nowrap text-white text-sm rounded-md right-7 -bottom-[2px] z-40 duration-300 transition-all ease-out group-hover/delete:visible group-hover/delete:scale-100 group-hover/delete:translate-x-0 group-hover/delete:opacity-100 opacity-0 translate-x-10 scale-50 invisible">
                            Remove from history
                          </span>
                        </div>
                      </div>
                      <Link
                        className="relative w-[320px] aspect-video rounded-md overflow-hidden group"
                        href={`/en/anime/watch/${i.aniId}/${
                          i.provider
                        }?id=${encodeURIComponent(i.watchId)}&num=${i.episode}`}
                      >
                        <div className="w-full h-full bg-gradient-to-t from-black/70 from-20% to-transparent group-hover:to-black/40 transition-all duration-300 ease-out absolute z-30" />
                        <div className="absolute bottom-3 left-0 mx-2 text-white flex gap-2 items-center w-[80%] z-30">
                          <PlayIcon className="w-5 h-5 shrink-0" />
                          <h1
                            className="font-semibold font-karla line-clamp-1"
                            title={i?.title || i.anititle}
                          >
                            {i?.title === i.aniTitle
                              ? `Episode ${i.episode}`
                              : i?.title || i.anititle}
                          </h1>
                        </div>
                        <span
                          className={`absolute bottom-0 left-0 h-[2px] bg-red-600 z-30`}
                          style={{
                            width: `${prog}%`,
                          }}
                        />

                        {i?.image && (
                          <Image
                            src={i?.image}
                            width={200}
                            height={200}
                            alt="Episode Thumbnail"
                            className="w-fit group-hover:scale-[1.02] duration-300 ease-out z-10"
                          />
                        )}
                      </Link>

                      <Link
                        className="flex flex-col font-karla w-full"
                        href={`/en/anime/watch/${i.aniId}/${
                          i.provider
                        }?id=${encodeURIComponent(i.watchId)}&num=${i.episode}`}
                      >
                        {/* <h1 className="font-semibold">{i.title}</h1> */}
                        <p className="flex items-center gap-1 text-sm text-gray-400 w-[320px]">
                          <span
                            className="text-white"
                            style={{
                              display: "inline-block",
                              maxWidth: "220px",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                            title={i.aniTitle}
                          >
                            {i.aniTitle}
                          </span>{" "}
                          | Episode {i.episode}
                        </p>
                      </Link>
                    </div>
                  );
                })}
          {userData?.filter((i) => i.aniId !== null)?.length >= 10 &&
            section !== "Recommendations" && (
              <div
                key={section}
                className="flex cursor-pointer"
                onClick={goToPage}
              >
                <div className="w-[320px] aspect-video overflow-hidden object-cover rounded-md border-secondary border-2 flex flex-col gap-2 items-center text-center justify-center text-[#6a6a6a] hover:text-[#9f9f9f] hover:border-[#757575] transition-colors duration-200">
                  <h1 className="whitespace-pre-wrap text-sm">
                    More on {section}
                  </h1>
                  <ArrowRightCircleIcon className="w-5 h-5" />
                </div>
              </div>
            )}
          {filteredData?.length >= 10 && section !== "Recommendations" && (
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
