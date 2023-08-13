import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getCurrentSeason } from "../../utils/getTimes";
import Link from "next/link";


export default function Navigasi() {
  const { data: sessions, status } = useSession();
  const [year, setYear] = useState(new Date().getFullYear());
  const [season, setSeason] = useState(getCurrentSeason());

  const router = useRouter();

  const handleFormSubmission = (inputValue) => {
    router.push(`/en/search/${encodeURIComponent(inputValue)}`);
  };

  const handleKeyDown = async (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      const inputValue = event.target.value;
      handleFormSubmission(inputValue);
    }
  };
  return (
    <>
      {/* NAVBAR PC */}
      <div className="flex items-center justify-center">
        <div className="flex w-full items-center justify-between px-5 lg:mx-[94px]">
          <div className="flex items-center lg:gap-16 lg:pt-7">
            <Link
              href="/en/"
              className=" font-outfit lg:text-[40px] text-[30px] font-bold text-[##cbd1a0]"
            >
              Madara
            </Link>
            <ul className="hidden items-center gap-10 pt-2 font-outfit text-[20px] lg:flex">
              <li>
                <Link
                  href={`/en/search/anime?season=${season}&seasonYear=${year}`}
                >
                  This Season
                </Link>
              </li>
              <li>
                <Link href="/en/search/manga">Manga</Link>
              </li>
              <li>
                <Link href="/en/search/anime">Anime</Link>
              </li>

              {status === "loading" ? (
                <li>Loading...</li>
              ) : (
                <>
                  {!sessions && (
                    <li>
                      <button
                        onClick={() => signIn("AniListProvider")}
                        className="ring-1 ring-action font-karla font-bold px-2 py-1 rounded-md"
                      >
                        Sign in
                      </button>
                    </li>
                  )}
                  {sessions && (
                    <li className="text-center">
                      <Link href={`/en/profile/${sessions?.user.name}`}>
                        My List
                      </Link>
                    </li>
                  )}
                </>
              )}
            </ul>
          </div>
          <div className="relative flex lg:scale-75 scale-[65%] items-center mb-7 lg:mb-1">
            <div className="search-box ">
              <input
                className="search-text"
                type="text"
                placeholder="Search Anime"
                onKeyDown={handleKeyDown}
              />
              <div className="search-btn">
                <i className="fas fa-search"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
