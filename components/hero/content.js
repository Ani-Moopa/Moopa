import Link from "next/link";
import React, { useState, useRef } from "react";
import Image from "next/image";
import { MdChevronRight } from "react-icons/md";
import {
  ChevronRightIcon,
  ArrowRightCircleIcon,
} from "@heroicons/react/24/outline";

import { ChevronLeftIcon } from "@heroicons/react/20/solid";

export default function Content({ ids, section, data }) {
  const [startX, setStartX] = useState(null);
  const [scrollLefts, setScrollLefts] = useState(null);
  const containerRef = useRef(null);

  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - containerRef.current.offsetLeft);
    setScrollLefts(containerRef.current.scrollLeft);
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

  const array = data;
  let filteredData = array?.filter((item) => item !== null);
  const slicedData =
    filteredData?.length > 15 ? filteredData?.slice(0, 15) : filteredData;

  return (
    <div>
      <div className="flex items-center justify-between lg:justify-normal lg:gap-3 px-5">
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
          className="scroll flex h-full w-full items-center select-none overflow-x-scroll whitespace-nowrap overflow-y-hidden scrollbar-hide lg:gap-8 gap-3 lg:p-10 py-8 px-5 z-30 scroll-smooth"
          // {...events}
          // ref={ref}
          onScroll={handleScroll}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          onClick={handleClick}
          ref={containerRef}
        >
          {slicedData?.map((anime) => {
            return (
              <div
                key={anime.id}
                className="flex shrink-0 cursor-pointer items-center"
              >
                <Link
                  href={`/anime/${anime.id}`}
                  className="hover:scale-105 hover:shadow-lg group relative duration-300 ease-out"
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
                    className="z-20 h-[190px] w-[135px] lg:h-[265px] lg:w-[185px] object-cover rounded-md brightness-90"
                  />
                </Link>
              </div>
            );
          })}
          {filteredData.length >= 10 && section !== "Recommendations" && (
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
