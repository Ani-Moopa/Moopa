// @ts-nocheck

import Image from "next/image";
import { cubicBezier, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { CalendarIcon } from "@heroicons/react/24/solid";
import { ClockIcon } from "@heroicons/react/24/outline";
import Loading from "@/components/shared/loading";
import { timeStamptoAMPM, timeStamptoHour } from "@/utils/getTimes";
import {
  filterFormattedSchedule,
  filterScheduleByDay,
  sortScheduleByDay,
  transformSchedule
} from "@/utils/schedulesUtils";

import { scheduleQuery } from "@/lib/graphql/query";
import MobileNav from "@/components/shared/MobileNav";

import { redis } from "@/lib/redis";
import Head from "next/head";
import { Navbar } from "@/components/shared/NavBar";

const day = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];

const isAired = (timestamp: number | null) => {
  if (!timestamp) return false;
  const currentTime = new Date().getTime() / 1000;
  return timestamp <= currentTime;
};

export async function getServerSideProps() {
  const now = new Date();
  // Adjust for Japan timezone (add 9 hours)
  const nowJapan = new Date(now.getTime() + 9 * 60 * 60 * 1000);

  // Calculate the time until midnight of the next day in Japan timezone
  const midnightTomorrowJapan = new Date(
    nowJapan.getFullYear(),
    nowJapan.getMonth(),
    nowJapan.getDate() + 1,
    0,
    0,
    0,
    0
  );
  const timeUntilMidnightJapan = Math.round(
    (midnightTomorrowJapan.getTime() - nowJapan.getTime()) / 1000
  );

  let cachedData;

  // Check if the data is already in Redis
  if (redis) {
    cachedData = await redis.get("new_schedule");
  }

  if (cachedData) {
    const scheduleByDay = JSON.parse(cachedData);

    return {
      props: {
        schedule: scheduleByDay
        // today: todaySchedule,
      }
    };
  } else {
    now.setHours(0, 0, 0, 0); // Set the time to 00:00:00.000
    const dayInSeconds = 86400; // Number of seconds in a day
    const yesterdayStart = Math.floor(now.getTime() / 1000) - dayInSeconds;
    // Calculate weekStart from yesterday's 00:00:00
    const weekStart = yesterdayStart;
    const weekEnd = weekStart + 604800;

    let page = 1;
    const airingSchedules = [];

    while (true) {
      const res = await fetch("https://graphql.anilist.co", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({
          query: scheduleQuery,
          variables: {
            weekStart,
            weekEnd,
            page
          }
        })
      });

      const json = await res.json();
      const schedules = json.data.Page.airingSchedules;

      if (schedules.length === 0) {
        break; // No more data to fetch
      }

      airingSchedules.push(...schedules);
      page++;
    }

    const timestampToDay = (timestamp: number) => {
      return new Date(timestamp * 1000).toLocaleDateString(undefined, {
        weekday: "long"
      });
    };

    const scheduleByDay: { [key: string]: any } = {};
    airingSchedules.forEach((schedule) => {
      const day = timestampToDay(schedule.airingAt);
      if (!scheduleByDay[day]) {
        scheduleByDay[day] = [];
      }
      scheduleByDay[day].push(schedule);
    });

    if (redis) {
      await redis.set(
        "new_schedule",
        JSON.stringify(scheduleByDay),
        "EX",
        timeUntilMidnightJapan
      );
    }

    return {
      props: {
        schedule: scheduleByDay
        // today: todaySchedule,
      }
    };
  }
  // setSchedule(scheduleByDay);
}

