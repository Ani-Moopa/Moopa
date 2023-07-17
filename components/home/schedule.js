import { Textfit } from "react-textfit";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { convertUnixToTime } from "../../utils/getTimes";
import { PlayIcon } from "@heroicons/react/20/solid";
import { BackwardIcon, ForwardIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

export default function Schedule({ data, scheduleData, time }) {
  let now = new Date();
  let currentDay =
    now.toLocaleString("default", { weekday: "long" }).toLowerCase() +
    "Schedule";
  currentDay = currentDay.replace("Schedule", "");

  const [activeSection, setActiveSection] = useState(currentDay);

  const scrollRef = useRef(null);

  useEffect(() => {
    if (scheduleData) {
      const index = Object?.keys(scheduleData).indexOf(
        activeSection + "Schedule"
      );
      if (scrollRef.current) {
        scrollRef.current.scrollLeft = scrollRef.current.clientWidth * index;
      }
    }
  }, [activeSection, scheduleData]);

  const handleScroll = (e) => {
    const { scrollLeft, clientWidth } = e.target;
    const index = Math.floor(scrollLeft / clientWidth);
    let day = Object?.keys(scheduleData)[index];
    day = day.replace("Schedule", "");
    setActiveSection(day);
  };

  // buttons to scroll horizontally
  const scrollLeft = () => {
    if (scrollRef.current.scrollLeft === 0) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
    } else {
      scrollRef.current.scrollLeft -= scrollRef.current.offsetWidth;
    }
  };

  const scrollRight = () => {
    const difference =
      scrollRef.current.scrollWidth -
      scrollRef.current.offsetWidth -
      scrollRef.current.scrollLeft;
    if (difference < 5) {
      // adjust the threshold as needed
      scrollRef.current.scrollLeft = 0;
    } else {
      scrollRef.current.scrollLeft += scrollRef.current.offsetWidth;
    }
  };

  return (
    <div className="flex flex-col gap-5 px-4 lg:px-0">
      <h1 className="font-bold font-karla text-[20px] lg:px-5">
        Don't miss out!
      </h1>
      <div className="rounded mb-5 shadow-md shadow-black">
        <div className="overflow-hidden w-full h-[96px] lg:h-[10rem] rounded relative">
          <div className="absolute flex flex-col justify-center pl-5 lg:pl-16 rounded z-20 bg-gradient-to-r from-30% from-[#0c0c0c] to-transparent w-full h-full">
            <h1 className="text-xs lg:text-lg">Coming Up Next!</h1>
            <Textfit
              mode="single"
              min={16}
              max={40}
              className="w-1/2 lg:w-2/5 hidden lg:block font-medium font-karla leading-[2.9rem] text-white line-clamp-1"
            >
              <Link
                href={`/en/anime/${data.id}`}
                className="hover:underline underline-offset-4 decoration-2"
              >
                {data.title.romaji || data.title.english || data.title.native}
              </Link>
            </Textfit>
            <h1 className="w-1/2 lg:hidden font-medium font-karla leading-9 text-white line-clamp-1">
              {data.title.romaji || data.title.english || data.title.native}
            </h1>
          </div>
          {data.bannerImage ? (
            <Image
              src={data.bannerImage || data.coverImage.large}
              width={500}
              height={500}
              alt="banner next anime"
              className="absolute z-10 top-0 right-0 w-3/4 h-full object-cover brightness-[30%]"
            />
          ) : (
            <Image
              src={data.coverImage.large}
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
                <span className="text-action/80">{time.days}</span>
                <span className="text-sm lg:text-base font-medium">Days</span>
              </div>
              <span></span>
              <div className="flex flex-col items-center">
                <span className="text-action/80">{time.hours}</span>
                <span className="text-sm lg:text-base font-medium">Hours</span>
              </div>
              <span></span>
              <div className="flex flex-col items-center">
                <span className="text-action/80">{time.minutes}</span>
                <span className="text-sm lg:text-base font-medium">Mins</span>
              </div>
              <span></span>
              <div className="flex flex-col items-center">
                <span className="text-action/80">{time.seconds}</span>
                <span className="text-sm lg:text-base font-medium">Secs</span>
              </div>
            </div>
          </div>
        </div>
        {scheduleData && (
          <div className="w-full bg-tersier rounded-b overflow-hidden">
            <div
              ref={scrollRef}
              className="flex overflow-x-scroll snap snap-x snap-proximity  scrollbar-hide"
              onScroll={handleScroll}
            >
              {Object.entries(scheduleData).map(([section, data], index) => {
                const uniqueArray = data.reduce((accumulator, current) => {
                  if (!accumulator.find((item) => item.id === current.id)) {
                    accumulator.push(current);
                  }
                  return accumulator;
                }, []);

                return (
                  <div
                    key={index}
                    className="snap-start flex-shrink-0 h-[240px] overflow-y-scroll scrollbar-thin scrollbar-thumb-secondary scrollbar-thumb-rounded w-full"
                    style={{ scrollbarGutter: "stable" }}
                  >
                    <div className="flex flex-col gap-2 px-2 pt-2">
                      {uniqueArray.map((i, index) => {
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
                              <Image
                                src={i.coverImage}
                                alt="coverSchedule"
                                width={300}
                                height={300}
                                className="w-10 h-10 object-cover rounded"
                              />
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
                );
              })}
            </div>
            <div className="flex items-center bg-tersier justify-between font-karla p-2 border-t border-secondary/40">
              <button
                type="button"
                className="bg-secondary px-2 py-1 rounded"
                onClick={scrollLeft}
              >
                <BackwardIcon className="w-5 h-5" />
              </button>
              <div className="font-bold uppercase">{activeSection}</div>
              <button
                type="button"
                className="bg-secondary px-2 py-1 rounded"
                onClick={scrollRight}
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
