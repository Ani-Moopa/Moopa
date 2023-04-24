import Link from "next/link";
import React, { useState } from "react";
import Image from "next/image";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";

export default function Content({ ids, section, data }) {
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
      <h1 className="px-5 font-karla text-[20px] font-bold">{section}</h1>
      <div className="relative flex items-center lg:gap-2">
        <MdChevronLeft
          onClick={slideLeft}
          size={35}
          className={`mb-5 cursor-pointer hover:text-action absolute left-0 bg-gradient-to-r from-[#141519]  z-40 h-full hover:opacity-100 ${
            scrollLeft ? "visible" : "hidden"
          }`}
        />
        <div
          id={ids}
          className="scroll flex h-full w-full items-center select-none overflow-x-scroll scroll-smooth whitespace-nowrap overflow-y-hidden scrollbar-hide lg:gap-8 gap-5 p-10 z-30 "
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
                  {/* <div className="fixed top-0 z-40 bg-black invisible group-hover:visible">
                    {anime.title.romaji || anime.title.english}
                  </div> */}
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
                    className="z-20 h-[192px] w-[135px] object-cover lg:h-[265px] lg:w-[185px] rounded-md"
                  />
                </Link>
              </div>
            );
          })}
        </div>
        <MdChevronRight
          onClick={slideRight}
          size={30}
          className={`mb-5 cursor-pointer hover:text-action absolute right-0 bg-gradient-to-l from-[#141519] z-40 h-full hover:opacity-100 hover:bg-gradient-to-l ${
            scrollRight ? "visible" : "hidden"
          }`}
        />
      </div>
    </div>
  );
}
