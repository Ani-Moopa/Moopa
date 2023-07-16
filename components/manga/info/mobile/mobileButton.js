import Link from "next/link";
import AniList from "../../../media/aniList";
import { BookOpenIcon } from "@heroicons/react/24/outline";

export default function MobileButton({ info, firstEp, saveManga }) {
  return (
    <div className="md:hidden flex items-center gap-4 w-full pb-3">
      <button
        disabled={!firstEp}
        onClick={saveManga}
        className={`${
          !firstEp
            ? "pointer-events-none text-white/50 bg-secondary/50"
            : "bg-secondary text-white"
        } lg:w-full font-bold shadow-md shadow-secondary hover:bg-secondary/90 hover:text-white/50 rounded`}
      >
        <Link
          href={`/en/manga/read/${firstEp?.providerId}?id=${
            info.id
          }&chapterId=${encodeURIComponent(
            firstEp?.chapters[firstEp.chapters.length - 1].id
          )}`}
          className="flex items-center text-xs font-karla gap-2 h-[30px] px-2"
        >
          <h1>Read Now</h1>
          <BookOpenIcon className="w-4 h-4" />
        </Link>
      </button>
      <Link
        href={`https://anilist.co/manga/${info.id}`}
        className="flex-center rounded bg-secondary shadow-md shadow-secondary h-[30px] lg:px-4 px-2"
      >
        <div className="flex-center w-5 h-5">
          <AniList />
        </div>
      </Link>
    </div>
  );
}
