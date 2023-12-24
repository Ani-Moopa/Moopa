import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { CalendarIcon, HomeIcon } from "@heroicons/react/24/outline";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

type MobileNavProps = {
  hideProfile?: boolean;
};

export default function MobileNav({ hideProfile = false }: MobileNavProps) {
  const { data: sessions }: { data: any } = useSession();
  const [isVisible, setIsVisible] = useState(false);

  const handleShowClick = () => {
    setIsVisible(true);
  };

  const handleHideClick = () => {
    setIsVisible(false);
  };
  return (
    <>
      {/* NAVBAR */}
      <div className="z-[1000]">
        {!isVisible && (
          <button
            onClick={handleShowClick}
            className="fixed bottom-[30px] right-[20px] z-[100] flex h-[51px] w-[50px] cursor-pointer items-center justify-center rounded-[8px] bg-[#17171f] shadow-lg lg:hidden"
            id="bars"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-[42px] w-[61.5px] text-white/60 fill-orange-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Mobile Menu */}
      <div
        className={`transition-all duration-150 subpixel-antialiased z-[500]`}
      >
        {isVisible && sessions && !hideProfile && (
          <Link
            href={`/en/profile/${sessions?.user?.name}`}
            className="fixed lg:hidden bottom-[100px] w-[60px] h-[60px] flex items-center justify-center right-[20px] rounded-full z-50 bg-[#17171f]"
          >
            <Image
              src={sessions?.user?.image?.large}
              alt="user avatar"
              width={60}
              height={60}
              className="object-cover w-[60px] h-[60px] rounded-full"
            />
          </Link>
        )}
        {isVisible && (
          <div className="fixed bottom-[30px] right-[20px] z-[500] flex h-[51px] px-5 items-center justify-center gap-8 rounded-[8px] text-[11px] bg-[#17171f] shadow-lg lg:hidden">
            <div className="flex items-center gap-5">
              <button className="group flex flex-col items-center">
                <Link href="/en/">
                  <HomeIcon className="w-6 h-6 group-hover:text-action" />
                </Link>
                <Link
                  href="/en/"
                  className="font-karla font-bold text-white/60 group-hover:text-action"
                >
                  home
                </Link>
              </button>
              <button className="group flex flex-col items-center gap-[1px]">
                <Link href="/en/schedule">
                  <CalendarIcon className="w-6 h-6 group-hover:text-action" />
                </Link>
                <Link
                  href="/en/schedule"
                  className="font-karla font-bold text-white/60 group-hover:text-action"
                >
                  schedule
                </Link>
              </button>
              <button className="group flex gap-[1px] flex-col items-center">
                <Link href="/en/search/anime">
                  <MagnifyingGlassIcon className="w-6 h-6 group-hover:text-action" />
                </Link>

                <Link
                  href="/en/search/anime"
                  className="font-karla font-bold text-white/60 group-hover:text-action"
                >
                  search
                </Link>
              </button>
              {sessions ? (
                <button
                  onClick={() => signOut({ redirect: true })}
                  className="group flex gap-[1.5px] flex-col items-center "
                >
                  <div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 96 960 960"
                      className="group-hover:fill-action w-6 h-6 fill-txt"
                    >
                      <path d="M186.666 936q-27 0-46.833-19.833T120 869.334V282.666q0-27 19.833-46.833T186.666 216H474v66.666H186.666v586.668H474V936H186.666zm470.668-176.667l-47-48 102-102H370v-66.666h341.001l-102-102 46.999-48 184 184-182.666 182.666z"></path>
                    </svg>
                  </div>
                  <h1 className="font-karla font-bold text-white/60 group-hover:text-action">
                    logout
                  </h1>
                </button>
              ) : (
                <button
                  onClick={() => signIn("AniListProvider")}
                  className="group flex gap-[1.5px] flex-col items-center "
                >
                  <div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 96 960 960"
                      className="group-hover:fill-action w-6 h-6 fill-txt mr-2"
                    >
                      <path d="M486 936v-66.666h287.334V282.666H486V216h287.334q27 0 46.833 19.833T840 282.666v586.668q0 27-19.833 46.833T773.334 936H486zm-78.666-176.667l-47-48 102-102H120v-66.666h341l-102-102 47-48 184 184-182.666 182.666z"></path>
                    </svg>
                  </div>
                  <h1 className="font-karla font-bold text-white/60 group-hover:text-action">
                    login
                  </h1>
                </button>
              )}
            </div>
            <button onClick={handleHideClick}>
              <svg
                width="20"
                height="21"
                className="fill-orange-500"
                viewBox="0 0 20 21"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="2.44043"
                  y="0.941467"
                  width="23.5842"
                  height="3.45134"
                  rx="1.72567"
                  transform="rotate(45 2.44043 0.941467)"
                />
                <rect
                  x="19.1172"
                  y="3.38196"
                  width="23.5842"
                  height="3.45134"
                  rx="1.72567"
                  transform="rotate(135 19.1172 3.38196)"
                />
              </svg>
            </button>
          </div>
        )}
      </div>
    </>
  );
}
