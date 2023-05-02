import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";

function Navbar(props) {
  const { data: session, status } = useSession();
  const [isVisible, setIsVisible] = useState(false);
  const [fade, setFade] = useState(false);
  const { systemTheme, theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleShowClick = () => {
    setIsVisible(true);
    setFade(true);
  };

  const handleHideClick = () => {
    setIsVisible(false);
    setFade(false);
  };

  // console.log(session.user?.image);

  return (
    <header className={`${props.className}`}>
      <div className="flex h-16 w-auto items-center justify-between px-5 lg:mx-auto lg:w-[80%] lg:px-0 text-[#dbdcdd]">
        <div className="pb-2 font-outfit text-4xl font-semibold lg:block text-white">
          <Link href="/">moopa</Link>
        </div>

        {/* Mobile Hamburger */}
        {!isVisible && (
          <button
            onClick={handleShowClick}
            className="fixed bottom-[30px] right-[20px] z-[100] flex h-[51px] w-[50px] cursor-pointer items-center justify-center rounded-[8px] bg-[#17171f] shadow-lg lg:hidden"
            id="bars"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-[42px] w-[61.5px] text-[#8BA0B2] fill-orange-500"
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

        {/* Mobile Menu */}
        <div
          className={`transition-all duration-150 ${
            fade ? "opacity-100" : "opacity-0"
          } z-50`}
        >
          {isVisible && session && (
            <Link
              href={`/profile/${session?.user?.name}`}
              className="fixed lg:hidden bottom-[100px] w-[60px] h-[60px] flex items-center justify-center right-[20px] rounded-full z-50 bg-[#17171f]"
            >
              <Image
                src={session?.user.image.large}
                alt="user avatar"
                height={500}
                width={500}
                className="object-cover w-[60px] h-[60px] rounded-full"
              />
            </Link>
          )}
          {isVisible && (
            <div className="fixed bottom-[30px] right-[20px] z-50 flex h-[51px] w-[300px] items-center justify-center gap-8 rounded-[8px] text-[11px] bg-[#17171f] shadow-lg lg:hidden">
              <div className="grid grid-cols-4 place-items-center gap-6">
                <button className="group flex flex-col items-center">
                  <Link href="/" className="">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6 group-hover:stroke-action"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                      />
                    </svg>
                  </Link>
                  <Link
                    href="/"
                    className="font-karla font-bold text-[#8BA0B2] group-hover:text-action"
                  >
                    home
                  </Link>
                </button>
                <button className="group flex flex-col items-center">
                  <Link href="/about">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6 group-hover:stroke-action"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                      />
                    </svg>
                  </Link>
                  <Link
                    href="/about"
                    className="font-karla font-bold text-[#8BA0B2] group-hover:text-action"
                  >
                    about
                  </Link>
                </button>
                <button className="group flex gap-[1.5px] flex-col items-center ">
                  <div>
                    <Link href="/search/anime">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6 group-hover:stroke-action"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                        />
                      </svg>
                    </Link>
                  </div>
                  <Link
                    href="/search/anime"
                    className="font-karla font-bold text-[#8BA0B2] group-hover:text-action"
                  >
                    search
                  </Link>
                </button>
                {session ? (
                  <button
                    onClick={() => signOut("AniListProvider")}
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
                    <h1 className="font-karla font-bold text-[#8BA0B2] group-hover:text-action">
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
                    <h1 className="font-karla font-bold text-[#8BA0B2] group-hover:text-action">
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

        <nav className="left-0 top-[-100%] hidden w-auto items-center gap-10 px-5 lg:flex">
          <ul className="hidden gap-10 font-roboto text-md lg:flex items-center relative">
            <li>
              <Link
                href="/"
                className="p-2 transition-all duration-100 hover:text-orange-600"
              >
                home
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className="p-2 transition-all duration-100 hover:text-orange-600"
              >
                about
              </Link>
            </li>
            <li>
              <Link
                href="/search/anime"
                className="p-2 transition-all duration-100 hover:text-orange-600"
              >
                search
              </Link>
            </li>
            {status === "loading" ? (
              <li>Loading...</li>
            ) : (
              <>
                {!session && (
                  <li>
                    <button
                      onClick={() => signIn("AniListProvider")}
                      className="ring-1 ring-action font-karla font-bold px-2 py-1 rounded-md"
                    >
                      Sign in
                    </button>
                  </li>
                )}
                {session && (
                  <li className="flex items-center justify-center group ">
                    <button>
                      <Image
                        src={session?.user.image.large}
                        alt="imagine"
                        width={500}
                        height={500}
                        className="object-cover h-10 w-10 rounded-full"
                      />
                    </button>
                    <div className="absolute z-50 w-28 text-center -bottom-20 text-white shadow-2xl opacity-0 bg-secondary p-1 py-2 rounded-md font-karla font-light invisible group-hover:visible group-hover:opacity-100 duration-300 transition-all grid place-items-center gap-1">
                      <Link
                        href={`/profile/${session?.user.name}`}
                        className="hover:text-action"
                      >
                        Profile
                      </Link>
                      <button
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="hover:text-action"
                      >
                        Log out
                      </button>
                    </div>
                    {/* My List */}
                  </li>
                )}
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
