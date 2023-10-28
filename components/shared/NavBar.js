import { useSearch } from "@/lib/context/isOpenState";
import { getCurrentSeason } from "@/utils/getTimes";
import { ArrowLeftIcon, ArrowUpCircleIcon } from "@heroicons/react/20/solid";
import { UserIcon } from "@heroicons/react/24/solid";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const getScrollPosition = (el = window) => ({
  x: el.pageXOffset !== undefined ? el.pageXOffset : el.scrollLeft,
  y: el.pageYOffset !== undefined ? el.pageYOffset : el.scrollTop,
});

export function NewNavbar({
  info,
  scrollP = 200,
  toTop = false,
  withNav = false,
  paddingY = "py-3",
  home = false,
  back = false,
  manga = false,
  shrink = false,
}) {
  const { data: session } = useSession();
  const router = useRouter();
  const [scrollPosition, setScrollPosition] = useState();
  const { setIsOpen } = useSearch();

  const year = new Date().getFullYear();
  const season = getCurrentSeason();

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
        className={`${home ? "" : "fixed"} z-[200] top-0 px-5 w-full ${
          scrollPosition?.y >= scrollP
            ? home
              ? ""
              : `bg-tersier shadow-tersier shadow-sm ${
                  shrink ? "py-1" : `${paddingY}`
                }`
            : `${paddingY}`
        } transition-all duration-200 ease-linear`}
      >
        <div
          className={`flex items-center justify-between mx-auto ${
            home ? "lg:max-w-[90%] gap-10" : "max-w-screen-2xl"
          }`}
        >
          <div
            className={`flex items-center ${
              withNav ? `${home ? "" : "w-[20%]"} gap-8` : " w-full gap-4"
            }`}
          >
            {info ? (
              <>
                <button
                  type="button"
                  className="flex-center w-7 h-7 text-white"
                  onClick={() => {
                    back
                      ? router.back()
                      : manga
                      ? router.push("/en/search/manga")
                      : router.push("/en");
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
                className={`flex-center font-outfit font-semibold pb-2 ${
                  home ? "text-4xl text-action" : "text-white text-3xl"
                }`}
              >
                moopa
              </Link>
            )}
          </div>

          {withNav && (
            <ul
              className={`hidden w-full items-center gap-10 pt-2 font-outfit text-[14px] lg:pt-0 lg:flex ${
                home ? "justify-start" : "justify-center"
              }`}
            >
              <li>
                <Link
                  href={`/en/search/anime?season=${season}&year=${year}`}
                  className="hover:text-action/80 transition-all duration-150 ease-linear"
                >
                  This Season
                </Link>
              </li>
              <li>
                <Link
                  href="/en/search/manga"
                  className="hover:text-action/80 transition-all duration-150 ease-linear"
                >
                  Manga
                </Link>
              </li>
              <li>
                <Link
                  href="/en/search/anime"
                  className="hover:text-action/80 transition-all duration-150 ease-linear"
                >
                  Anime
                </Link>
              </li>
              <li>
                <Link
                  href="/en/schedule"
                  className="hover:text-action/80 transition-all duration-150 ease-linear"
                >
                  Schedule
                </Link>
              </li>

              {!session && (
                <li>
                  <button
                    onClick={() => signIn("AniListProvider")}
                    className="hover:text-action/80 transition-all duration-150 ease-linear"
                    // className="px-2 py-1 ring-1 ring-action font-bold font-karla rounded-md"
                  >
                    Sign In
                  </button>
                </li>
              )}
              {session && (
                <li className="text-center">
                  <Link
                    href={`/en/profile/${session?.user.name}`}
                    className="hover:text-action/80 transition-all duration-150 ease-linear"
                  >
                    My List
                  </Link>
                </li>
              )}
            </ul>
          )}

          <div className="flex w-[20%] justify-end items-center gap-4">
            <button
              type="button"
              title="Search"
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
              <div className="w-7 h-7 relative flex flex-col items-center group shrink-0">
                <button
                  type="button"
                  onClick={() =>
                    router.push(`/en/profile/${session?.user.name}`)
                  }
                  className="rounded-full bg-white/30 overflow-hidden"
                >
                  <Image
                    src={session?.user.image.large}
                    alt="avatar"
                    width={50}
                    height={50}
                    className="w-full h-full object-cover"
                  />
                </button>
                <div className="hidden absolute z-50 w-28 text-center -bottom-20 text-white shadow-2xl opacity-0 bg-secondary p-1 py-2 rounded-md font-karla font-light invisible group-hover:visible group-hover:opacity-100 duration-300 transition-all md:grid place-items-center gap-1">
                  <Link
                    href={`/en/profile/${session?.user.name}`}
                    className="hover:text-action"
                  >
                    Profile
                  </Link>
                  <button
                    type="button"
                    onClick={() => signOut("AniListProvider")}
                    className="hover:text-action"
                  >
                    Log out
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => signIn("AniListProvider")}
                title="Login With AniList"
                className="w-7 h-7 bg-white/30 rounded-full overflow-hidden shrink-0"
              >
                <UserIcon className="w-full h-full translate-y-1" />
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
