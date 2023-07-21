import { useEffect, useState } from "react";
import { useAniList } from "../../../../lib/anilist/useAnilist";
import Skeleton from "react-loading-skeleton";
import DisqusComments from "../../../disqus";
import Image from "next/image";

export default function Details({
  info,
  session,
  epiNumber,
  id,
  onList,
  setOnList,
  handleOpen,
}) {
  const [url, setUrl] = useState(null);
  const { markPlanning, deleteFromList } = useAniList(session);

  function handlePlan() {
    if (onList === false) {
      markPlanning(info.id);
      setOnList(true);
    }
  }

  useEffect(() => {
    const url = window.location.href;
    setUrl(url);
  }, []);
  return (
    <div className="flex flex-col gap-2">
      <div className="px-4 pt-7 pb-4 h-full flex">
        <div className="aspect-[9/13] h-[240px]">
          {info ? (
            <Image
              src={info.coverImage.extraLarge}
              alt="Anime Cover"
              width={1000}
              height={1000}
              priority
              className="object-cover aspect-[9/13] h-[240px] rounded-md"
            />
          ) : (
            <Skeleton height={240} />
          )}
        </div>
        <div className="grid w-full pl-5 gap-3 h-[240px]">
          <div className="grid grid-cols-2 gap-1 items-center">
            <h2 className="text-sm font-light font-roboto text-[#878787]">
              Studios
            </h2>
            <div className="row-start-2">
              {info ? info.studios.edges[0].node.name : <Skeleton width={80} />}
            </div>
            <div className="hidden xxs:grid col-start-2 place-content-end relative">
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  onClick={() => {
                    session ? handlePlan() : handleOpen();
                  }}
                  className={`w-8 h-8 hover:fill-white text-white hover:cursor-pointer ${
                    onList ? "fill-white" : ""
                  }`}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
          <div className="grid gap-1 items-center">
            <h2 className="text-sm font-light font-roboto text-[#878787]">
              Status
            </h2>
            <div>{info ? info.status : <Skeleton width={75} />}</div>
          </div>
          <div className="grid gap-1 items-center overflow-y-hidden">
            <h2 className="text-sm font-light font-roboto text-[#878787]">
              Titles
            </h2>
            <div className="grid grid-flow-dense grid-cols-2 gap-2 h-full w-full">
              {info ? (
                <>
                  <div className="line-clamp-3">{info.title?.romaji || ""}</div>
                  <div className="line-clamp-3">
                    {info.title?.english || ""}
                  </div>
                  <div className="line-clamp-3">{info.title?.native || ""}</div>
                </>
              ) : (
                <Skeleton width={200} height={50} />
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-3 px-4 pt-3">
        {info &&
          info.genres?.map((item, index) => (
            <div
              key={index}
              className="border border-action text-gray-100 py-1 px-2 rounded-md font-karla text-sm"
            >
              {item}
            </div>
          ))}
      </div>
      <div className={`bg-secondary rounded-md mt-3 mx-3`}>
        {info && (
          <p
            dangerouslySetInnerHTML={{ __html: info?.description }}
            className={`p-5 text-sm font-light font-roboto text-[#e4e4e4] `}
          />
        )}
      </div>
      {info && url && (
        <div className="mt-5 px-5">
          <DisqusComments
            key={id}
            post={{
              id: id,
              title: info.title.romaji,
              url: url,
              episode: epiNumber,
            }}
          />
        </div>
      )}
    </div>
  );
}
