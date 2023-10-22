import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon,
} from "@heroicons/react/24/outline";
import { useAniList } from "../../../lib/anilist/useAnilist";
import { getHeaders } from "@/utils/imageUtils";

export default function SecondPanel({
  aniId,
  chapterData,
  data,
  hasRun,
  currentChapter,
  currentId,
  seekPage,
  setSeekPage,
  visible,
  setVisible,
  session,
  providerId,
}) {
  const [index, setIndex] = useState(0);
  const [image, setImage] = useState(null);

  const { markProgress } = useAniList(session);

  useEffect(() => {
    setIndex(0);
    setSeekPage(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, currentId]);

  const seekToIndex = (newIndex) => {
    if (newIndex >= 0 && newIndex < data.length) {
      // if newIndex is odd, decrease it by 1 to show the previous page
      if (newIndex % 2 !== 0) {
        newIndex = newIndex - 1;
      }
      setIndex(newIndex);
      setSeekPage(newIndex);
    }
  };

  useEffect(() => {
    seekToIndex(seekPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seekPage]);

  useEffect(() => {
    if (data && Array.isArray(data) && data?.length > 0) {
      setImage([...data].reverse()); // Create a copy of data before reversing
    }
  }, [data]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "ArrowRight") {
        if (index > 0) {
          setIndex(index - 2);
          setSeekPage(index - 2);
        }
      } else if (event.key === "ArrowLeft") {
        if (index < image.length - 2) {
          setIndex(index + 2);
          setSeekPage(index + 2);
        }

        if (index + 1 >= image.length - 4 && !hasRun.current) {
          const current = chapterData.chapters?.find(
            (x) => x.id === currentChapter.id
          );
          const chapterNumber = chapterData.chapters.indexOf(current) + 1;

          if (chapterNumber) {
            markProgress(aniId, chapterNumber);
          }
          hasRun.current = true;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, image]);

  const handleNext = () => {
    if (index < image.length - 2) {
      setIndex(index + 2);
      setSeekPage(index + 2);
    }

    if (index + 1 >= image.length - 4 && !hasRun.current) {
      console.log("marking progress");
      const current = chapterData.chapters?.find(
        (x) => x.id === currentChapter.id
      );
      const chapterNumber = chapterData.chapters.indexOf(current) + 1;

      if (chapterNumber) {
        markProgress(aniId, chapterNumber);
      }

      markProgress(aniId, chapterNumber);
      hasRun.current = true;
    }
  };

  const handlePrev = () => {
    if (index > 0) {
      setIndex(index - 2);
      setSeekPage(index - 2);
    }
  };

  return (
    <div className="flex-grow h-screen">
      <div className="flex items-center w-full relative group">
        {image && Array.isArray(image) && image?.length > 0 ? (
          <>
            <div
              className={`flex w-full ${
                image[image.length - index - 2]?.url
                  ? "justify-between"
                  : "justify-center"
              }`}
            >
              {image[image.length - index - 2]?.url && (
                <Image
                  key={image[image.length - index - 2]?.url}
                  width={500}
                  height={500}
                  className="w-1/2 h-screen object-contain"
                  src={`https://api.consumet.org/utils/image-proxy?url=${encodeURIComponent(
                    image[image.length - index - 2]?.url
                  )}${
                    image[image.length - index - 2]?.headers?.Referer
                      ? `&headers=${encodeURIComponent(
                          JSON.stringify(
                            image[image.length - index - 2]?.headers
                          )
                        )}`
                      : `&headers=${encodeURIComponent(
                          JSON.stringify(getHeaders(providerId))
                        )}`
                  }`}
                  alt="Manga Page"
                />
              )}
              <Image
                key={image[image.length - index - 1]?.url}
                width={500}
                height={500}
                className="w-1/2 h-screen object-contain"
                src={`https://api.consumet.org/utils/image-proxy?url=${encodeURIComponent(
                  image[image.length - index - 1]?.url
                )}${
                  image[image.length - index - 1]?.headers?.Referer
                    ? `&headers=${encodeURIComponent(
                        JSON.stringify(image[image.length - index - 1]?.headers)
                      )}`
                    : `&headers=${encodeURIComponent(
                        JSON.stringify(getHeaders(providerId))
                      )}`
                }`}
                alt="Manga Page"
              />
            </div>
            <div className="absolute w-full hidden group-hover:flex justify-between mt-4">
              <button
                className="px-4 py-2 bg-secondary text-white rounded-r"
                onClick={handleNext}
              >
                Next
              </button>
              <button
                className="px-4 py-2 bg-secondary text-white rounded-l"
                onClick={handlePrev}
              >
                Previous
              </button>
            </div>
          </>
        ) : (
          <div className="w-full flex-center h-full">
            {data.error || "Not found"} :(
          </div>
        )}
        <span className="absolute hidden group-hover:flex bottom-5 left-5 bg-secondary p-2">
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
        <span className="absolute hidden group-hover:flex bottom-5 right-5 bg-secondary p-2">
          Page {index + 1}
          {index + 2 > data.length ? "" : `-${index + 2}`}/{data.length}
        </span>
      </div>
    </div>
  );
}
