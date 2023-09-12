import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";
import { parseCookies } from "nookies";
import MobileNav from "./shared/MobileNav";

function Navbar(props) {
  const { data: session, status } = useSession();
  const [isVisible, setIsVisible] = useState(false);
  const [fade, setFade] = useState(false);

  const [lang, setLang] = useState("en");
  const [cookie, setCookies] = useState(null);

  const handleShowClick = () => {
    setIsVisible(true);
    setFade(true);
  };

  const handleHideClick = () => {
    setIsVisible(false);
    setFade(false);
  };

  useEffect(() => {
    let lang = null;
    if (!cookie) {
      const cookie = parseCookies();
      lang = cookie.lang || null;
      setCookies(cookie);
    }
    if (lang === "en" || lang === null) {
      setLang("en");
    } else if (lang === "id") {
      setLang("id");
    }
  }, []);

  // console.log(session.user?.image);

  return (
    <header className={`${props.className}`}>
      <div className="flex h-16 w-auto items-center justify-between px-5 lg:mx-auto lg:w-[80%] lg:px-0 text-[#dbdcdd]">
        <div className="pb-2 font-outfit text-4xl font-semibold lg:block text-white">
          <Link href={`/${lang}/`}>moopa</Link>
        </div>

        <MobileNav sessions={session} />

        <nav className="left-0 top-[-100%] hidden w-auto items-center gap-10 px-5 lg:flex">
          <ul className="hidden gap-10 font-roboto text-md lg:flex items-center relative">
            <li>
              <Link
                href={`/${lang}/`}
                className="p-2 transition-all duration-100 hover:text-orange-600"
              >
                home
              </Link>
            </li>
            <li>
              <Link
                href={`/${lang}/about`}
                className="p-2 transition-all duration-100 hover:text-orange-600"
              >
                about
              </Link>
            </li>
            <li>
              <Link
                href={`/${lang}/search/anime`}
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
                        href={`/${lang}/profile/${session?.user.name}`}
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
