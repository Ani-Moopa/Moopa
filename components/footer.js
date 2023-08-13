import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { parseCookies, setCookie } from "nookies";

function Footer() {
  const { data: session, status } = useSession();
  const [year, setYear] = useState(new Date().getFullYear());
  const [season, setSeason] = useState(getCurrentSeason());


  const [checked, setChecked] = useState(false);
  const [cookie, setCookies] = useState(null);

  const router = useRouter();


  return (
    <section className="text-[#dbdcdd] z-40 bg-[#0c0d10] lg:flex lg:h-[12rem] w-full lg:items-center lg:justify-between">
      <div className="mx-auto flex w-[80%] lg:w-[95%] xl:w-[80%] flex-col space-y-10 pb-6 lg:flex-row lg:items-center lg:justify-between lg:space-y-0 lg:py-0">
        <div className="flex items-center gap-24">
          <div className="lg:flex grid items-center lg:gap-10 gap-3">
            {/* <h1 className="font-outfit text-[2.56rem]">Madara</h1> */}
            <h1 className="font-outfit text-[40px]">Madara</h1>
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-1">
                <p className="flex items-center gap-1 font-karla lg:text-[0.81rem] text-[0.7rem] text-[#CCCCCC]">
                  &copy; {new Date().getFullYear()} Madara.to | Website Made by Guzma with love ❤️
                </p>
                <p className="font-karla lg:text-[0.8rem] text-[0.65rem] text-[#9c9c9c]  lg:w-[520px] italic">
                  This site does not store any files on our server, we only
                  linked to the media which is hosted on 3rd party services.
                </p>
              </div>
            </div>
          </div>
          {/* <div className="lg:hidden lg:block">
            <Image
              src="https://i1210.photobucket.com/albums/cc417/kusanagiblog/NarutoVSSasuke.gif"
              alt="gambar"
              title="request nya rapip yulistian"
              width={210}
              height={85}
            />
          </div> */}
        </div>
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:gap-[9.06rem] text-[#a7a7a7] text-sm lg:text-end">
          <div className="flex flex-col gap-10 font-karla font-bold lg:flex-row lg:gap-[5.94rem]">
            <ul className="flex flex-col gap-y-[0.7rem] ">
              <li className="cursor-pointer hover:text-action">
                <Link
                  href={`/en/search/anime?season=${season}&seasonYear=${year}`}
                >
                  This Season
                </Link>
              </li>
              <li className="cursor-pointer hover:text-action">
                <Link href={`/en/search/anime`}>Popular Anime</Link>
              </li>
              <li className="cursor-pointer hover:text-action">
                <Link href={`/en/search/manga`}>Popular Manga</Link>
              </li>
              {status === "loading" ? (
                <p>Loading...</p>
              ) : session ? (
                <li className="cursor-pointer hover:text-action">
                  <Link href={`/en/profile/${session?.user?.name}`}>
                    My List
                  </Link>
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
                <Link href={`/en/search/anime`}>Movies</Link>
              </li>
              <li className="cursor-pointer hover:text-action">
                <Link href={`/en/search/anime`}>TV Shows</Link>
              </li>
              <li className="cursor-pointer hover:text-action">
                <Link href={`/en/dmca`}>DMCA</Link>
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
