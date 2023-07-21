import { HeartIcon } from "@heroicons/react/20/solid";

import {
  TvIcon,
  ArrowTrendingUpIcon,
  RectangleStackIcon,
} from "@heroicons/react/24/outline";

export default function DetailTop({ info, statuses, handleOpen, loading }) {
  return (
    <div className="lg:hidden pt-5 w-screen px-5 flex flex-col">
      <div className="h-[250px] flex flex-col gap-1 justify-center">
        <h1 className="font-karla font-extrabold text-lg line-clamp-1 w-[70%]">
          {info?.title?.romaji || info?.title?.english}
        </h1>
        <p
          className="line-clamp-2 text-sm font-light antialiased w-[56%]"
          dangerouslySetInnerHTML={{ __html: info?.description }}
        />
        <div className="font-light flex gap-1 py-1 flex-wrap font-outfit text-[10px] text-[#ffffff] w-[70%]">
          {info?.genres
            ?.slice(0, info?.genres?.length > 3 ? info?.genres?.length : 3)
            .map((item, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-secondary shadow-lg font-outfit font-light rounded-full"
              >
                <span>{item}</span>
              </span>
            ))}
        </div>
        {info && (
          <div className="flex items-center gap-5 pt-3 text-center">
            <div className="flex items-center gap-2  text-center">
              <button
                type="button"
                className="bg-action px-10 rounded-sm font-karla font-bold"
                onClick={() => handleOpen()}
              >
                {!loading
                  ? statuses
                    ? statuses.name
                    : "Add to List"
                  : "Loading..."}
              </button>
              <div className="h-6 w-6">
                <HeartIcon />
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="bg-secondary rounded-sm xs:h-[30px]">
        <div className="grid grid-cols-3 place-content-center xxs:flex  items-center justify-center h-full xxs:gap-10 p-2 text-sm">
          {info && info.status !== "NOT_YET_RELEASED" ? (
            <>
              <div className="flex-center flex-col xxs:flex-row gap-2">
                <TvIcon className="w-5 h-5 text-action" />
                <h4 className="font-karla">{info?.type}</h4>
              </div>
              <div className="flex-center flex-col xxs:flex-row gap-2">
                <ArrowTrendingUpIcon className="w-5 h-5 text-action" />
                <h4>{info?.averageScore}%</h4>
              </div>
              <div className="flex-center flex-col xxs:flex-row gap-2">
                <RectangleStackIcon className="w-5 h-5 text-action" />
                {info?.episodes ? (
                  <h1>{info?.episodes} Episodes</h1>
                ) : (
                  <h1>TBA</h1>
                )}
              </div>
            </>
          ) : (
            <div>{info && "Not Yet Released"}</div>
          )}
        </div>
      </div>
    </div>
  );
}
