import { signIn, signOut, useSession } from "next-auth/react";
import { getCurrentSeason } from "../../utils/getTimes";
import Link from "next/link";
// import {  } from "@heroicons/react/24/solid";
import { useSearch } from "../../lib/hooks/isOpenState";
import Image from "next/image";
import { UserIcon } from "@heroicons/react/20/solid";
import { useRouter } from "next/router";

export default function Navigasi() {
  const { data: sessions, status } = useSession();
  const year = new Date().getFullYear();
  const season = getCurrentSeason();

  const router = useRouter();

  const { setIsOpen } = useSearch();

  return (
    <>
      {/* NAVBAR PC */}
      <div className="flex items-center justify-center">
        <div className="flex w-full items-center justify-between px-5 lg:mx-[94px] lg:pt-7">
          <div className="flex items-center lg:gap-16">
            <Link
              href="/en/"
              className=" font-outfit lg:text-[40px] text-[30px] font-bold text-[#FF7F57]"
            >
              moopa
            </Link>
            <ul className="hidden items-center gap-10 pt-2 font-outfit text-[14px] lg:flex">
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

              {status === "loading" ? (
                <li>Loading...</li>
              ) : (
                <>
                  {!sessions && (
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
                  {sessions && (
                    <li className="text-center">
                      <Link
                        href={`/en/profile/${sessions?.user.name}`}
                        className="hover:text-action/80 transition-all duration-150 ease-linear"
                      >
                        My List
                      </Link>
                    </li>
                  )}
                </>
              )}
            </ul>
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
            {sessions ? (
              <button
                type="button"
                onClick={() =>
                  router.push(`/en/profile/${sessions?.user.name}`)
                }
                className="w-7 h-7 relative flex flex-col items-center group"
              >
                <Image
                  src={sessions?.user.image.large}
                  alt="avatar"
                  width={50}
                  height={50}
                  className="w-full h-full object-cover"
                />
                <div className="hidden absolute z-50 w-28 text-center -bottom-20 text-white shadow-2xl opacity-0 bg-secondary p-1 py-2 rounded-md font-karla font-light invisible group-hover:visible group-hover:opacity-100 duration-300 transition-all md:grid place-items-center gap-1">
                  <Link
                    href={`/en/profile/${sessions?.user.name}`}
                    className="hover:text-action"
                  >
                    Profile
                  </Link>
                  <div
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="hover:text-action cursor-pointer"
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
                <UserIcon className="w-full h-full translate-y-2 text-white/50" />
              </button>
            )}
            {/* </div> */}
          </div>
        </div>
      </div>
    </>
  );
}
