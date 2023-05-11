import Link from "next/link";
import React, { useState, useRef } from "react";
import Image from "next/image";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import { useDraggable } from "react-use-draggable-scroll";
import {
  ChevronRightIcon,
  ArrowRightCircleIcon,
} from "@heroicons/react/24/outline";

export default function Content({ ids, section, data }) {
  const ref = useRef();
  const { events } = useDraggable(ref, {
    applyRubberBandEffect: true, // activate rubber band effect
    isMounted: true,
    decayRate: 0.96,
  });
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

  // console.log({ left: scrollLeft, right: scrollRight });

  const array = data;
  let filteredData = array?.filter((item) => item !== null);
  return (
    <div>
      <div className="flex items-center justify-between lg:justify-normal lg:gap-3 px-5">
        <h1 className="font-karla text-[20px] font-bold">{section}</h1>
        <ChevronRightIcon className="w-5 h-5" />
      </div>
      <div className="relative flex items-center lg:gap-2">
        <MdChevronLeft
          onClick={slideLeft}
          size={35}
          className={` mb-5 cursor-pointer hover:text-action absolute left-0 bg-gradient-to-r from-[#141519] z-40 h-full hover:opacity-100 ${
            scrollLeft ? "lg:visible" : "hidden"
          }`}
        />
        <div
          id={ids}
          className="scroll flex h-full w-full items-center select-none overflow-x-scroll  whitespace-nowrap overflow-y-hidden scrollbar-hide lg:gap-8 gap-3 lg:p-10 py-8 px-5 z-30 scroll-smooth"
          {...events}
          ref={ref}
          onScroll={handleScroll}
        >
          {filteredData?.map((anime) => {
            return (
              <div
                key={anime.id}
                className="flex shrink-0 cursor-pointer items-center"
              >
                <Link
                  href={`/anime/${anime.id}`}
                  className="hover:scale-105 group relative duration-300 ease-in-out"
                >
                  <Image
                    draggable={false}
                    src={
                      anime.image ||
                      anime.coverImage?.extraLarge ||
                      anime.coverImage?.large ||
                      "https://cdn.discordapp.com/attachments/986579286397964290/1058415946945003611/gray_pfp.png"
                    }
                    alt={anime.title.romaji || anime.title.english}
                    width={209}
                    height={300}
                    placeholder="blur"
                    blurDataURL={
                      anime.image ||
                      anime.coverImage?.extraLarge ||
                      anime.coverImage?.large ||
                      "https://cdn.discordapp.com/attachments/986579286397964290/1058415946945003611/gray_pfp.png"
                    }
                    className="z-20 h-[190px] w-[135px] lg:h-[265px] lg:w-[185px] object-cover rounded-md"
                  />
                </Link>
              </div>
            );
          })}
          {section !== "Recommendation" && (
            <div key={section} className="flex ">
              <div className="h-[190px] w-[135px] lg:h-[265px] lg:w-[185px] object-cover rounded-md border-secondary border-2 flex flex-col gap-2 items-center text-center justify-center text-[#6a6a6a]">
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
