import Link from "next/link";

export default function ListMode({
  info,
  episode,
  index,
  providerId,
  progress,
  dub,
}) {
  return (
    <div key={episode.number} className="flex flex-col gap-3 px-2">
      <Link
        href={`/en/anime/watch/${info.id}/${providerId}?id=${encodeURIComponent(
          episode.id
        )}&num=${episode.number}${dub ? `&dub=${dub}` : ""}`}
        className={`text-start text-sm lg:text-lg ${
          progress && episode.number <= progress
            ? "text-[#5f5f5f]"
            : "text-white"
        }`}
      >
        <p>Episode {episode.number}</p>
        {episode.title && (
          <p
            className={`text-xs lg:text-sm ${
              progress && episode.number <= progress
                ? "text-[#5f5f5f]"
                : "text-[#b1b1b1]"
            } italic`}
          >
            "{episode.title}"
          </p>
        )}
      </Link>
      {index !== episode?.length - 1 && <span className="h-[1px] bg-white" />}
    </div>
  );
}
