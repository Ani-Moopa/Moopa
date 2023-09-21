import { useEffect, useRef, useState } from "react";
import {
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import { useRouter } from "next/router";
import { useAniList } from "../../../lib/anilist/useAnilist";

export default function FirstPanel({
  aniId,
  data,
  hasRun,
  currentId,
  seekPage,
  setSeekPage,
  visible,
  setVisible,
  chapter,
  nextChapter,
  prevChapter,
  paddingX,
  session,
  mobileVisible,
  setMobileVisible,
  setCurrentPage,
}) {
  const { markProgress } = useAniList(session);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const imageRefs = useRef([]);
  const scrollContainerRef = useRef();

  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = scrollContainerRef.current.scrollTop;
      let index = 0;

      for (let i = 0; i < imageRefs.current.length; i++) {
        const img = imageRefs.current[i];
        if (
          scrollTop >= img?.offsetTop - scrollContainerRef.current.offsetTop &&
          scrollTop <
            img.offsetTop -
              scrollContainerRef.current.offsetTop +
              img.offsetHeight
        ) {
          index = i;
          break;
        }
      }

      if (index === data.length - 3 && !hasRun.current) {
        if (session) {
          const currentChapter = chapter.chapters?.find(
            (x) => x.id === currentId
          );
          if (currentChapter) {
            markProgress(aniId, currentChapter.number);
            console.log("marking progress");
          }
        }
        hasRun.current = true;
      }

      setCurrentPage(index + 1);
      setCurrentImageIndex(index);
      setSeekPage(index);
    };

    scrollContainerRef?.current?.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.removeEventListener("scroll", handleScroll, {
          passive: true,
        });
      }
    };
  }, [data, session, chapter]);

  useEffect(() => {
    if (scrollContainerRef.current && seekPage !== currentImageIndex) {
      const targetImageRef = imageRefs.current[seekPage];
      if (targetImageRef) {
        scrollContainerRef.current.scrollTo({
          top: targetImageRef.offsetTop - scrollContainerRef.current.offsetTop,
          behavior: "smooth",
        });
      }
    }
  }, [seekPage, currentImageIndex]);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo(0, 0);
    }
  }, [currentId]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const root = window.document.documentElement;
      root.style.setProperty("--dynamic-padding", `${paddingX}px`);
    }
  }, [paddingX]);

  return (
    <section className="flex-grow flex flex-col items-center relative">
      <div
        // style={{ paddingLeft: paddingX, paddingRight: paddingX }}
        className="longPanel h-screen w-full overflow-y-scroll lg:scrollbar-thin scrollbar-thumb-txt scrollbar-thumb-rounded-sm"
        ref={scrollContainerRef}
      >
        {data && Array.isArray(data) && data?.length > 0 ? (
          data.map((i, index) => (
            <div
              key={i.url}
              className="w-screen lg:h-auto lg:w-full"
              ref={(el) => (imageRefs.current[index] = el)}
            >
              <Image
                src={`https://api.consumet.org/utils/image-proxy?url=${encodeURIComponent(
                  i.url
                )}&headers=${encodeURIComponent(
                  JSON.stringify({ Referer: i.headers.Referer })
                )}`}
                alt={i.index}
                width={500}
                height={500}
                onClick={() => setMobileVisible(!mobileVisible)}
                className="w-screen lg:w-full h-auto bg-[#bbb]"
              />
            </div>
          ))
        ) : (
          <div className="w-full flex-center h-full">
            {/* {data.error || "Not found"} :( */}
            <p dangerouslySetInnerHTML={{ __html: data }} />
          </div>
        )}
      </div>
      <div className="absolute hidden lg:flex bottom-5 left-5 gap-5">
        <span className="flex bg-secondary p-2 rounded-sm">
          {visible ? (
            <button type="button" onClick={() => setVisible(!visible)}>
              <ArrowsPointingOutIcon className="w-5 h-5" />
            </button>
          ) : (
            <button type="button" onClick={() => setVisible(!visible)}>
              <ArrowsPointingInIcon className="w-5 h-5" />
            </button>
          )}
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            className={`flex-center rounded-sm p-2 ${
              prevChapter
                ? "bg-secondary"
                : "pointer-events-none bg-[#18181A] text-[#424245]"
            }`}
            onClick={() =>
              router.push(
                `/en/manga/read/${
                  chapter.providerId
                }?id=${aniId}&chapterId=${encodeURIComponent(prevChapter)}`
              )
            }
          >
            <ChevronLeftIcon className="w-5 h-5" />
          </button>
          <button
            type="button"
            className={`flex-center rounded-sm p-2 ${
              nextChapter
                ? "bg-secondary"
                : "pointer-events-none bg-[#18181A] text-[#424245]"
            }`}
            onClick={() =>
              router.push(
                `/en/manga/read/${
                  chapter.providerId
                }?id=${aniId}&chapterId=${encodeURIComponent(nextChapter)}`
              )
            }
          >
            <ChevronRightIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
      <span className="hidden lg:flex bg-secondary p-2 rounded-sm absolute bottom-5 right-5">{`Page ${
        currentImageIndex + 1
      }/${data.length}`}</span>
    </section>
  );
}
