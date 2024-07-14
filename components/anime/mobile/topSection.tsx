import {
  BookOpenIcon,
  PlayIcon,
  PlusIcon,
  ShareIcon,
} from "@heroicons/react/24/solid";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { convertSecondsToTime } from "@/utils/getTimes";
import Link from "next/link";
import InfoChip from "./reused/infoChip";
import Description from "./reused/description";
import Skeleton from "react-loading-skeleton";
import { AniListInfoTypes } from "types/info/AnilistInfoTypes";

type DetailTopProps = {
  info?: AniListInfoTypes | null;
  statuses?: any;
  handleOpen: () => void;
  watchUrl: string | undefined;
  progress?: number;
  color?: string | null;
};

export default function DetailTop({
  info,
  statuses = undefined,
  handleOpen,
  watchUrl,
  progress,
  color,
}: DetailTopProps) {
  const router = useRouter();
  const [readMore, setReadMore] = useState(false);

  const [showAll, setShowAll] = useState(false);

  const isAnime = info?.type === "ANIME";

  useEffect(() => {
    setReadMore(false);
  }, [info?.id]);

  const handleShareClick = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${isAnime ? "Watch" : "Read"} Now - ${info?.title?.english}`,
          // text: `Watch [${info?.title?.romaji}] and more on Moopa. Join us for endless anime entertainment"`,
          url: window.location.href,
        });
      } else {
        // Web Share API is not supported, provide a fallback or show a message
        alert("Web Share API is not supported in this browser.");
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  return (
    <div className="gap-6 w-full px-3 pt-4 md:pt-10 flex flex-col items-center justify-center">
      {/* MAIN */}
      <div className="flex flex-col md:flex-row w-full items-center md:items-end gap-5 pt-12">
        <div className="shrink-0 w-[180px] h-[250px] rounded overflow-hidden">
          {info ? (
            <Image
              src={
                info?.coverImage?.extraLarge?.toString() ??
                info?.coverImage?.toString()
              }
              alt="poster anime"
              width={300}
              height={300}
              className="w-full h-full object-cover"
            />
          ) : (
            <Skeleton className="h-full" />
          )}
        </div>
        <div className="flex flex-col gap-4 items-center md:items-start justify-end w-full">
          <div className="flex flex-col gap-1 text-center md:text-start w-full">
            <h3 className="font-karla text-lg capitalize leading-none">
              {info?.season?.toLowerCase() || getMonth(info?.startDate?.month)}{" "}
              {info?.seasonYear || info?.startDate?.year}
              {!info && <Skeleton height={14} width={140} />}
            </h3>
            <h1 className="font-outfit font-extrabold text-2xl md:text-4xl line-clamp-2 text-white">
              {info?.title?.romaji || info?.title?.english}
              {!info && <Skeleton height={35} width={340} className="" />}
            </h1>
            <h2 className="font-karla line-clamp-1 text-sm md:text-lg md:pb-2 font-light text-white/70">
              {info?.title?.english}
            </h2>
            {info && (
              <InfoChip info={info} color={color} className="hidden md:flex" />
            )}
            {info ? (
              info?.description && (
                <Description
                  info={info}
                  readMore={readMore}
                  setReadMore={setReadMore}
                  className="md:block hidden"
                />
              )
            ) : (
              <div className="w-full md:px-0 md:block hidden">
                <Skeleton className="h-[80px] w-[700px]" />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="hidden md:flex gap-5 items-center justify-start w-full">
        {info ? (
          <button
            type="button"
            onClick={() => router.push(watchUrl ?? "#")}
            className={`${
              !watchUrl ? "opacity-30 pointer-events-none" : ""
            } w-[180px] flex-center text-lg font-karla font-semibold gap-2 border-black border-opacity-10 text-black rounded-full py-1 px-4 bg-white hover:opacity-80`}
          >
            {isAnime ? (
              <PlayIcon className="w-5 h-5" />
            ) : (
              <BookOpenIcon className="w-5 h-5" />
            )}
            {progress && progress > 0 ? (
              statuses?.value === "COMPLETED" ? (
                isAnime ? (
                  "Rewatch"
                ) : (
                  "Reread"
                )
              ) : !watchUrl && info?.nextAiringEpisode ? (
                <span>
                  {convertSecondsToTime(info.nextAiringEpisode.timeUntilAiring)}{" "}
                </span>
              ) : (
                "Continue"
              )
            ) : isAnime ? (
              "Watch Now"
            ) : (
              "Read Now"
            )}
          </button>
        ) : (
          <div className="h-10 w-[180px] bg-secondary flex-center text-lg font-karla font-semibold gap-2 border-black border-opacity-10 text-black rounded-full" />
        )}
        <div className="flex gap-2">
          {info ? (
            <button
              type="button"
              className="flex-center group relative w-10 h-10 bg-secondary rounded-full"
              onClick={() => handleOpen()}
            >
              <span className="absolute pointer-events-none z-40 opacity-0 -translate-y-8 group-hover:-translate-y-10 group-hover:opacity-100 font-karla shadow-tersier shadow-md whitespace-nowrap bg-secondary px-2 py-1 rounded transition-all duration-200 ease-out">
                Add to List
              </span>
              <PlusIcon className="w-5 h-5" />
            </button>
          ) : (
            <div className="w-10 h-10 bg-secondary rounded-full" />
          )}
          {info ? (
            <button
              type="button"
              className="flex-center group relative w-10 h-10 bg-secondary rounded-full"
              onClick={handleShareClick}
            >
              <span className="absolute pointer-events-none z-40 opacity-0 -translate-y-8 group-hover:-translate-y-10 group-hover:opacity-100 font-karla shadow-tersier shadow-md whitespace-nowrap bg-secondary px-2 py-1 rounded transition-all duration-200 ease-out">
                Share {isAnime ? "Anime" : "Manga"}
              </span>
              <ShareIcon className="w-5 h-5" />
            </button>
          ) : (
            <div className="w-10 h-10 bg-secondary rounded-full" />
          )}
          {info ? (
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={`https://anilist.co/${info.type.toLowerCase()}/${info.id}`}
              className="flex-center group relative w-10 h-10 bg-secondary rounded-full"
            >
              <span className="absolute pointer-events-none z-40 opacity-0 -translate-y-8 group-hover:-translate-y-10 group-hover:opacity-100 font-karla shadow-tersier shadow-md whitespace-nowrap bg-secondary px-2 py-1 rounded transition-all duration-200 ease-out">
                See on AniList
              </span>
              <Image
                src="/svg/anilist-icon.svg"
                alt="anilist_icon"
                width={20}
                height={20}
              />
            </a>
          ) : (
            <div className="w-10 h-10 bg-secondary rounded-full" />
          )}
        </div>
      </div>

      <div className="md:hidden flex gap-2 items-center justify-center w-[90%]">
        {info ? (
          <button
            type="button"
            className="flex-center group relative w-10 h-10 bg-secondary rounded-full"
            onClick={() => handleOpen()}
          >
            <span className="absolute pointer-events-none z-40 opacity-0 -translate-y-8 group-hover:-translate-y-10 group-hover:opacity-100 font-karla shadow-tersier shadow-md whitespace-nowrap bg-secondary px-2 py-1 rounded transition-all duration-200 ease-out">
              Add to List
            </span>
            <PlusIcon className="w-5 h-5" />
          </button>
        ) : (
          <div className="w-10 h-10 bg-secondary rounded-full" />
        )}
        {info ? (
          <button
            type="button"
            onClick={() => router.push(watchUrl ?? "#")}
            className={`${
              !watchUrl ? "opacity-30 pointer-events-none" : ""
            } flex items-center text-lg font-karla font-semibold gap-1 border-black border-opacity-10 text-black rounded-full py-2 px-4 bg-white`}
          >
            {isAnime ? (
              <PlayIcon className="w-5 h-5" />
            ) : (
              <BookOpenIcon className="w-5 h-5" />
            )}
            {progress && progress > 0 ? (
              statuses?.value === "COMPLETED" ? (
                isAnime ? (
                  "Rewatch"
                ) : (
                  "Reread"
                )
              ) : !watchUrl && info?.nextAiringEpisode ? (
                <span>
                  {convertSecondsToTime(info.nextAiringEpisode.timeUntilAiring)}{" "}
                </span>
              ) : (
                "Continue"
              )
            ) : isAnime ? (
              "Watch Now"
            ) : (
              "Read Now"
            )}
          </button>
        ) : (
          <div className="h-10 w-32 bg-secondary flex-center text-lg font-karla font-semibold gap-2 border-black border-opacity-10 text-black rounded-full" />
        )}
        {info ? (
          <button
            type="button"
            className="flex-center group relative w-10 h-10 bg-secondary rounded-full"
            onClick={handleShareClick}
          >
            <span className="absolute pointer-events-none z-40 opacity-0 -translate-y-8 group-hover:-translate-y-10 group-hover:opacity-100 font-karla shadow-tersier shadow-md whitespace-nowrap bg-secondary px-2 py-1 rounded transition-all duration-200 ease-out">
              Share {isAnime ? "Anime" : "Manga"}
            </span>
            <ShareIcon className="w-5 h-5" />
          </button>
        ) : (
          <div className="w-10 h-10 bg-secondary rounded-full" />
        )}
      </div>

      {info && info.nextAiringEpisode?.timeUntilAiring && (
        <p className="md:hidden">
          Episode {info.nextAiringEpisode.episode} in{" "}
          <span className="font-bold">
            {convertSecondsToTime(info.nextAiringEpisode.timeUntilAiring)}{" "}
          </span>
        </p>
      )}

      {info && info?.description && (
        <Description
          info={info}
          readMore={readMore}
          setReadMore={setReadMore}
          className="md:hidden"
        />
      )}

      {info && (
        <InfoChip
          info={info}
          color={color}
          className={`${readMore ? "flex" : "hidden"} md:hidden`}
        />
      )}

      {info && info?.relations?.edges?.length > 0 && (
        <div className="w-screen md:w-full">
          <div className="flex justify-between items-center p-3 md:p-0">
            {info?.relations?.edges?.length > 0 && (
              <div className="text-[20px] md:text-2xl font-bold font-karla">
                Relations
              </div>
            )}
            {info?.relations?.edges?.length > 3 && (
              <div
                className="cursor-pointer font-karla"
                onClick={() => setShowAll(!showAll)}
              >
                {showAll ? "show less" : "show more"}
              </div>
            )}
          </div>
          <div
            className={` md:w-full flex gap-5 overflow-x-scroll snap-x scroll-px-5 scrollbar-none md:grid md:grid-cols-3 justify-items-center md:pt-7 md:pb-5 px-3 md:px-4 pt-4 rounded-xl`}
          >
            {info?.relations?.edges
              .slice(0, showAll ? info?.relations?.edges.length : 3)
              .map((r, index) => {
                const rel = r.node;
                return (
                  <Link
                    key={rel.id}
                    href={
                      rel.type === "ANIME" ||
                      rel.type === "OVA" ||
                      rel.type === "MOVIE" ||
                      rel.type === "SPECIAL" ||
                      rel.type === "ONA"
                        ? `/en/anime/${rel.id}`
                        : `/en/manga/${rel.id}`
                    }
                    className={`md:hover:scale-[1.02] snap-start hover:shadow-lg scale-100 transition-transform duration-200 ease-out w-full ${
                      rel.type === "MUSIC" ? "pointer-events-none" : ""
                    }`}
                  >
                    <div
                      key={rel.id}
                      className="w-[400px] md:w-full h-[126px] bg-secondary flex rounded-md"
                    >
                      <div className="w-[90px] bg-image rounded-l-md shrink-0">
                        <Image
                          src={rel.coverImage.extraLarge}
                          alt={rel.id.toString()}
                          height={500}
                          width={500}
                          className="object-cover h-full w-full shrink-0 rounded-l-md"
                        />
                      </div>
                      <div className="h-full grid px-3 items-center">
                        <div className="text-action font-outfit font-bold capitalize">
                          {r.relationType.replace(/_/g, " ")}
                        </div>
                        <div className="font-outfit line-clamp-2">
                          {rel.title.userPreferred}
                        </div>
                        <div className="font-thin">{rel.format}</div>
                      </div>
                    </div>
                  </Link>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}

function getMonth(month: number | undefined) {
  if (!month) return "";
  const formattedMonth = new Date(0, month).toLocaleString("default", {
    month: "long",
  });
  return formattedMonth;
}
