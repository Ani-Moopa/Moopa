import { useEffect, useState } from "react";
import { useAniList } from "../../../lib/anilist/useAnilist";
import Skeleton from "react-loading-skeleton";
import DisqusComments from "../../disqus";
import { AniListInfoTypes } from "types/info/AnilistInfoTypes";
import { SessionTypes } from "pages/en";
import Link from "next/link";
import Image from "next/image";

type DetailsProps = {
  info: AniListInfoTypes;
  session: SessionTypes;
  epiNumber: number;
  description: string;
  id: string;
  onList: boolean;
  setOnList: (value: boolean) => void;
  handleOpen: () => void;
  disqus: string;
};

export default function Details({
  info,
  session,
  epiNumber,
  description,
  id,
  onList,
  setOnList,
  handleOpen,
  disqus,
}: DetailsProps) {
  const [showComments, setShowComments] = useState(false);
  const { markPlanning } = useAniList(session);

  const [showDesc, setShowDesc] = useState(false);

  const truncatedDesc = truncateText(description, 420);

  function handlePlan() {
    if (onList === false) {
      markPlanning(info.id);
      setOnList(true);
    }
  }

  useEffect(() => {
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    if (isMobile) {
      setShowComments(false);
    } else {
      setShowComments(true);
    }
    return () => {
      setShowComments(false);
      setShowDesc(false);
    };
  }, [id]);

  return (
    <div className="flex flex-col gap-2">
      {/* <div className="px-4 pt-7 pb-4 h-full flex"> */}
      <div className="pb-4 h-full flex">
        <div className="aspect-[9/13] h-[240px]">
          {info ? (
            <Link
              className="hover:scale-105 hover:shadow-lg duration-300 ease-out"
              href={`/en/anime/${id}`}
            >
              <Image
                src={info.coverImage.extraLarge}
                alt="Anime Cover"
                width={1000}
                height={1000}
                className="object-cover aspect-[9/13] h-[240px] rounded-md"
              />
            </Link>
          ) : (
            <Skeleton height={240} />
          )}
        </div>
        <div
          className="grid w-full pl-5 gap-3 h-[240px]"
          data-episode={info?.episodes || "0"}
        >
          <div className="grid grid-cols-2 gap-1 items-center">
            <h2 className="text-sm font-light font-roboto text-[#878787]">
              Studios
            </h2>
            <div className="row-start-2">
              {info ? (
                info.studios?.edges[0].node.name
              ) : (
                <Skeleton width={80} />
              )}
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
                  <div className="title-rm line-clamp-3">
                    {info.title?.romaji || ""}
                  </div>
                  <div className="title-en line-clamp-3">
                    {info.title?.english || ""}
                  </div>
                  <div className="title-nt line-clamp-3">
                    {info.title?.native || ""}
                  </div>
                </>
              ) : (
                <Skeleton width={200} height={50} />
              )}
            </div>
          </div>
        </div>
      </div>
      {/* <div className="flex flex-wrap gap-3 px-4 pt-3"> */}
      <div className="flex flex-wrap gap-3 pt-3">
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
      {/* <div className={`bg-secondary rounded-md mt-3 mx-3`}> */}
      <div className={`relative bg-secondary rounded-md mt-3`}>
        {info && (
          <>
            <p
              dangerouslySetInnerHTML={{
                __html: showDesc
                  ? description
                  : description?.length > 420
                  ? truncatedDesc
                  : description,
              }}
              className={`p-5 text-sm font-light font-roboto text-[#e4e4e4] `}
            />
            {!showDesc && description?.length > 120 && (
              <span
                onClick={() => setShowDesc((prev) => !prev)}
                className="flex justify-center items-end rounded-md pb-5 font-semibold font-karla cursor-pointer w-full h-full bg-gradient-to-t from-secondary hover:from-20% to-transparent absolute inset-0"
              >
                Read More
              </span>
            )}
          </>
        )}
      </div>
      {/* {<div className="mt-5 px-5"></div>} */}
      {!showComments && (
        <div className="w-full flex justify-center py-2 font-karla lg:px-0">
          <button
            onClick={() => setShowComments(true)}
            className={
              showComments
                ? "hidden"
                : "flex-center gap-2 h-10 bg-secondary rounded w-full lg:w-[50%]"
            }
          >
            Load Disqus{" "}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"
              />
            </svg>
          </button>
        </div>
      )}
      {showComments && (
        <div>
          {info && (
            <div className="mt-5">
              <DisqusComments
                key={id}
                post={{
                  title: info.title.romaji,
                  url: window.location.href,
                  episode: epiNumber,
                  name: disqus,
                }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function truncateText(txt: string, length: number) {
  const text = txt.replace(/(<([^>]+)>)/gi, "");
  return text.length > length ? text.slice(0, length) + "..." : text;
}
