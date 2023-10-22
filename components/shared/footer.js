import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { parseCookies, setCookie } from "nookies";
import Image from "next/image";

function Footer() {
  const [year] = useState(new Date().getFullYear());
  const [season] = useState(getCurrentSeason());

  const [lang, setLang] = useState("en");
  const [checked, setChecked] = useState(false);
  const [cookie, setCookies] = useState(null);

  const router = useRouter();

  useEffect(() => {
    let lang = null;
    if (!cookie) {
      const cookie = parseCookies();
      lang = cookie.lang || null;
      setCookies(cookie);
    }
    if (lang === "en" || lang === null) {
      setLang("en");
      setChecked(false);
    } else if (lang === "id") {
      setLang("id");
      setChecked(true);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function switchLang() {
    setChecked(!checked);
    if (checked) {
      console.log("switching to en");
      setCookie(null, "lang", "en", {
        maxAge: 365 * 24 * 60 * 60,
        path: "/",
      });
      router.push("/en");
    } else {
      router.push("/id");
    }
  }

  return (
    <footer className="flex-col w-full">
      <div className="text-[#dbdcdd] z-40 bg-[#0c0d10] lg:flex lg:h-[12rem] w-full lg:items-center lg:justify-between">
        <div className="mx-auto flex w-[90%] lg:w-[95%] xl:w-[80%] flex-col space-y-10 py-6 lg:flex-row lg:items-center lg:justify-between lg:space-y-0 lg:py-0">
          <div className="flex flex-col gap-2">
            {/* <div className="flex items-center gap-2"> */}
            {/* <Image
                src="/svg/c.svg"
                alt="Website Logo"
                width={100}
                height={100}
                className="w-10 h-10"
              /> */}
            <div className="flex gap-2 font-outfit text-4xl">moopa</div>
            <p className="font-karla lg:text-[0.8rem] text-[0.65rem] text-[#9c9c9c]  lg:w-[520px] italic">
              This site does not store any files on our server, we only linked
              to the media which is hosted on 3rd party services.
            </p>
            {/* </div> */}
          </div>
          <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:gap-[9.06rem] text-[#a7a7a7] text-sm lg:text-end">
            <div className="flex flex-col gap-10 font-karla font-bold lg:flex-row lg:gap-[5.94rem]">
              <ul className="flex flex-col gap-y-[0.7rem] ">
                <li className="cursor-pointer hover:text-action">
                  <Link
                    href={`/${lang}/search/anime?season=${season}&year=${year}`}
                  >
                    This Season
                  </Link>
                </li>
                <li className="cursor-pointer hover:text-action">
                  <Link href={`/${lang}/search/anime`}>Popular Anime</Link>
                </li>
                <li className="cursor-pointer hover:text-action">
                  <Link href={`/${lang}/search/manga`}>Popular Manga</Link>
                </li>
                <li className="cursor-pointer hover:text-action">
                  <Link href={`/donate`}>Donate</Link>
                </li>
              </ul>
              <ul className="flex flex-col gap-y-[0.7rem]">
                <li className="cursor-pointer hover:text-action">
                  <Link href={`/${lang}/search/anime?format=MOVIE`}>
                    Movies
                  </Link>
                </li>
                <li className="cursor-pointer hover:text-action">
                  <Link href={`/${lang}/search/anime?format=TV`}>TV Shows</Link>
                </li>
                <li className="cursor-pointer hover:text-action">
                  <Link href={`/${lang}/dmca`}>DMCA</Link>
                </li>
                <li className="cursor-pointer hover:text-action">
                  <Link href="https://github.com/DevanAbinaya/Ani-Moopa">
                    Github
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-tersier border-t border-white/5">
        <div className="mx-auto flex w-[90%] lg:w-[95%] xl:w-[80%] flex-col pb-6 lg:flex-row lg:items-center lg:justify-between lg:space-y-0 lg:py-0">
          <p className="flex items-center gap-1 font-karla lg:text-[0.81rem] text-[0.7rem] text-[#CCCCCC] py-3">
            &copy; {new Date().getFullYear()} moopa.live | Website Made by{" "}
            <span className="text-white font-bold">Factiven</span>
          </p>
          <div className="flex items-center gap-5">
            {/* Github Icon */}
            <Link
              href="https://github.com/Ani-Moopa/Moopa"
              className="w-5 h-5 hover:opacity-75"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="#fff"
                viewBox="0 0 20 20"
              >
                <g>
                  <g
                    fill="none"
                    fillRule="evenodd"
                    stroke="none"
                    strokeWidth="1"
                  >
                    <g fill="#fff" transform="translate(-140 -7559)">
                      <g transform="translate(56 160)">
                        <path d="M94 7399c5.523 0 10 4.59 10 10.253 0 4.529-2.862 8.371-6.833 9.728-.507.101-.687-.219-.687-.492 0-.338.012-1.442.012-2.814 0-.956-.32-1.58-.679-1.898 2.227-.254 4.567-1.121 4.567-5.059 0-1.12-.388-2.034-1.03-2.752.104-.259.447-1.302-.098-2.714 0 0-.838-.275-2.747 1.051a9.396 9.396 0 00-2.505-.345 9.375 9.375 0 00-2.503.345c-1.911-1.326-2.751-1.051-2.751-1.051-.543 1.412-.2 2.455-.097 2.714-.639.718-1.03 1.632-1.03 2.752 0 3.928 2.335 4.808 4.556 5.067-.286.256-.545.708-.635 1.371-.57.262-2.018.715-2.91-.852 0 0-.529-.985-1.533-1.057 0 0-.975-.013-.068.623 0 0 .655.315 1.11 1.5 0 0 .587 1.83 3.369 1.21.005.857.014 1.665.014 1.909 0 .271-.184.588-.683.493-3.974-1.355-6.839-5.199-6.839-9.729 0-5.663 4.478-10.253 10-10.253"></path>
                      </g>
                    </g>
                  </g>
                </g>
              </svg>
            </Link>
            {/* Discord Icon */}
            <Link
              href="https://discord.gg/v5fjSdKwr2"
              className="w-6 h-6 hover:opacity-75"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="xMidYMid"
                viewBox="0 -28.5 256 256"
              >
                <path
                  fill="#fff"
                  d="M216.856 16.597A208.502 208.502 0 00164.042 0c-2.275 4.113-4.933 9.645-6.766 14.046-19.692-2.961-39.203-2.961-58.533 0-1.832-4.4-4.55-9.933-6.846-14.046a207.809 207.809 0 00-52.855 16.638C5.618 67.147-3.443 116.4 1.087 164.956c22.169 16.555 43.653 26.612 64.775 33.193A161.094 161.094 0 0079.735 175.3a136.413 136.413 0 01-21.846-10.632 108.636 108.636 0 005.356-4.237c42.122 19.702 87.89 19.702 129.51 0a131.66 131.66 0 005.355 4.237 136.07 136.07 0 01-21.886 10.653c4.006 8.02 8.638 15.67 13.873 22.848 21.142-6.58 42.646-16.637 64.815-33.213 5.316-56.288-9.08-105.09-38.056-148.36zM85.474 135.095c-12.645 0-23.015-11.805-23.015-26.18s10.149-26.2 23.015-26.2c12.867 0 23.236 11.804 23.015 26.2.02 14.375-10.148 26.18-23.015 26.18zm85.051 0c-12.645 0-23.014-11.805-23.014-26.18s10.148-26.2 23.014-26.2c12.867 0 23.236 11.804 23.015 26.2 0 14.375-10.148 26.18-23.015 26.18z"
                ></path>
              </svg>
            </Link>

            {/* Kofi */}
            <Link href="/donate" className="w-6 h-6 hover:opacity-75">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="#fff"
                viewBox="0 0 24 24"
              >
                <path d="M23.881 8.948c-.773-4.085-4.859-4.593-4.859-4.593H.723c-.604 0-.679.798-.679.798s-.082 7.324-.022 11.822c.164 2.424 2.586 2.672 2.586 2.672s8.267-.023 11.966-.049c2.438-.426 2.683-2.566 2.658-3.734 4.352.24 7.422-2.831 6.649-6.916zm-11.062 3.511c-1.246 1.453-4.011 3.976-4.011 3.976s-.121.119-.31.023c-.076-.057-.108-.09-.108-.09-.443-.441-3.368-3.049-4.034-3.954-.709-.965-1.041-2.7-.091-3.71.951-1.01 3.005-1.086 4.363.407 0 0 1.565-1.782 3.468-.963 1.904.82 1.832 3.011.723 4.311zm6.173.478c-.928.116-1.682.028-1.682.028V7.284h1.77s1.971.551 1.971 2.638c0 1.913-.985 2.667-2.059 3.015z"></path>
              </svg>
            </Link>

            <label
              className="flex items-center relative w-max cursor-pointer select-none text-txt"
              title="Switch to ID"
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => switchLang()}
                className="appearance-none transition-colors cursor-pointer w-14 h-5 rounded-full focus:outline-none  focus:ring-offset-2 focus:ring-offset-black focus:ring-action bg-secondary"
              />
              <span className="absolute font-medium text-xs uppercase right-2 text-action">
                {" "}
                EN{" "}
              </span>
              <span className="absolute font-medium text-xs uppercase right-[2.1rem] text-action">
                {" "}
                ID{" "}
              </span>
              <span className="w-6 h-6 right-[2.1rem] absolute rounded-full transform transition-transform bg-gray-200" />
            </label>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

function getCurrentSeason() {
  const now = new Date();
  const month = now.getMonth() + 1; // getMonth() returns 0-based index

  switch (month) {
    case 12:
    case 1:
    case 2:
      return "WINTER";
    case 3:
    case 4:
    case 5:
      return "SPRING";
    case 6:
    case 7:
    case 8:
      return "SUMMER";
    case 9:
    case 10:
    case 11:
      return "FALL";
    default:
      return "UNKNOWN SEASON";
  }
}
