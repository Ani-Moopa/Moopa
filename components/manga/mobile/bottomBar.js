import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  RectangleStackIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";

export default function BottomBar({
  id,
  prevChapter,
  nextChapter,
  currentPage,
  chapter,
  page,
  setSeekPage,
  setIsOpen,
}) {
  const [openPage, setOpenPage] = useState(false);
  const router = useRouter();
  return (
    <div
      className={`fixed lg:hidden flex flex-col gap-3 z-50 h-auto w-screen ${
        openPage ? "bottom-0" : "bottom-5"
      }`}
    >
      <div className="flex justify-between px-2">
        <div className="flex gap-2">
          <button
            type="button"
            className={`flex-center shadow-lg ring-1 ring-black ring-opacity-5 rounded-md p-2 ${
              prevChapter
                ? "bg-secondary"
                : "pointer-events-none bg-[#18181A] text-[#424245]"
            }`}
            onClick={() =>
              router.push(
                `/en/manga/read/${
                  chapter.providerId
                }?id=${id}&chapterId=${encodeURIComponent(prevChapter)}`
              )
            }
          >
            <ChevronLeftIcon className="w-5 h-5" />
          </button>
          <button
            type="button"
            className={`flex-center shadow-lg ring-1 ring-black ring-opacity-5 rounded-md p-2 ${
              nextChapter
                ? "bg-secondary"
                : "pointer-events-none bg-[#18181A] text-[#424245]"
            }`}
            onClick={() =>
              router.push(
                `/en/manga/read/${
                  chapter.providerId
                }?id=${id}&chapterId=${encodeURIComponent(nextChapter)}`
              )
            }
          >
            <ChevronRightIcon className="w-5 h-5" />
          </button>
          <button
            type="button"
            className={`flex-center gap-2 shadow-lg ring-1 ring-black ring-opacity-5 rounded-md p-2 bg-secondary`}
            onClick={() => setOpenPage(!openPage)}
          >
            <ChevronUpIcon
              className={`w-5 h-5 transition-transform ${
                openPage ? "rotate-180 transform" : ""
              }`}
            />
            <h1>Pages</h1>
          </button>
          <button
            type="button"
            className={`flex-center gap-2 shadow-lg ring-1 ring-black ring-opacity-5 rounded-md p-2 bg-secondary`}
            onClick={() => setIsOpen(true)}
          >
            <RectangleStackIcon className="w-5 h-5" />
          </button>
        </div>
        <span className="flex bg-secondary shadow-lg ring-1 ring-black ring-opacity-5 p-2 rounded-md">{`${currentPage}/${page.length}`}</span>
      </div>
      {openPage && (
        <div className="bg-secondary flex justify-center h-full w-screen py-2">
          <div className="flex overflow-scroll">
            {Array.isArray(page) ? (
              page.map((x) => {
                return (
                  <div
                    key={x.url}
                    className="hover:bg-[#424245] shrink-0 cursor-pointer rounded-sm"
                  >
                    <div
                      className="flex flex-col shrink-0 items-center cursor-pointer"
                      onClick={() => setSeekPage(x.index)}
                    >
                      <Image
                        src={`https://api.consumet.org/utils/image-proxy?url=${encodeURIComponent(
                          x.url
                        )}&headers=${encodeURIComponent(
                          JSON.stringify({ Referer: x.headers.Referer })
                        )}`}
                        alt="chapter image"
                        width={100}
                        height={200}
                        className="w-full h-[120px] object-contain scale-90"
                      />
                      <h1>Page {x.index + 1}</h1>
                    </div>
                  </div>
                );
              })
            ) : (
              <div>not found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
