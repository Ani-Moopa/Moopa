import Link from "next/link";

export default function ListMode({
  info,
  episode,
  artStorage,
  providerId,
  progress,
  dub,
}) {
  const time = artStorage?.[episode?.id]?.timeWatched;
  const duration = artStorage?.[episode?.id]?.duration;
  let prog = (time / duration) * 100;
  if (prog > 90) prog = 100;

  return (
    <Link
      key={episode.number}
      href={`/en/anime/watch/${info.id}/${providerId}?id=${encodeURIComponent(
        episode.id
      )}&num=${episode.number}${dub ? `&dub=${dub}` : ""}`}
      className={`flex gap-3 py-4 hover:bg-secondary odd:bg-secondary/30 even:bg-primary`}
    >
      <div className="flex w-full">
        <span className="shrink-0 px-4 text-center text-white/50">
          {episode.number}
        </span>
        <p
          className={`w-full line-clamp-1 ${
            progress
              ? progress && episode.number <= progress
                ? "text-[#5f5f5f]"
                : "text-white"
              : prog === 100
              ? "text-[#5f5f5f]"
              : "text-white"
          }`}
        >
          {episode?.title || `Episode ${episode.number}`}
        </p>
        <p className="capitalize text-sm text-white/50 px-4">{providerId}</p>
      </div>
    </Link>
  );
}
