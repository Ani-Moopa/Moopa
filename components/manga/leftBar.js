import { getHeaders, getRandomId } from "@/utils/imageUtils";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

export function LeftBar({
  data,
  page,
  info,
  currentId,
  setSeekPage,
  number,
  mediaId,
  providerId,
}) {
  const router = useRouter();
  function goBack() {
    router.push(`/en/manga/${info.id}`);
  }
  return (
    <div className="hidden lg:block shrink-0 w-[16rem] h-screen overflow-y-auto scrollbar-none bg-secondary relative group">
      <div className="grid">
        <button
          type="button"
          onClick={goBack}
          className="flex items-center p-2 gap-2 line-clamp-1 cursor-pointer"
        >
          <ArrowLeftIcon className="w-5 h-5 shrink-0" />
          <h1 className="line-clamp-1 font-semibold text-start text-sm xl:text-base">
            {info?.title?.romaji}
          </h1>
        </button>

        <div className="flex flex-col p-2 gap-2">
          <div className="flex font-karla flex-col gap-2">
            <h1 className="font-bold xl:text-lg">Provider</h1>
            <div className="w-full px-2">
              <p className="bg-[#161617] text-sm xl:text-base capitalize rounded-md py-1 px-2">
                {data.providerId}
              </p>
            </div>
          </div>
          {/* Chapters */}
          <div className="flex font-karla flex-col gap-2">
            <h1 className="font-bold xl:text-lg">Chapters</h1>
            <div className="px-2">
              <div className="w-full text-sm xl:text-base px-1 h-[8rem] xl:h-[30vh] bg-[#161617] rounded-md overflow-auto scrollbar-thin scrollbar-thumb-[#363639] scrollbar-thumb-rounded-md hover:scrollbar-thumb-[#424245]">
                {data?.chapters?.map((x, index) => {
                  return (
                    <div
                      key={getRandomId()}
                      className={`${
                        x.id === currentId && "text-action"
                      } py-1 px-2 hover:bg-[#424245] rounded-sm`}
                    >
                      <Link
                        href={`/en/manga/read/${
                          data.providerId
                        }?id=${mediaId}&chapterId=${encodeURIComponent(x.id)}${
                          info?.id?.length > 6 ? "" : `&anilist=${info?.id}`
                        }&num=${x.number}`}
                        className=""
                      >
                        <h1 className="line-clamp-1">
                          <span className="font-bold">
                            {x.number || index + 1}.
                          </span>{" "}
                          {x.title || `Chapter ${x.number || index + 1}`}
                        </h1>
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          {/* pages */}
          <div className="flex font-karla flex-col gap-2">
            <h1 className="font-bold xl:text-lg">Pages</h1>
            <div className="px-2">
              <div className="text-center w-full px-1 h-[30vh] bg-[#161617] rounded-md overflow-auto scrollbar-thin scrollbar-thumb-[#363639] scrollbar-thumb-rounded-md hover:scrollbar-thumb-[#424245]">
                {Array.isArray(page) ? (
                  <div className="grid grid-cols-2 gap-5 py-4 px-2 place-items-center">
                    {page?.map((x, index) => {
                      return (
                        <div
                          key={getRandomId()}
                          className="hover:bg-[#424245] cursor-pointer rounded-sm w-full"
                        >
                          <div
                            className="flex flex-col items-center cursor-pointer"
                            onClick={() => setSeekPage(index)}
                          >
                            <Image
                              src={`https://aoi.moopa.live/utils/image-proxy?url=${encodeURIComponent(
                                x.url
                              )}${
                                x?.headers?.Referer
                                  ? `&headers=${encodeURIComponent(
                                      JSON.stringify(x?.headers)
                                    )}`
                                  : `&headers=${encodeURIComponent(
                                      JSON.stringify(getHeaders(providerId))
                                    )}`
                              }`}
                              // &headers=${encodeURIComponent(
                              //   JSON.stringify({ Referer: x.headers.Referer })
                              // )}
                              alt="chapter image"
                              width={100}
                              height={200}
                              className="w-full h-[120px] object-contain scale-90"
                            />
                            <h1>Page {index + 1}</h1>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="py-4">
                    <p>{page?.error || "No Pages."}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
