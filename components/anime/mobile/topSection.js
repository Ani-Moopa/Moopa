import {
  ArrowUpCircleIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/solid";

import {
  ArrowLeftIcon,
  PlayIcon,
  PlusIcon,
  ShareIcon,
  UserIcon,
} from "@heroicons/react/24/solid";
import Image from "next/image";
import { useRouter } from "next/router";
import { useSearch } from "../../../lib/hooks/isOpenState";
import { useEffect, useState } from "react";
import { convertSecondsToTime } from "../../../utils/getTimes";
import Link from "next/link";
import { signIn } from "next-auth/react";
import InfoChip from "./reused/infoChip";
import Description from "./reused/description";

const getScrollPosition = (el = window) => ({
  x: el.pageXOffset !== undefined ? el.pageXOffset : el.scrollLeft,
  y: el.pageYOffset !== undefined ? el.pageYOffset : el.scrollTop,
});

export function NewNavbar({ info, session, scrollP = 200, toTop = false }) {
  const router = useRouter();
  const [scrollPosition, setScrollPosition] = useState();
  const { isOpen, setIsOpen } = useSearch();

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(getScrollPosition());
    };

    // Add a scroll event listener when the component mounts
    window.addEventListener("scroll", handleScroll);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return (
    <>
      <nav
        className={`fixed z-[200] top-0 py-3 px-5 w-full ${
          scrollPosition?.y >= scrollP
            ? "bg-tersier shadow-tersier shadow-sm"
            : ""
        } transition-all duration-200 ease-linear`}
      >
        <div className="flex items-center justify-between max-w-screen-2xl mx-auto">
          <div className="flex w-full items-center gap-4">
            {info ? (
              <>
                <button
                  type="button"
                  className="flex-center w-7 h-7 text-white"
                  onClick={() => {
                    // router.back();
                    router.push("/en");
                  }}
                >
                  <ArrowLeftIcon className="w-full h-full" />
                </button>
                <span
                  className={`font-inter font-semibold w-[50%] line-clamp-1 select-none ${
                    scrollPosition?.y >= scrollP + 80
                      ? "opacity-100"
                      : "opacity-0"
                  } transition-all duration-200 ease-linear`}
                >
                  {info.title.romaji}
                </span>
              </>
            ) : (
              // <></>
              <Link
                href={"/en"}
                className="flex-center text-white font-outfit text-2xl font-semibold"
              >
                moopa
              </Link>
            )}
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="flex-center w-[26px] h-[26px]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
              >
                <path
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 15l6 6m-11-4a7 7 0 110-14 7 7 0 010 14z"
                ></path>
              </svg>
            </button>
            {/* <div
                className="bg-white"
                // title={sessions ? "Go to Profile" : "Login With AniList"}
              > */}
            {session ? (
              <button
                type="button"
                onClick={() => router.push(`/en/profile/${session?.user.name}`)}
                className="w-7 h-7 relative flex flex-col items-center group"
              >
                <Image
                  src={session?.user.image.large}
                  alt="avatar"
                  width={50}
                  height={50}
                  className="w-full h-full object-cover"
                />
                <div className="hidden absolute z-50 w-28 text-center -bottom-20 text-white shadow-2xl opacity-0 bg-secondary p-1 py-2 rounded-md font-karla font-light invisible group-hover:visible group-hover:opacity-100 duration-300 transition-all md:grid place-items-center gap-1">
                  <Link
                    href={`/en/profile/${session?.user.name}`}
                    className="hover:text-action"
                  >
                    Profile
                  </Link>
                  <div
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="hover:text-action"
                  >
                    Log out
                  </div>
                </div>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => signIn("AniListProvider")}
                title="Login With AniList"
                className="w-7 h-7 bg-white/30 rounded-full overflow-hidden"
              >
                <UserIcon className="w-full h-full translate-y-2" />
              </button>
            )}
            {/* </div> */}
          </div>
        </div>
      </nav>
      {toTop && (
        <button
          type="button"
          onClick={() => {
            window.scrollTo({
              top: 0,
              behavior: "smooth",
            });
          }}
          className={`${
            scrollPosition?.y >= 180
              ? "-translate-x-6 opacity-100"
              : "translate-x-[100%] opacity-0"
          } transform transition-all duration-300 ease-in-out fixed bottom-24 lg:bottom-14 right-0 z-[500]`}
        >
          <ArrowUpCircleIcon className="w-10 h-10 text-white" />
        </button>
      )}
    </>
  );
}

