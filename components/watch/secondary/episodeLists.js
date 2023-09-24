import Skeleton from "react-loading-skeleton";
import Image from "next/image";
import Link from "next/link";

export default function EpisodeLists({
  info,
  map,
  providerId,
  watchId,
  episode,
  artStorage,
  dub,
}) {
  const progress = info.mediaListEntry?.progress;
  return (
    <div className="w-screen lg:max-w-sm xl:max-w-xl">
      <h1 className="text-xl font-karla pl-5 pb-5 font-semibold">Up Next</h1>
      <div className="flex flex-col gap-5 lg:pl-5 py-2 scrollbar-thin px-2 scrollbar-thumb-[#313131] scrollbar-thumb-rounded-full">
        {episode && episode.length > 0 ? (
          map?.some(
            (item) =>
              (item?.img || item?.image) &&
              !item?.img?.includes("https://s4.anilist.co/")
          ) > 0 ? (
            episode.map((item) => {
              const time = artStorage?.[item.id]?.timeWatched;
              const duration = artStorage?.[item.id]?.duration;
              let prog = (time / duration) * 100;
              if (prog > 90) prog = 100;

              const mapData = map?.find((i) => i.number === item.number);
              return (
                <Link
                  href={`/en/anime/watch/${
                    info.id
                  }/${providerId}?id=${encodeURIComponent(item.id)}&num=${
                    item.number
                  }${dub ? `&dub=${dub}` : ""}`}
                  key={item.id}
                  className={`bg-secondary flex w-full h-[110px] rounded-lg scale-100 transition-all duration-300 ease-out ${
                    item.id == watchId
                      ? "pointer-events-none ring-1 ring-action"
                      : "cursor-pointer hover:scale-[1.02] ring-0 hover:ring-1 hover:shadow-lg ring-white"
                  }`}
                >
                  <div className="w-[43%] lg:w-[40%] h-[110px] relative rounded-lg z-40 shrink-0 overflow-hidden shadow-[4px_0px_5px_0px_rgba(0,0,0,0.3)]">
                    <div className="relative">
                      {/* <div className="absolute inset-0 w-full h-full z-40" /> */}
                      <Image
                        src={
                          mapData?.img ||
                          mapData?.image ||
                          info?.coverImage?.extraLarge
                        }
                        draggable={false}
                        alt="Anime Cover"
                        width={1000}
                        height={1000}
                        className={`object-cover z-30 rounded-lg h-[110px]  ${
                          item.id == watchId
                            ? "brightness-[30%]"
                            : "brightness-75"
                        }`}
                      />
                      {/* )} */}
                      <span
                        className={`absolute bottom-0 left-0 h-[2px] bg-red-700`}
                        style={{
                          width:
                            progress && artStorage && item?.number <= progress
                              ? "100%"
                              : artStorage?.[item?.id]
                              ? `${prog}%`
                              : "0",
                        }}
                      />
                      <span className="absolute bottom-2 left-2 font-karla font-bold text-sm">
                        Episode {item?.number}
                      </span>
                      {item.id == watchId && (
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 scale-[1.5]">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="w-5 h-5"
                          >
                            <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>
                  <div
                    className={`w-full h-full overflow-x-hidden select-none p-4 flex flex-col gap-2 ${
                      item.id == watchId ? "text-[#7a7a7a]" : ""
                    }`}
                  >
                    <h1 className="font-karla font-bold italic line-clamp-1">
                      {mapData?.title || info?.title?.romaji}
                    </h1>
                    <p className="line-clamp-2 text-xs italic font-outfit font-extralight">
                      {mapData?.description || `Episode ${item.number}`}
                    </p>
                  </div>
                </Link>
              );
            })
          ) : (
            episode.map((item) => {
              return (
                <Link
                  href={`/en/anime/watch/${
                    info.id
                  }/${providerId}?id=${encodeURIComponent(item.id)}&num=${
                    item.number
                  }${dub ? `&dub=${dub}` : ""}`}
                  key={item.id}
                  className={`bg-secondary flex-center h-[50px] rounded-lg scale-100 transition-all duration-300 ease-out ${
                    item.id == watchId
                      ? "pointer-events-none ring-1 ring-action text-[#5d5d5d]"
                      : "cursor-pointer hover:scale-[1.02] ring-0 hover:ring-1 hover:shadow-lg ring-white"
                  }`}
                >
                  Episode {item.number}
                </Link>
              );
            })
          )
        ) : (
          <>
            {[1].map((item) => (
              <Skeleton
                key={item}
                className="bg-secondary flex w-full h-[110px] rounded-lg scale-100 transition-all duration-300 ease-out"
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
}
