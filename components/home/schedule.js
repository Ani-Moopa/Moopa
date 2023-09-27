import Image from "next/image";
import { useEffect, useState } from "react";
import { convertUnixToTime } from "../../utils/getTimes";
import { PlayIcon } from "@heroicons/react/20/solid";
import { BackwardIcon, ForwardIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { useCountdown } from "../../utils/useCountdownSeconds";

export default function Schedule({ data, scheduleData, anime, update }) {
  let now = new Date();
  let currentDay =
    now.toLocaleString("default", { weekday: "long" }).toLowerCase() +
    "Schedule";
  currentDay = currentDay.replace("Schedule", "");

  const [day, hours, minutes, seconds] = useCountdown(
    anime[0]?.airingSchedule.nodes[0]?.airingAt * 1000 || Date.now(),
    update
  );

  const [currentPage, setCurrentPage] = useState(0);
  const [days, setDay] = useState();

  useEffect(() => {
    if (scheduleData) {
      const days = Object.keys(scheduleData);
      setDay(days);
    }
  }, [scheduleData]);

  const handleNextPage = () => {
    setCurrentPage((prevPage) => (prevPage + 1) % days.length);
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => (prevPage - 1 + days.length) % days.length);
  };

  useEffect(() => {
    const todayIndex = days?.findIndex((day) =>
      day.toLowerCase().includes(currentDay)
    );
    setCurrentPage(todayIndex >= 0 ? todayIndex : 0);
  }, [currentDay, days]);

  return (
    <div className="flex flex-col gap-5 px-4 lg:px-0">
      <h1 className="font-bold font-karla text-[20px] lg:px-5">
        Don't miss out!
      </h1>
      <div className="rounded mb-5 shadow-md shadow-black">
        <div className="overflow-hidden w-full h-[96px] lg:h-[10rem] rounded relative">
          <div className="absolute flex flex-col lg:gap-1 justify-center pl-5 lg:pl-16 rounded z-20 bg-gradient-to-r from-30% from-tersier to-transparent w-full h-full">
            <h1 className="text-xs lg:text-lg">Coming Up Next!</h1>
            <div className="w-1/2 lg:w-2/5 hidden lg:block font-karla font-medium">
              <Link
                href={`/en/anime/${data.id}`}
                className="hover:underline underline-offset-4 decoration-2 leading-3 lg:text-[1.5vw]"
              >
                {data.title.romaji || data.title.english || data.title.native}
              </Link>
            </div>
            <h1 className="w-1/2 lg:hidden font-medium font-karla leading-9 text-white line-clamp-1">
              {data.title.romaji || data.title.english || data.title.native}
            </h1>
          </div>
          {data.bannerImage ? (
            <Image
              src={data.bannerImage || data.coverImage.extraLarge}
              width={500}
              height={500}
              alt="banner next anime"
              className="absolute z-10 top-0 right-0 w-3/4 h-full object-cover opacity-30"
            />
          ) : (
            <Image
              src={data.coverImage.extraLarge}
              width={500}
              height={500}
              sizes="100vw"
              alt="banner next anime"
              className="absolute z-10 top-0 right-0 h-full object-contain object-right brightness-[90%]"
            />
          )}
          <div
            className={`absolute flex justify-end items-center pr-5 gap-5 md:gap-10 z-20 w-1/2 h-full right-0 ${
              data.bannerImage ? "md:pr-16" : "md:pr-48"
            }`}
          >
            {/* Countdown Timer */}
            <div className="flex items-center gap-2 md:gap-5 font-bold font-karla text-sm md:text-xl">
              {/* Countdown Timer */}
              <div className="flex flex-col items-center">
                <span className="text-action/80">{day}</span>
                <span className="text-sm lg:text-base font-medium">Days</span>
              </div>
              <span></span>
              <div className="flex flex-col items-center">
                <span className="text-action/80">{hours}</span>
                <span className="text-sm lg:text-base font-medium">Hours</span>
              </div>
              <span></span>
              <div className="flex flex-col items-center">
                <span className="text-action/80">{minutes}</span>
                <span className="text-sm lg:text-base font-medium">Mins</span>
              </div>
              <span></span>
              <div className="flex flex-col items-center">
                <span className="text-action/80">{seconds}</span>
                <span className="text-sm lg:text-base font-medium">Secs</span>
              </div>
            </div>
          </div>
        </div>

        {scheduleData && days && (
          <div className="w-full bg-tersier rounded-b overflow-hidden">
            <div
              className="snap-start flex-shrink-0 h-[240px] overflow-y-scroll scrollbar-thin scrollbar-thumb-secondary scrollbar-thumb-rounded w-full"
              style={{ scrollbarGutter: "stable" }}
            >
              <div className="flex flex-col gap-2 px-2 pt-2">
                {scheduleData[days[currentPage]]
                  ?.filter((show, index, self) => {
                    return index === self.findIndex((s) => s.id === show.id);
                  })
                  ?.map((i, index) => {
                    const currentTime = Date.now();
                    const hasAired = i.airingAt < currentTime;

                    return (
                      <Link
                        key={`${i.id}-${index}`}
                        href={`/en/anime/${i.id}`}
                        className={`${
                          hasAired ? "opacity-40" : ""
                        } h-full w-full flex items-center p-2 flex-shrink-0 hover:bg-secondary cursor-pointer`}
                      >
                        <div className="shrink-0">
                          {i.coverImage && (
                            <Image
                              src={i.coverImage}
                              alt={`${i.title.romaji} cover`}
                              width={300}
                              height={300}
                              className="w-10 h-10 object-cover rounded"
                            />
                          )}
                        </div>
                        <div className="flex items-center justify-between w-full">
                          <div className="font-karla px-2">
                            <h1 className="font-semibold text-sm line-clamp-1">
                              {i.title.romaji}
                            </h1>
                            <p className="font-semibold text-xs text-gray-400">
                              {convertUnixToTime(i.airingAt)} - Episode{" "}
                              {i.airingEpisode}
                            </p>
                          </div>
                          <div>
                            <PlayIcon className="w-6 h-6 text-gray-300" />
                          </div>
                        </div>
                      </Link>
                    );
                  })}
              </div>
            </div>
            <div className="flex items-center bg-tersier justify-between font-karla p-2 border-t border-secondary/40">
              <button
                type="button"
                className="bg-secondary px-2 py-1 rounded"
                onClick={handlePreviousPage}
              >
                <BackwardIcon className="w-5 h-5" />
              </button>
              <div className="font-bold uppercase">
                {days[currentPage]?.replace("Schedule", "")}
              </div>
              <button
                type="button"
                className="bg-secondary px-2 py-1 rounded"
                onClick={handleNextPage}
              >
                <ForwardIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
