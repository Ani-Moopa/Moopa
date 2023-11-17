import Link from "next/link";
import React, { useState, useRef, useEffect, Fragment } from "react";
import { useDraggable } from "react-use-draggable-scroll";
import Image from "next/image";
import { MdChevronRight } from "react-icons/md";
import {
  ChevronRightIcon,
  ArrowRightCircleIcon,
} from "@heroicons/react/24/outline";

import { ChevronLeftIcon } from "@heroicons/react/20/solid";
import { ExclamationCircleIcon, PlayIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/router";
import HistoryOptions from "./content/historyOptions";
import { toast } from "sonner";
import { truncateImgUrl } from "@/utils/imageUtils";

export default function Content({
  ids,
  section,
  data,
  userData,
  og,
  userName,
  setRemoved,
  type = "anime",
}) {
  const router = useRouter();

  const ref = useRef();
  const { events } = useDraggable(ref);

  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    const click = localStorage.getItem("clicked");

    if (click) {
      setClicked(JSON.parse(click));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [scrollLeft, setScrollLeft] = useState(false);
  const [scrollRight, setScrollRight] = useState(true);

  const slideLeft = () => {
    ref.current.classList.add("scroll-smooth");
    var slider = document.getElementById(ids);
    slider.scrollLeft = slider.scrollLeft - 500;
    ref.current.classList.remove("scroll-smooth");
  };
  const slideRight = () => {
    ref.current.classList.add("scroll-smooth");
    var slider = document.getElementById(ids);
    slider.scrollLeft = slider.scrollLeft + 500;
    ref.current.classList.remove("scroll-smooth");
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
      router.push(`/en/anime/recently-watched`);
    }
    if (section === "New Episodes") {
      router.push(`/en/anime/recent`);
    }
    if (section === "Trending Now") {
      router.push(`/en/anime/trending`);
    }
    if (section === "Popular Anime") {
      router.push(`/en/anime/popular`);
    }
    if (section === "Your Plan") {
      router.push(`/en/profile/${userName}/#planning`);
    }
    if (section === "On-Going Anime" || section === "Your Watch List") {
      router.push(`/en/profile/${userName}/#current`);
    }
  };

  const removeItem = async (id, aniId) => {
    if (userName) {
      // remove from database
      const res = await fetch(`/api/user/update/episode`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: userName,
          id,
          aniId,
        }),
      });
      const data = await res.json();

      if (id) {
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
      }
      if (aniId) {
        const currentData =
          JSON.parse(localStorage.getItem("artplayer_settings")) || {};

        const updatedData = {};

        for (const key in currentData) {
          const item = currentData[key];
          if (item.aniId !== aniId) {
            updatedData[key] = item;
          }
        }

        localStorage.setItem("artplayer_settings", JSON.stringify(updatedData));
      }

      // update client
      setRemoved(id || aniId);

      if (data?.message === "Episode deleted") {
        toast.success("Episode removed from history");
      }
    } else {
      if (id) {
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
        setRemoved(id);
      }
      if (aniId) {
        const currentData =
          JSON.parse(localStorage.getItem("artplayer_settings")) || {};

        // Create a new object to store the updated data
        const updatedData = {};

        // Iterate through the current data and copy items with different aniId to the updated object
        for (const key in currentData) {
          const item = currentData[key];
          if (item.aniId !== aniId) {
            updatedData[key] = item;
          }
        }

        // Update localStorage with the filtered data
        localStorage.setItem("artplayer_settings", JSON.stringify(updatedData));
        setRemoved(aniId);
      }
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
          className="flex h-full w-full select-none overflow-x-scroll overflow-y-hidden scrollbar-hide lg:gap-8 gap-4 lg:p-10 py-8 px-5 z-30"
          onScroll={handleScroll}
          {...events}
          ref={ref}
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
                      href={
                        ids === "listManga"
                          ? `/en/manga/${anime.id}`
                          : `/en/${type}/${anime.id}`
                      }
                      className="hover:scale-105 hover:shadow-lg duration-300 ease-out group relative"
                      title={anime.title.romaji}
                    >
                      {ids === "onGoing" && (
                        <div className="h-[190px] lg:h-[265px] w-[135px] lg:w-[185px] bg-gradient-to-b from-transparent to-black/90 absolute z-40 rounded-md whitespace-normal font-karla group">
                          <div className="flex flex-col items-center h-full justify-end text-center pb-5">
                            <h1 className="line-clamp-1 w-[70%] text-[10px]">
                              {anime.title.romaji || anime.title.english}
                            </h1>
                            {checkProgress(progress) &&
                              !clicked?.hasOwnProperty(anime.id) && (
                                <ExclamationCircleIcon className="w-7 h-7 absolute z-40 text-white -top-3 -right-3" />
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
                      <div className="h-[190px] w-[135px] lg:h-[265px] lg:w-[185px] rounded-md z-30">
                        {ids === "recentAdded" && (
                          <div className="absolute bg-gradient-to-b from-black/30 to-transparent from-5% to-30% top-0 z-30 w-full h-full rounded" />
                        )}
                        <Image
                          draggable={false}
                          src={
                            anime.image ||
                            anime.coverImage?.extraLarge ||
                            anime.coverImage?.large ||
                            truncateImgUrl(anime?.coverImage) ||
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
                      </div>
                      {ids === "recentAdded" && (
                        <Fragment>
                          <Image
                            src="/svg/episode-badge.svg"
                            alt="episode-badge"
                            width={200}
                            height={100}
                            className="w-24 lg:w-32 absolute top-1 -right-[12px] lg:-right-[17px] z-40"
                          />
                          <p className="absolute z-40 text-center w-[86px] lg:w-[110px] top-1 -right-2 lg:top-[5.5px] lg:-right-2 font-karla text-sm lg:text-base">
                            Episode{" "}
                            <span className="text-white">
                              {anime?.currentEpisode || anime?.episodeNumber}
                            </span>
                          </p>
                        </Fragment>
                      )}
                    </Link>
                    {ids !== "onGoing" && (
                      <Link
                        href={
                          ids === "listManga"
                            ? `/en/manga/${anime.id}`
                            : `/en/${type.toLowerCase()}/${anime.id}`
                        }
                        className="w-[135px] lg:w-[185px] line-clamp-2"
                        title={anime.title.romaji}
                      >
                        <h1 className="font-karla font-semibold xl:text-base text-[15px]">
                          {anime.status === "RELEASING" ||
                          ids === "recentAdded" ? (
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
                      <div className="absolute flex flex-col gap-1 z-40 top-1 right-1 transition-all duration-200 ease-out opacity-0 group-hover/item:opacity-100 scale-90 group-hover/item:scale-100 group-hover/item:visible invisible ">
                        <HistoryOptions
                          remove={removeItem}
                          watchId={i.watchId}
                          aniId={i.aniId}
                        />
                        {i?.nextId && (
                          <button
                            type="button"
                            className="flex flex-col items-center group/next relative"
                            onClick={() => {
                              router.push(
                                `/en/anime/watch/${i.aniId}/${
                                  i.provider
                                }?id=${encodeURIComponent(i?.nextId)}&num=${
                                  i?.nextNumber
                                }${i?.dub ? `&dub=${i?.dub}` : ""}`
                              );
                            }}
                          >
                            <ChevronRightIcon className="w-6 h-6 shrink-0 bg-primary p-1 rounded-full hover:text-action scale-100 hover:scale-105 transition-all duration-200 ease-out" />
                            <span className="absolute font-karla bg-secondary shadow-black shadow-2xl py-1 px-2 whitespace-nowrap text-white text-sm rounded-md right-7 -bottom-[2px] z-40 duration-300 transition-all ease-out group-hover/next:visible group-hover/next:scale-100 group-hover/next:translate-x-0 group-hover/next:opacity-100 opacity-0 translate-x-10 scale-50 invisible">
                              Play Next Episode
                            </span>
                          </button>
                        )}
                      </div>
                      <Link
                        className="relative w-[320px] aspect-video rounded-md overflow-hidden group"
                        href={`/en/anime/watch/${i.aniId}/${
                          i.provider
                        }?id=${encodeURIComponent(i.watchId)}&num=${i.episode}${
                          i?.dub ? `&dub=${i?.dub}` : ""
                        }`}
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
                            width={320}
                            height={180}
                            alt="Episode Thumbnail"
                            className="w-full object-cover group-hover:scale-[1.02] duration-300 ease-out z-10"
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
                className="flex flex-col cursor-pointer"
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
