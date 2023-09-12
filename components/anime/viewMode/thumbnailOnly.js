import Image from "next/image";
import Link from "next/link";

export default function ThumbnailOnly({
  info,
  image,
  providerId,
  episode,
  artStorage,
  progress,
  dub,
}) {
  const time = artStorage?.[episode?.id]?.timeWatched;
  const duration = artStorage?.[episode?.id]?.duration;
  let prog = (time / duration) * 100;
  if (prog > 90) prog = 100;
  return (
    <Link
      // key={index}
      href={`/en/anime/watch/${info.id}/${providerId}?id=${encodeURIComponent(
        episode.id
      )}&num=${episode.number}${dub ? `&dub=${dub}` : ""}`}
      className="transition-all duration-200 ease-out lg:hover:scale-105 hover:ring-1 hover:ring-white cursor-pointer bg-secondary shrink-0 relative w-full h-[180px] sm:h-[130px] subpixel-antialiased rounded-md overflow-hidden"
    >
      <span className="absolute text-sm z-40 bottom-1 left-2 font-karla font-semibold text-white">
        Episode {episode?.number}
      </span>
      <span
        className={`absolute bottom-7 left-0 h-[2px] bg-red-600`}
        style={{
          width:
            progress && artStorage && episode?.number <= progress
              ? "100%"
              : artStorage?.[episode?.id]
              ? `${prog}%`
              : "0%",
        }}
      />
      {/* <div className="absolute inset-0 bg-black z-30 opacity-20" /> */}
      {image && (
        <Image
          src={image || ""}
          alt="epi image"
          width={500}
          height={500}
          className="object-cover w-full h-[150px] sm:h-[100px] z-20 brightness-75"
        />
      )}
    </Link>
  );
}