export default function Schedule({ schedule }: any) {
  const [filterDay, setFilterDay] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    async function setDay() {
      const now = new Date();
      const today = day[now.getDay()];
      setFilterDay(today);
      setLoading(false);
    }
    setDay();
  }, []);
  // Sort the schedule object by day, placing today's schedule first
  const sortedSchedule = sortScheduleByDay(schedule);
  const formattedSchedule = transformSchedule(schedule);

  // State to keep track of the next airing anime
  const [nextAiringAnime, setNextAiringAnime] = useState(null);
  // const [nextAiringBanner, setNextAiringBanner] = useState(null);

  // State to keep track of the currently airing anime
  const [currentlyAiringAnime, setCurrentlyAiringAnime] = useState(null);

  const [layout, setLayout] = useState(1);

  // Effect to update the next and currently airing anime
  useEffect(() => {
    const now = new Date().getTime() / 1000; // Current time in seconds
    let nextAiring = null;
    let currentlyAiring = null;

    for (const [, schedules] of Object.entries(sortedSchedule as object)) {
      for (const s of schedules) {
        if (s.airingAt > now) {
          if (!nextAiring) {
            nextAiring = s.id;
            // setNextAiringBanner(s.media.bannerImage);
          }
        } else if (s.airingAt + 1440 > now) {
          currentlyAiring = s.id;
        }
      }
      if (nextAiring && currentlyAiring) break;
    }

    setNextAiringAnime(nextAiring);
    setCurrentlyAiringAnime(currentlyAiring);
  }, [sortedSchedule]);

  const scrollContainerRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    // Scroll to center the active button when it changes
    if (scrollContainerRef.current) {
      const activeButton =
        scrollContainerRef.current?.querySelector(".text-action");
      if (activeButton) {
        const containerWidth = scrollContainerRef.current.clientWidth;
        const buttonLeft = (activeButton as HTMLElement).offsetLeft;
        const buttonWidth = activeButton.clientWidth;
        const scrollLeft = buttonLeft - containerWidth / 2 + buttonWidth / 2;
        scrollContainerRef.current.scrollLeft = scrollLeft;
      }
    }
  }, [filterDay]);

  return (
    <>
      <Head>
        <title>Moopa - Schedule</title>
        {/* write a meta with good seo for this page */}
        <meta
          name="description"
          content="Moopa is a website where you can find all the information about your favorite anime and manga."
        />
        <meta
          name="keywords"
          content="anime, manga, moopa, anilist, information, schedule, airing, next, currently, airing, anime, manga"
        />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Moopa Team" />
        <meta name="url" content="https://moopa.live/en/schedule" />
        <meta name="og:title" property="og:title" content="Moopa - Schedule" />
        <meta
          name="og:description"
          property="og:description"
          content="Moopa is a website where you can find all the information about your favorite anime and manga."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://moopa.live/en/schedule" />
        <meta
          property="og:image"
          content="https://beta.moopa.live/preview.png"
        />
        <meta
          property="og:image:alt"
          content="Moopa is a website where you can find all the information about your favorite anime and manga."
        />
        <meta property="og:locale" content="en_US" />
        <meta property="og:site_name" content="Moopa" />
        <meta name="twitter:card" content="summary_large_image" />
        {/* <meta name="twitter:site" content="@moopa_anime" />
        <meta name="twitter:creator" content="@moopa_anime" /> */}
        <meta
          name="twitter:image"
          content="https://beta.moopa.live/preview.png"
        />
        <meta
          name="twitter:image:alt"
          content="Moopa is a website where you can find all the information about your favorite anime and manga."
        />
        <meta name="twitter:title" content="Moopa - Schedule" />
        <meta
          name="twitter:description"
          content="Moopa is a website where you can find all the information about your favorite anime and manga."
        />
      </Head>
      <MobileNav hideProfile={true} />
      <Navbar scrollP={10} toTop={true} />
      <div className="w-screen">
        <span className="w-screen h-[190px] lg:h-[250px] bg-secondary overflow-hidden">
          <div className="w-full h-full bg-primary rounded" />
        </span>
        <div className="flex flex-col mx-auto my-10 w-full mt-16 lg:mt-24 max-w-screen-2xl gap-5 md:gap-10">
          <div className="flex flex-col lg:flex-row gap-2 justify-between px-3">
            <ul
              ref={scrollContainerRef}
              className="flex overflow-x-scroll px-8 cust-scroll items-center gap-5 font-karla text-2xl font-semibold"
            >
              <button
                type="button"
                onClick={() => setFilterDay("All")}
                className={`hover:text-action transition-all duration-200 ease-out cursor-pointer ${
                  filterDay === "All" ? "text-action" : ""
                }`}
              >
                All
              </button>
              {day.map((i) => (
                <button
                  key={i}
                  // id={`same_${i}`}
                  type="button"
                  onClick={() => {
                    setLoading(true);
                    setFilterDay(i);
                    setLoading(false);
                  }}
                  className={`py-2 lg:py-0 outline-none hover:text-action transition-all duration-200 ease-out cursor-pointer ${
                    filterDay === i ? "text-action" : ""
                  }`}
                >
                  {i}
                </button>
              ))}
            </ul>
            <div className="flex gap-3">
              <ClockIcon
                className={`w-6 h-6 cursor-pointer ${
                  layout === 1 ? "text-action" : "text-white"
                }`}
                onClick={() => setLayout(1)}
              />
              <CalendarIcon
                className={`w-6 h-6 cursor-pointer ${
                  layout === 2 ? "text-action" : "text-white"
                }`}
                onClick={() => setLayout(2)}
              />
            </div>
          </div>

          {layout === 1 ? (
            !loading ? (
              Object.entries(
                filterFormattedSchedule(formattedSchedule, filterDay)
              ).map(([day, timeSlots], index) => (
                <div
                  key={`section_${day}`}
                  // id={`same_${day}`}
                  className="grid gap-5 p-12"
                >
                  <h2 className="font-bold font-outfit text-white text-2xl">
                    {day}
                  </h2>
                  {Object.entries(timeSlots).map(([time, animeList]) => (
                    <motion.div
                      initial={{
                        y: 30,
                        opacity: 0
                      }}
                      whileInView={{
                        y: 0,
                        opacity: 1
                      }}
                      transition={{
                        duration: 0.5,
                        delay: 0.2,

                        ease: cubicBezier(0.35, 0.17, 0.3, 0.86)
                      }}
                      key={time}
                      // id={`same_${time}`}
                      className="relative space-y-2"
                    >
                      <div className="ml-4 flex items-center gap-2">
                        <h3 className="text-lg text-gray-200 font-semibold">
                          {time && timeStamptoAMPM(time)}
                        </h3>
                        {/* {!isAired(time) && <p>Airing Next</p>} */}
                        <p
                          className={`absolute left-0 h-1.5 w-1.5 rounded-full ${
                            isAired(+time) ? "bg-action" : "bg-gray-600" // Add a class for currently airing anime
                          }`}
                        ></p>
                      </div>
                      <div className="w-full grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-7 grid-flow-row relative">
                        {animeList.map((s, index) => {
                          const m = s.media;
                          return (
                            <>
                              <Link
                                key={m.id}
                                // id={`same_${m.id}`}
                                href={`/en/${m.type.toLowerCase()}/${m.id}`}
                                className={`flex bg-secondary rounded group cursor-pointer overflow-hidden ml-4`}
                              >
                                <Image
                                  src={m.coverImage.extraLarge}
                                  alt="image"
                                  width={300}
                                  height={300}
                                  className="w-[50px] h-[65px] object-cover shrink-0"
                                />
                                <div className="flex flex-col justify-center font-karla p-2">
                                  <h1 className="font-semibold line-clamp-1 text-sm group-hover:text-action transition-all duration-200 ease-out">
                                    {m.title.romaji}
                                  </h1>
                                  <p className="text-gray-400 group-hover:text-action/80 transition-all duration-200 ease-out">
                                    Ep {s?.episode}{" "}
                                    {timeStamptoHour(s.airingAt)}
                                  </p>
                                </div>
                              </Link>
                              <p
                                key={`p_${s.id}_${index}`}
                                className={`absolute translate-x-full top-1/2 -translate-y-1/2 h-full w-0.5 ${
                                  isAired(+time) ? "bg-action" : "bg-gray-600" // Add a class for currently airing anime
                                }`}
                              ></p>
                            </>
                          );
                        })}
                      </div>
                    </motion.div>
                  ))}
                </div>
              ))
            ) : (
              <div className="z-[500] pt-10 lg:pt-0">
                <Loading />
              </div>
            )
          ) : !loading ? (
            Object.entries(filterScheduleByDay(sortedSchedule, filterDay)).map(
              ([day, schedules]) => (
                <div
                  key={`section2_${day}`}
                  // id={`same_${day}`}
                  className="flex flex-col gap-5 p-12"
                >
                  <h2
                    // id={day}
                    className="font-bold font-outfit text-white text-2xl"
                  >
                    {day}
                  </h2>
                  <motion.div
                    initial={{
                      y: 30,
                      opacity: 0
                    }}
                    whileInView={{
                      y: 0,
                      opacity: 1
                    }}
                    transition={{
                      duration: 0.5,
                      ease: cubicBezier(0.35, 0.17, 0.3, 0.86)
                    }}
                    className="w-full grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-5 sm:gap-4 grid-flow-row"
                  >
                    {schedules.map((s) => {
                      const m = s.media;
                      console.log(m);

                      return (
                        <Link
                          key={m.id}
                          // id={`same_${m.id}`}
                          href={`/en/${m.type?.toLowerCase()}/${m.id}`}
                          className={`flex bg-secondary rounded group cursor-pointer relative ${
                            s.id === nextAiringAnime
                              ? "ring-1 ring-sky-500"
                              : "" // Add a class for next airing anime
                          } ${
                            s.id === currentlyAiringAnime
                              ? "ring-1 ring-action"
                              : "" // Add a class for currently airing anime
                          }`}
                        >
                          {/* <p className={``}> */}
                          <p className="absolute flex top-0 right-0 -mt-1 -mr-1 justify-center items-center">
                            <span
                              className={`relative flex justify-center h-3 w-3 tooltip-container ${
                                s.id === nextAiringAnime ? "" : "hidden" // Add a className for next airing anime
                              }`}
                            >
                              {/* <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span> */}
                              <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
                              <span className="tooltip">Next Airing</span>
                            </span>
                          </p>
                          <p className="absolute flex top-0 right-0 -mt-1 -mr-1 justify-center items-center">
                            <span
                              className={`relative flex justify-center h-3 w-3 tooltip-container ${
                                s.id === currentlyAiringAnime ? "" : "hidden" // Add a className for currently airing anime
                              }`}
                            >
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
                              <span className="tooltip">Airing Now</span>
                            </span>
                          </p>
                          <Image
                            src={m.coverImage.extraLarge}
                            alt="image"
                            width={200}
                            height={200}
                            className="w-[50px] h-[65px] object-cover shrink-0 rounded-l"
                          />
                          <div className="flex flex-col justify-center font-karla p-2">
                            <h1 className="font-semibold line-clamp-1 text-sm group-hover:text-action transition-all duration-200 ease-out">
                              {m.title.romaji}
                            </h1>
                            <p className="text-gray-400 group-hover:text-action/80 transition-all duration-200 ease-out">
                              Ep {s.episode} {timeStamptoHour(s.airingAt)}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </motion.div>
                </div>
              )
            )
          ) : (
            <div className="z-[500] pt-10 lg:pt-0">
              <Loading />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
