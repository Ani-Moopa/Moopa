import { useEffect, useRef, useState } from "react";
import {
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusIcon,
  MinusIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import { useRouter } from "next/router";
import { useAniList } from "../../../lib/anilist/useAnilist";
import { getHeaders, getRandomId } from "@/utils/imageUtils";

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
  number,
  mangadexId,
}) {
  const { markProgress } = useAniList(session);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const imageRefs = useRef([]);
  const scrollContainerRef = useRef();

  const [imageQuality, setImageQuality] = useState(80);

  const router = useRouter();

  // console.log({ chapter });

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

      if (index === data?.length - 3 && !hasRun.current) {
        if (session) {
          if (aniId?.length > 6) return;
          const currentChapter = chapter.chapters?.find(
            (x) => x.id === currentId
          );
          if (currentChapter) {
            const chapterNumber =
              currentChapter.number ??
              chapter.chapters.indexOf(currentChapter) + 1;
            markProgress(aniId, chapterNumber);
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

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, session, chapter]);

  // console.log({ imageQuality });

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
              key={getRandomId()}
              className="w-screen lg:h-auto lg:w-full"
              ref={(el) => (imageRefs.current[index] = el)}
            >
              <Image
                src={`https://api.consumet.org/utils/image-proxy?url=${encodeURIComponent(
                  i.url
                )}${
                  i?.headers?.Referer
                    ? `&headers=${encodeURIComponent(
                        JSON.stringify(i?.headers)
                      )}`
                    : `&headers=${encodeURIComponent(
                        JSON.stringify(getHeaders(chapter.providerId))
                      )}`
                }`}
                alt={index}
                width={500}
                height={500}
                quality={imageQuality}
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
        {/* <button
          type="button"
          disabled={imageQuality >= 100}
          onClick={() => {
            setImageQuality((prev) => (prev <= 100 ? prev + 10 : prev));
          }}
          className="flex-center p-2 bg-secondary"
        >
          <PlusIcon className="w-5 h-5" />
        </button>
        <button
          type="button"
          disabled={imageQuality <= 10}
          onClick={() => {
            setImageQuality((prev) => (prev >= 10 ? prev - 10 : prev));
          }}
          className="flex-center p-2 bg-secondary"
        >
          <MinusIcon className="w-5 h-5" />
        </button> */}
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
                }?id=${mangadexId}&chapterId=${encodeURIComponent(
                  prevChapter?.id
                )}${aniId?.length > 6 ? "" : `&anilist=${aniId}`}&num=${
                  prevChapter?.number
                }`
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
                }?id=${mangadexId}&chapterId=${encodeURIComponent(
                  nextChapter?.id
                )}${aniId?.length > 6 ? "" : `&anilist=${aniId}`}&num=${
                  nextChapter?.number
                }`
              )
            }
          >
            <ChevronRightIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
      <span className="hidden lg:flex bg-secondary p-2 rounded-sm absolute bottom-5 right-5">{`Page ${
        currentImageIndex + 1
      }/${data?.length}`}</span>
    </section>
  );
}
