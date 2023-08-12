import Image from "next/image";
import Link from "next/link";

export default function ThumbnailDetail({
  index,
  epi,
  info,
  provider,
  artStorage,
  progress,
  dub,
}) {
  const time = artStorage?.[epi?.id]?.timeWatched;
  const duration = artStorage?.[epi?.id]?.duration;
  let prog = (time / duration) * 100;
  if (prog > 90) prog = 100;

  return (
    <Link
      key={index}
      href={`/en/anime/watch/${info.id}/${provider}?id=${encodeURIComponent(
        epi.id
      )}&num=${epi.number}${dub ? `&dub=${dub}` : ""}`}
      className="flex group h-[110px] lg:h-[160px] w-full rounded-lg transition-all duration-300 ease-out bg-secondary cursor-pointer hover:scale-[1.02] ring-0 hover:ring-1 hover:shadow-lg ring-white"
    >
      <div className="w-[43%] lg:w-[30%] relative shrink-0 z-40 rounded-lg overflow-hidden shadow-[4px_0px_5px_0px_rgba(0,0,0,0.3)]">
        <div className="relative">
          <Image
            src={epi?.image}
            alt="Anime Cover"
            width={1000}
            height={1000}
            className="object-cover z-30 rounded-lg h-[110px] lg:h-[160px] brightness-[65%]"
          />
          <span
            className={`absolute bottom-0 left-0 h-[2px] bg-red-700`}
            style={{
              width:
                progress && artStorage && epi?.number <= progress
                  ? "100%"
                  : artStorage?.[epi?.id]
                  ? `${prog}%`
                  : "0%",
            }}
          />
          <span className="absolute bottom-2 left-2 font-karla font-semibold text-sm lg:text-lg">
            Episode {epi?.number}
          </span>
          <div className="z-[9999] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 scale-[1.5]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-5 h-5 invisible group-hover:visible"
            >
              <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
            </svg>
          </div>
        </div>
      </div>

      <div
        className={`w-[70%] h-full select-none p-4 flex flex-col justify-center gap-3`}
      >
        <h1 className="font-karla font-bold text-base lg:text-lg xl:text-xl italic line-clamp-1">
          {epi?.title}
        </h1>
        {epi?.description && (
          <p className="line-clamp-2 text-xs lg:text-md xl:text-lg italic font-outfit font-extralight">
            {epi?.description}
          </p>
        )}
      </div>
    </Link>
  );
}
