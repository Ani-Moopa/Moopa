import Image from "next/image";
import Link from "next/link";
import Skeleton from "react-loading-skeleton";

export default function DesktopDetails({
  info,
  statuses,
  handleOpen,
  loading,
  color,
  setShowAll,
  showAll,
}) {
  return (
    <>
      <div className="hidden lg:flex gap-8 w-full flex-nowrap">
        <div className="shrink-0 lg:h-[250px] lg:w-[180px] w-[115px] h-[164px] relative">
          {info ? (
            <>
              <div className="bg-image lg:h-[250px] lg:w-[180px] w-[115px] h-[164px] bg-opacity-30 absolute backdrop-blur-lg z-10 -top-7" />
              <Image
                src={info.coverImage.extraLarge || info.coverImage.large}
                priority={true}
                alt="poster anime"
                height={700}
                width={700}
                className="object-cover lg:h-[250px] lg:w-[180px] w-[115px] h-[164px] z-20 absolute rounded-md -top-7"
              />
              <button
                type="button"
                className="bg-action flex-center z-20 h-[20px] w-[180px] absolute bottom-0 rounded-sm font-karla font-bold"
                onClick={() => handleOpen()}
              >
                {!loading
                  ? statuses
                    ? statuses.name
                    : "Add to List"
                  : "Loading..."}
              </button>
            </>
          ) : (
            <Skeleton className="h-[250px] w-[180px]" />
          )}
        </div>

        <div className="hidden lg:flex w-full flex-col gap-5 h-[250px]">
          <div className="flex flex-col gap-2">
            <h1
              className="title font-inter font-bold text-[36px] text-white line-clamp-1"
              title={info?.title?.romaji || info?.title?.english}
            >
              {info ? (
                info?.title?.romaji || info?.title?.english
              ) : (
                <Skeleton width={450} />
              )}
            </h1>
            {info ? (
              <div className="flex gap-6">
                {info?.episodes && (
                  <div
                    className={`dynamic-text rounded-md px-2 font-karla font-bold`}
                    style={color}
                  >
                    {info?.episodes} Episodes
                  </div>
                )}
                {info?.startDate?.year && (
                  <div
                    className={`dynamic-text rounded-md px-2 font-karla font-bold`}
                    style={color}
                  >
                    {info?.startDate?.year}
                  </div>
                )}
                {info?.averageScore && (
                  <div
                    className={`dynamic-text rounded-md px-2 font-karla font-bold`}
                    style={color}
                  >
                    {info?.averageScore}%
                  </div>
                )}
                {info?.type && (
                  <div
                    className={`dynamic-text rounded-md px-2 font-karla font-bold`}
                    style={color}
                  >
                    {info?.type}
                  </div>
                )}
                {info?.status && (
                  <div
                    className={`dynamic-text rounded-md px-2 font-karla font-bold`}
                    style={color}
                  >
                    {info?.status}
                  </div>
                )}
                <div
                  className={`dynamic-text rounded-md px-2 font-karla font-bold`}
                  style={color}
                >
                  Sub | EN
                </div>
              </div>
            ) : (
              <Skeleton width={240} height={32} />
            )}
          </div>
          {info ? (
            <p
              dangerouslySetInnerHTML={{ __html: info?.description }}
              className="overflow-y-scroll scrollbar-thin pr-2  scrollbar-thumb-secondary scrollbar-thumb-rounded-lg h-[140px]"
            />
          ) : (
            <Skeleton className="h-[130px]" />
          )}
        </div>
      </div>

      <div>
        <div className="flex gap-5 items-center">
          {info?.relations?.edges?.length > 0 && (
            <div className="p-3 lg:p-0 text-[20px] lg:text-2xl font-bold font-karla">
              Relations
            </div>
          )}
          {info?.relations?.edges?.length > 3 && (
            <div
              className="cursor-pointer"
              onClick={() => setShowAll(!showAll)}
            >
              {showAll ? "show less" : "show more"}
            </div>
          )}
        </div>
        <div
          className={`w-screen lg:w-full flex gap-5 overflow-x-scroll snap-x scroll-px-5 scrollbar-none lg:grid lg:grid-cols-3 justify-items-center lg:pt-7 lg:pb-5 px-3 lg:px-4 pt-4 rounded-xl`}
        >
          {info?.relations?.edges ? (
            info?.relations?.edges
              .slice(0, showAll ? info?.relations?.edges.length : 3)
              .map((r, index) => {
                const rel = r.node;
                return (
                  <Link
                    key={rel.id}
                    href={
                      rel.type === "ANIME" ||
                      rel.type === "OVA" ||
                      rel.type === "MOVIE" ||
                      rel.type === "SPECIAL" ||
                      rel.type === "ONA"
                        ? `/en/anime/${rel.id}`
                        : `/en/manga/${rel.id}`
                    }
                    className={`lg:hover:scale-[1.02] snap-start hover:shadow-lg scale-100 transition-transform duration-200 ease-out w-full ${
                      rel.type === "MUSIC" ? "pointer-events-none" : ""
                    }`}
                  >
                    <div
                      key={rel.id}
                      className="w-[400px] lg:w-full h-[126px] bg-secondary flex rounded-md"
                    >
                      <div className="w-[90px] bg-image rounded-l-md shrink-0">
                        <Image
                          src={
                            rel.coverImage.extraLarge || rel.coverImage.large
                          }
                          alt={rel.id}
                          height={500}
                          width={500}
                          className="object-cover h-full w-full shrink-0 rounded-l-md"
                        />
                      </div>
                      <div className="h-full grid px-3 items-center">
                        <div className="text-action font-outfit font-bold">
                          {r.relationType}
                        </div>
                        <div className="font-outfit font-thin line-clamp-2">
                          {rel.title.userPreferred || rel.title.romaji}
                        </div>
                        <div className={``}>{rel.type}</div>
                      </div>
                    </div>
                  </Link>
                );
              })
          ) : (
            <>
              {[1, 2, 3].map((item) => (
                <div key={item} className="w-full hidden lg:block">
                  <Skeleton className="h-[126px]" />
                </div>
              ))}
              <div className="w-full lg:hidden">
                <Skeleton className="h-[126px]" />
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
