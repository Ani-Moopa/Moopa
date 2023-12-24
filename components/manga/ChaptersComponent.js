import { useEffect } from "react";
import ChapterSelector from "./chapters";
import axios from "axios";
import pls from "@/utils/request";

export default function ChaptersComponent({
  info,
  mangaId,
  aniId,
  setWatch,
  chapter,
  setChapter,
  loading,
  setLoading,
  notFound,
  setNotFound,
}) {
  useEffect(() => {
    setLoading(true);
  }, [aniId]);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        // console.log(mangaId);

        if (mangaId) {
          const Chapters = await pls.get(
            `https://api.anify.tv/chapters/${mangaId}`
          );
          //   console.log("clean this balls");

          if (!Chapters) {
            setLoading(false);
            setNotFound(true);
          } else {
            setChapter(Chapters);
            setLoading(false);
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [mangaId]);

  return (
    <div>
      {!loading ? (
        notFound ? (
          <div className="h-[20vh] lg:w-full flex-center flex-col gap-5">
            <p className="text-center font-karla font-bold lg:text-lg">
              Oops!<br></br> It looks like this manga is not available.
            </p>
          </div>
        ) : info && chapter && chapter.length > 0 ? (
          <ChapterSelector
            chaptersData={chapter}
            mangaId={mangaId}
            data={info}
            setWatch={setWatch}
          />
        ) : (
          <div className="flex justify-center">
            <div className="lds-ellipsis">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>
        )
      ) : (
        <div className="flex justify-center">
          <div className="lds-ellipsis">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      )}
    </div>
  );
}
