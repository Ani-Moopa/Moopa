import Image from "next/image";
// import data from "../../assets/dummyData.json";
import { BookOpenIcon, PlayIcon } from "@heroicons/react/24/solid";
import { useDraggable } from "react-use-draggable-scroll";
import { useRef } from "react";
import Link from "next/link";

export default function UserRecommendation({ data }) {
  const ref = useRef(null);
  const { events } = useDraggable(ref);

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
    <div className="flex flex-col bg-tersier relative rounded overflow-hidden">
      <div className="flex lg:gap-5 z-50">
        <div className="flex flex-col items-start justify-center gap-3 lg:gap-7 lg:w-[50%] pl-5 lg:px-10">
          <h2 className="font-bold text-3xl text-white">
            {data[0].title.userPreferred}
          </h2>
          <p
            dangerouslySetInnerHTML={{
              __html: data[0].description?.replace(/<[^>]*>/g, ""),
            }}
            className="font-roboto font-light line-clamp-3 lg:line-clamp-3"
          />
          <button
            type="button"
            className="border border-white/70 py-1 px-2 lg:py-2 lg:px-4 rounded-full flex items-center gap-2 text-white font-bold"
          >
            {data[0].type === "ANIME" ? (
              <PlayIcon className="w-5 h-5 text-white" />
            ) : (
              <BookOpenIcon className="w-5 h-5 text-white" />
            )}
            {data[0].type === "ANIME" ? "Watch" : "Read"} Now
          </button>
        </div>
        <div
          id="recommendation-list"
          className="flex gap-5 overflow-x-scroll scrollbar-none px-5 py-7 lg:py-10"
          ref={ref}
          {...events}
        >
          {filteredData.slice(0, 9).map((i) => (
            <Link
              key={i.id}
              href={`/en/${i.type.toLowerCase()}/${i.id}`}
              className="relative snap-start shrink-0 group hover:bg-white/20 p-1 rounded"
            >
              <Image
                src={i.coverImage.extraLarge}
                alt={i.title.userPreferred}
                width={190}
                height={256}
                className="h-[190px] w-[135px] lg:h-[265px] lg:w-[185px] rounded-md object-cover overflow-hidden transition-all duration-150 ease-in-out"
              />
              <span className="absolute rounded pointer-events-none w-[240px] h-[50%] transition-all duration-150 ease-in transform translate-x-[75%] group-hover:translate-x-[80%] top-0 left-0 bg-secondary opacity-0 group-hover:opacity-100 flex flex-col z-50">
                <div className="">{i.title.userPreferred}</div>
                <div>a</div>
              </span>
            </Link>
          ))}
        </div>
      </div>
      <div className="absolute top-0 left-0 z-40 bg-gradient-to-r from-transparent from-30% to-80% to-tersier w-[80%] lg:w-[60%] h-full" />
      {data[0]?.bannerImage && (
        <Image
          src={data[0]?.bannerImage}
          alt={data[0].title.userPreferred}
          width={500}
          height={500}
          className="absolute top-0 left-0 z-30 w-[60%] h-full object-cover opacity-30"
        />
      )}
    </div>
  );
}
