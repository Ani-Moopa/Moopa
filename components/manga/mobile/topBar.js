import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export default function TopBar({ info }) {
  return (
    <div className="fixed lg:hidden flex items-center justify-between px-3 z-50 top-0 h-[5vh] w-screen p-2 bg-secondary">
      {info && (
        <>
          <Link
            href={`/en/manga/${info.id}`}
            className="flex gap-2 items-center"
          >
            <ArrowLeftIcon className="w-6 h-6" />
            <h1>back</h1>
          </Link>
          {/* <h1 className="font-outfit text-action font-bold text-lg">Madara</h1> */}
          <h1 className="w-[50%] line-clamp-1 text-end">{info.title.romaji}</h1>
        </>
      )}
    </div>
  );
}
