import Twitter from "./media/twitter";
import Instagram from "./media/instagram";
import Link from "next/link";
import Image from "next/image";
import { signIn, useSession } from "next-auth/react";
import { useState } from "react";

function Footer() {
  const { data: session, status } = useSession();
  const [year, setYear] = useState(new Date().getFullYear());
  const [season, setSeason] = useState(getCurrentSeason());

  return (
    <section className="text-[#dbdcdd] z-40 bg-[#0c0d10] md:flex md:h-[12rem] md:items-center md:justify-between">
      <div className="mx-auto flex w-[80%] flex-col space-y-10 pb-6 md:flex-row md:items-center md:justify-between md:space-y-0 md:py-0">
        <div className="flex items-center gap-24">
          <div className="md:flex grid items-center md:gap-10 gap-3">
            {/* <h1 className="font-outfit text-[2.56rem]">moopa</h1> */}
            <h1 className="font-outfit text-[40px]">moopa</h1>
            <div>
              <p className="flex items-center gap-1 font-karla md:text-[0.81rem] text-[0.7rem] text-[#CCCCCC]">
                &copy; {new Date().getFullYear()} moopa.live | Website Made by
                Factiven
              </p>
              <p className="font-karla md:text-[0.8rem] text-[0.65rem] text-[#9c9c9c]  md:w-[520px] italic">
                This site does not store any files on our server, we only linked
                to the media which is hosted on 3rd party services.
              </p>
            </div>
          </div>
          {/* <div className="lg:hidden md:block">
            <Image
              src="https://i1210.photobucket.com/albums/cc417/kusanagiblog/NarutoVSSasuke.gif"
              alt="gambar"
              title="request nya rapip yulistian"
              width={210}
              height={85}
            />
          </div> */}
        </div>
        <div className="flex flex-col gap-10 md:flex-row md:items-end md:gap-[9.06rem] text-[#a7a7a7] text-sm md:text-end">
          <div className="flex flex-col gap-10 font-karla font-bold md:flex-row md:gap-[5.94rem]">
            <ul className="flex flex-col gap-y-[0.7rem] ">
              <li className="cursor-pointer hover:text-action">
                <Link
                  href={`/search/anime?season=${season}&seasonYear=${year}`}
                >
                  This Season
                </Link>
              </li>
              <li className="cursor-pointer hover:text-action">
                <Link href="/search/anime">Popular Anime</Link>
              </li>
              <li className="cursor-pointer hover:text-action">
                <Link href="/search/manga">Popular Manga</Link>
              </li>
              {status === "loading" ? (
                <p>Loading...</p>
              ) : session ? (
                <li className="cursor-pointer hover:text-action">
                  <Link href={`/profile/${session?.user?.name}`}>My List</Link>
                </li>
              ) : (
                <li className="hover:text-action">
                  <button onClick={() => signIn("AniListProvider")}>
                    Login
                  </button>
                </li>
              )}
            </ul>
            <ul className="flex flex-col gap-y-[0.7rem]">
              <li className="cursor-pointer hover:text-action">
                <Link href="/search/anime">Movies</Link>
              </li>
              <li className="cursor-pointer hover:text-action">
                <Link href="/search/anime">TV Shows</Link>
              </li>
              <li className="cursor-pointer hover:text-action">
                <Link href="/dmca">DMCA</Link>
              </li>
              <li className="cursor-pointer hover:text-action">
                <Link href="/contact">Contact</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
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
