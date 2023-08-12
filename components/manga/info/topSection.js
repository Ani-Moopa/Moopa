import Image from "next/image";
import { BookOpenIcon } from "@heroicons/react/24/outline";
import AniList from "../../media/aniList";
import Link from "next/link";
import TopMobile from "./mobile/topMobile";
import MobileButton from "./mobile/mobileButton";

export default function TopSection({ info, firstEp, setCookie }) {
  const slicedGenre = info.genres?.slice(0, 3);

  function saveManga() {
    localStorage.setItem(
      "manga",
      JSON.stringify({ manga: firstEp, data: info })
    );

    setCookie(null, "manga", info.id, {
      maxAge: 24 * 60 * 60,
      path: "/",
    });
  }

  return (
    <div className="flex md:gap-5 w-[90%] xl:w-[70%] z-30">
      <TopMobile info={info} />
      <div className="hidden md:block w-[7rem] xs:w-[10rem] lg:w-[15rem] space-y-3 shrink-0 rounded-sm">
        <Image
          src={info.coverImage}
          width={500}
          height={500}
          alt="cover image"
          className="hidden md:block object-cover h-[10rem] xs:h-[14rem] lg:h-[22rem] rounded-sm shadow-lg shadow-[#1b1b1f] bg-[#34343b]/20"
        />

        <div className="hidden md:flex items-center justify-between w-full lg:gap-5 pb-3">
          <button
            disabled={!firstEp}
            onClick={saveManga}
            className={`${
              !firstEp
                ? "pointer-events-none text-white/50 bg-tersier/50"
                : "bg-tersier text-white"
            } lg:w-full font-bold shadow-md shadow-[#0E0E0F] hover:bg-tersier/90 hover:text-white/50 rounded-md`}
          >
            <Link
              href={`/en/manga/read/${firstEp?.providerId}?id=${
                info.id
              }&chapterId=${encodeURIComponent(
                firstEp?.chapters[firstEp.chapters.length - 1].id
              )}`}
              className="flex items-center lg:justify-center text-sm lg:text-base font-karla gap-2 h-[35px] lg:h-[40px] px-2"
            >
              <h1>Read Now</h1>
              <BookOpenIcon className="w-5 h-5" />
            </Link>
          </button>
          <Link
            href={`https://anilist.co/manga/${info.id}`}
            className="flex-center rounded-md bg-tersier shadow-md shadow-[#0E0E0F] h-[35px] lg:h-[40px] lg:px-4 px-2"
          >
            <div className="flex-center w-5 h-5">
              <AniList />
            </div>
          </Link>
        </div>
      </div>
      <div className="w-full flex flex-col justify-start z-40">
        <div className="md:h-1/2 py-2 md:py-5 flex flex-col md:gap-2 justify-end">
          <h1 className="title text-xl md:text-2xl xl:text-3xl text-white font-semibold font-karla line-clamp-1 text-start">
            {info.title?.romaji || info.title?.english || info.title?.native}
          </h1>
          <span className="flex flex-wrap text-xs lg:text-sm md:text-[#747478]">
            {slicedGenre &&
              slicedGenre.map((genre, index) => {
                return (
                  <div key={index} className="flex">
                    {genre}
                    {index < slicedGenre?.length - 1 && (
                      <span className="mx-2 text-sm text-[#747478]">•</span>
                    )}
                  </div>
                );
              })}
          </span>
        </div>

        <MobileButton info={info} firstEp={firstEp} saveManga={saveManga} />

        <div className="hidden md:block relative h-1/2">
          {/* <span className="font-semibold text-sm">Description</span> */}
          <div
            className={`relative group h-[8rem] lg:h-[12.5rem] text-sm lg:text-base overflow-y-scroll scrollbar-hide`}
          >
            <p
              dangerouslySetInnerHTML={{ __html: info.description }}
              className="pb-5 pt-2 leading-5"
            />
          </div>
          <div
            className={`absolute bottom-0 w-full bg-gradient-to-b from-transparent to-secondary to-50% h-[2rem]`}
          />
        </div>
      </div>
    </div>
  );
}
