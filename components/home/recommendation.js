import Image from "next/image";
// import data from "../../assets/dummyData.json";
import {
  BookOpenIcon as BookOpenSolid,
  PlayIcon,
} from "@heroicons/react/24/solid";
import { useDraggable } from "react-use-draggable-scroll";
import { useRef } from "react";
import Link from "next/link";
import {
  BookOpenIcon as BookOpenOutline,
  PlayCircleIcon,
} from "@heroicons/react/24/outline";

export default function UserRecommendation({ data }) {
  const mobileRef = useRef(null);
  const desktopRef = useRef(null);
  const { events: mobileEvent } = useDraggable(mobileRef);
  const { events: desktopEvent } = useDraggable(desktopRef);

  const uniqueRecommendationIds = new Set();

  // Filter out duplicates from the recommendations array
  const filteredData = data.filter((recommendation) => {
    // Check if the ID is already in the set
    if (uniqueRecommendationIds.has(recommendation.id)) {
      // If it's a duplicate, return false to exclude it from the filtered array
      return false;
    }

    // If it's not a duplicate, add the ID to the set and return true
    uniqueRecommendationIds.add(recommendation.id);
    return true;
  });

  return (
    <div className="flex flex-col lg:bg-tersier relative rounded overflow-hidden">
      <div className="hidden lg:flex lg:gap-5 z-50">
        <div className="flex flex-col items-start justify-center gap-3 lg:gap-7 lg:w-[50%] pl-5 lg:px-10">
          <h2
            className="font-inter font-bold text-3xl text-white line-clamp-2"
            title={data[0].title.userPreferred}
          >
            {data[0].title.userPreferred}
          </h2>
          <p
            dangerouslySetInnerHTML={{
              __html: data[0].description?.replace(/<[^>]*>/g, ""),
            }}
            className="font-roboto font-light line-clamp-3 lg:line-clamp-3"
          />
          <Link
            href={`/en/${data[0].type.toLowerCase()}/${data[0].id}`}
            className="border border-white/70 py-1 px-2 lg:py-2 lg:px-4 rounded-full flex items-center gap-2 text-white font-bold"
          >
            {data[0].type === "ANIME" ? (
              <PlayIcon className="w-5 h-5 text-white" />
            ) : (
              <BookOpenSolid className="w-5 h-5 text-white" />
            )}
            {data[0].type === "ANIME" ? "Watch" : "Read"} Now
          </Link>
        </div>
        <div
          id="recommendation-list"
          className="flex gap-5 overflow-x-scroll scrollbar-none px-5 py-7 lg:py-10"
          ref={desktopRef}
          {...desktopEvent}
        >
          {filteredData.slice(0, 9).map((i) => (
            <Link
              key={`desktop-${i.id}`}
              href={`/en/${i.type.toLowerCase()}/${i.id}`}
              className="relative flex-center snap-start shrink-0 group rounded"
            >
              <span className="h-[190px] w-[135px] lg:h-[265px] lg:w-[185px] rounded absolute bg-gradient-to-b from-black/50 from-5% to-30% to-transparent z-40" />
              <span className="h-[190px] w-[135px] lg:h-[265px] lg:w-[185px] rounded absolute group-hover:bg-gradient-to-t from-black/90 to-transparent z-40 opacity-0 group-hover:opacity-100 transition-all duration-200 ease" />
              <span
                title={i.title.userPreferred}
                className="absolute bottom-5 text-center line-clamp-2 font-karla font-semibold opacity-0 group-hover:opacity-100 w-[70%] z-50 transition-all duration-200 ease"
              >
                {i.title.userPreferred}
              </span>
              <div className="absolute top-0 right-0 z-40 font-karla font-bold">
                {i.type === "ANIME" ? (
                  <span className="flex items-center px-2 py-1 gap-1 text-sm text-white">
                    <PlayCircleIcon className="w-5 h-5" />
                  </span>
                ) : (
                  <span className="flex items-center px-2 py-1 gap-1 text-sm text-white">
                    <BookOpenOutline className="w-5 h-5" />
                  </span>
                )}
              </div>
              <Image
                src={i.coverImage.extraLarge}
                alt={i.title.userPreferred}
                width={190}
                height={256}
                className="h-[190px] w-[135px] lg:h-[265px] lg:w-[185px] brightness-[90%] rounded-md object-cover overflow-hidden transition-all duration-150 ease-in-out"
              />
              {/* <span className="absolute rounded pointer-events-none w-[240px] h-[50%] transition-all duration-150 ease-in transform group-hover:translate-x-[80%] top-0 left-0 bg-secondary opacity-0 group-hover:opacity-100 flex flex-col z-50">
                <div className="">{i.title.userPreferred}</div>
                <div>a</div>
              </span> */}
            </Link>
          ))}
        </div>
      </div>
      <div className="flex lg:hidden">
        <div
          id="recommendation-list"
          className="flex gap-5 overflow-x-scroll scrollbar-none px-5 py-5 lg:py-10"
          ref={mobileRef}
          {...mobileEvent}
        >
          {filteredData.slice(0, 9).map((i) => (
            <div key={`mobile-${i.id}`} className="flex flex-col gap-2">
              <Link
                title={i.title.userPreferred}
                href={`/en/${i.type.toLowerCase()}/${i.id}`}
                className="relative flex-center snap-start shrink-0 group rounded scale-100 hover:scale-105 duration-300 ease-out"
              >
                <span className="h-[190px] w-[135px] lg:h-[265px] lg:w-[185px] rounded absolute bg-gradient-to-b from-black/50 from-5% to-30% to-transparent z-40" />
                <div className="absolute top-0 right-0 z-40 font-karla font-bold">
                  {i.type === "ANIME" ? (
                    <span className="flex items-center px-2 py-1 gap-1 text-sm text-white">
                      <PlayCircleIcon className="w-5 h-5" />
                    </span>
                  ) : (
                    <span className="flex items-center px-2 py-1 gap-1 text-sm text-white">
                      <BookOpenOutline className="w-5 h-5" />
                    </span>
                  )}
                </div>
                <Image
                  src={i.coverImage.extraLarge}
                  alt={i.title.userPreferred}
                  width={190}
                  height={256}
                  className="h-[190px] w-[135px] lg:h-[265px] lg:w-[185px] shrink-0 brightness-[90%] rounded-md object-cover overflow-hidden transition-all duration-150 ease-in-out"
                />
              </Link>
              <Link
                href={
                  i.type === "MANGA"
                    ? `/en/manga/${i.id}`
                    : `/en/${i.type.toLowerCase()}/${i.id}`
                }
                className="w-[135px] lg:w-[185px] line-clamp-2"
                title={i.title.romaji}
              >
                <h1 className="font-karla font-semibold xl:text-base text-[15px]">
                  {i.status === "RELEASING" ? (
                    <span className="dots bg-green-500" />
                  ) : i.status === "NOT_YET_RELEASED" ? (
                    <span className="dots bg-red-500" />
                  ) : null}
                  {i.title.userPreferred}
                </h1>
              </Link>
            </div>
          ))}
        </div>
      </div>
      <div className="hidden lg:block absolute top-0 left-0 z-40 bg-gradient-to-r from-transparent from-30% to-80% to-tersier w-[80%] lg:w-[60%] h-full" />
      {data[0]?.bannerImage && (
        <Image
          src={data[0]?.bannerImage}
          alt={data[0].title.userPreferred}
          width={500}
          height={500}
          className="hidden lg:block absolute top-0 left-0 z-30 w-[60%] h-full object-cover opacity-30"
        />
      )}
    </div>
  );
}