export default function DetailTop({
  info,
  session,
  statuses,
  handleOpen,
  watchUrl,
  progress,
  color,
}) {
  const router = useRouter();
  const [readMore, setReadMore] = useState(false);

  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    setReadMore(false);
  }, [info.id]);

  const handleShareClick = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `Watch Now - ${info?.title?.english}`,
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
      <NewNavbar info={info} session={session} />

      {/* MAIN */}
      <div className="flex flex-col md:flex-row w-full items-center md:items-end gap-5 pt-12">
        <div className="shrink-0 w-[180px] h-[250px] rounded overflow-hidden">
          <Image
            src={info?.coverImage?.extraLarge}
            // alt="coverImage"
            alt="poster anime"
            width={300}
            height={300}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-col gap-4 items-center md:items-start justify-end w-full">
          <div className="flex flex-col gap-1 text-center md:text-start">
            <h3 className="font-karla text-lg capitalize  leading-none">
              {info?.season?.toLowerCase()} {info.seasonYear}
            </h3>
            <h1 className="font-outfit font-extrabold text-2xl md:text-4xl line-clamp-2 text-white">
              {info?.title?.romaji || info?.title?.english}
            </h1>
            <h2 className="font-karla line-clamp-1 text-sm md:text-lg md:pb-2 font-light text-white/70">
              {info.title?.english}
            </h2>
            <InfoChip info={info} color={color} className="hidden md:flex" />
            {info?.description && (
              <Description
                info={info}
                readMore={readMore}
                setReadMore={setReadMore}
                className="md:block hidden"
              />
            )}
          </div>
        </div>
      </div>

      <div className="hidden md:flex gap-5 items-center justify-start w-full">
        <button
          type="button"
          onClick={() => router.push(watchUrl)}
          className={`${
            !watchUrl ? "opacity-30 pointer-events-none" : ""
          } w-[180px] flex-center text-lg font-karla font-semibold gap-1 border-black border-opacity-10 text-black rounded-full py-1 px-4 bg-white hover:opacity-80`}
        >
          <PlayIcon className="w-5 h-5" />
          {progress > 0 ? (
            statuses?.value === "COMPLETED" ? (
              "Rewatch"
            ) : !watchUrl && info?.nextAiringEpisode ? (
              <span>
                {convertSecondsToTime(info.nextAiringEpisode.timeUntilAiring)}{" "}
              </span>
            ) : (
              "Continue"
            )
          ) : (
            "Watch Now"
          )}
        </button>
        <div className="flex gap-2">
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
          <button
            type="button"
            className="flex-center group relative w-10 h-10 bg-secondary rounded-full"
            onClick={handleShareClick}
          >
            <span className="absolute pointer-events-none z-40 opacity-0 -translate-y-8 group-hover:-translate-y-10 group-hover:opacity-100 font-karla shadow-tersier shadow-md whitespace-nowrap bg-secondary px-2 py-1 rounded transition-all duration-200 ease-out">
              Share Anime
            </span>
            <ShareIcon className="w-5 h-5" />
          </button>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={`https://anilist.co/anime/${info.id}`}
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
        </div>
      </div>

      <div className="md:hidden flex gap-2 items-center justify-center w-[90%]">
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
        <button
          // href={watchUrl || ""}
          type="button"
          // disabled={!watchUrl || info?.nextAiringEpisode}
          onClick={() => router.push(watchUrl)}
          className={`${
            !watchUrl ? "opacity-30 pointer-events-none" : ""
          } flex items-center text-lg font-karla font-semibold gap-1 border-black border-opacity-10 text-black rounded-full py-2 px-4 bg-white`}
        >
          <PlayIcon className="w-5 h-5" />
          {progress > 0 ? (
            statuses?.value === "COMPLETED" ? (
              "Rewatch"
            ) : !watchUrl && info?.nextAiringEpisode ? (
              <span>
                {convertSecondsToTime(info.nextAiringEpisode.timeUntilAiring)}{" "}
              </span>
            ) : (
              "Continue"
            )
          ) : (
            "Watch Now"
          )}
        </button>
        <button
          type="button"
          className="flex-center group relative w-10 h-10 bg-secondary rounded-full"
          onClick={handleShareClick}
        >
          <span className="absolute pointer-events-none z-40 opacity-0 -translate-y-8 group-hover:-translate-y-10 group-hover:opacity-100 font-karla shadow-tersier shadow-md whitespace-nowrap bg-secondary px-2 py-1 rounded transition-all duration-200 ease-out">
            Share Anime
          </span>
          <ShareIcon className="w-5 h-5" />
        </button>
      </div>

      {info.nextAiringEpisode?.timeUntilAiring && (
        <p className="md:hidden">
          Episode {info.nextAiringEpisode.episode} in{" "}
          <span className="font-bold">
            {convertSecondsToTime(info.nextAiringEpisode.timeUntilAiring)}{" "}
          </span>
        </p>
      )}

      {info?.description && (
        <Description
          info={info}
          readMore={readMore}
          setReadMore={setReadMore}
          className="md:hidden"
        />
      )}

      <InfoChip
        info={info}
        color={color}
        className={`${readMore ? "flex" : "hidden"} md:hidden`}
      />

      {info?.relations?.edges?.length > 0 && (
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
                          alt={rel.id}
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
