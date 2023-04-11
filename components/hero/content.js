import Link from "next/link";
import React from "react";
import Image from "next/image";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";

export default function Content({ ids, section, data }) {
  const slideLeft = () => {
    var slider = document.getElementById(ids);
    slider.scrollLeft = slider.scrollLeft - 500;
  };
  const slideRight = () => {
    var slider = document.getElementById(ids);
    slider.scrollLeft = slider.scrollLeft + 500;
  };

  const array = data;
  const filteredData = array.filter((item) => item.status !== "Unknown");

  return (
    <div>
      <h1 className="px-5 font-outfit text-[20px] font-extrabold lg:text-[27px]">
        {section}
      </h1>
      <div className="py-10">
        <div className="relative flex items-center lg:gap-2">
          <MdChevronLeft
            onClick={slideLeft}
            size={40}
            className="mb-5 cursor-pointer opacity-50 hover:opacity-100"
          />
          <div
            id={ids}
            className="scroll flex h-full w-full items-center overflow-x-scroll scroll-smooth whitespace-nowrap overflow-y-hidden scrollbar-hide lg:gap-5"
          >
            {filteredData.map((anime) => {
              const url = encodeURIComponent(
                anime.title.english || anime.title.romaji
              );

              return (
                <div
                  key={anime.id}
                  className="flex shrink-0 cursor-pointer items-center"
                >
                  <Link href={`/anime/${anime.id}`}>
                    <Image
                      draggable={false}
                      src={
                        anime.image ||
                        anime.coverImage?.extraLarge ||
                        "https://cdn.discordapp.com/attachments/986579286397964290/1058415946945003611/gray_pfp.png"
                      }
                      alt={anime.title.romaji || anime.title.english}
                      width={209}
                      height={300}
                      placeholder="blur"
                      blurDataURL={
                        anime.image ||
                        anime.coverImage?.extraLarge ||
                        "https://cdn.discordapp.com/attachments/986579286397964290/1058415946945003611/gray_pfp.png"
                      }
                      className="z-20 h-[230px] w-[168px] object-cover p-2 duration-300 ease-in-out hover:scale-105 lg:h-[290px] lg:w-[209px]"
                    />
                  </Link>
                </div>
              );
            })}
          </div>
          <MdChevronRight
            onClick={slideRight}
            size={40}
            className="mb-5 cursor-pointer opacity-50 hover:opacity-100"
          />
        </div>
      </div>
    </div>
  );
}
