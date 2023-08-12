import { useEffect, useState, Fragment } from "react";
import { ChevronDownIcon, ClockIcon } from "@heroicons/react/20/solid";
import { convertSecondsToTime } from "../../utils/getTimes";
import ChangeView from "./changeView";
import ThumbnailOnly from "./viewMode/thumbnailOnly";
import ThumbnailDetail from "./viewMode/thumbnailDetail";
import ListMode from "./viewMode/listMode";
import axios from "axios";

export default function AnimeEpisode({ info, progress }) {
  const [providerId, setProviderId] = useState(); // default provider
  const [currentPage, setCurrentPage] = useState(1); // for pagination
  const [visible, setVisible] = useState(false); // for mobile view
  const itemsPerPage = 13; // choose your number of items per page

  const [loading, setLoading] = useState(true);
  const [artStorage, setArtStorage] = useState(null);
  const [view, setView] = useState(3);
  const [isDub, setIsDub] = useState(false);

  const [providers, setProviders] = useState(null);

  useEffect(() => {
    setLoading(true);
    setProviders(null);
    const fetchData = async () => {
      try {
        const { data: firstResponse } = await axios.get(
          `/api/consumet/episode/${info.id}${isDub === true ? "?dub=true" : ""}`
        );
        if (firstResponse.data.length > 0) {
          const defaultProvider = firstResponse.data?.find(
            (x) => x.providerId === "gogoanime"
          );
          setProviderId(
            defaultProvider?.providerId || firstResponse.data[0].providerId
          ); // set to first provider id
        }

        setArtStorage(JSON.parse(localStorage.getItem("artplayer_settings")));
        setProviders(firstResponse.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        setProviders([]);
      }
    };
    fetchData();
  }, [info.id, isDub]);

  const episodes =
    providers?.find((provider) => provider.providerId === providerId)
      ?.episodes || [];

  const lastEpisodeIndex = currentPage * itemsPerPage;
  const firstEpisodeIndex = lastEpisodeIndex - itemsPerPage;
  const currentEpisodes = episodes.slice(firstEpisodeIndex, lastEpisodeIndex);
  const totalPages = Math.ceil(episodes.length / itemsPerPage);

  const handleChange = (event) => {
    setProviderId(event.target.value);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    if (episodes?.some((item) => item?.title === null)) {
      setView(3);
    }
  }, [providerId, episodes]);

  return (
    <>
      <div className="flex flex-col gap-5  px-3">
        <div className="flex lg:flex-row flex-col gap-5 lg:gap-0 justify-between ">
          <div className="flex justify-between">
            <div className="flex items-center lg:gap-10 sm:gap-7 gap-3">
              {info && (
                <h1 className="text-[20px] lg:text-2xl font-bold font-karla">
                  Episodes
                </h1>
              )}
              {info?.nextAiringEpisode && (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-4 text-[10px] xxs:text-sm lg:text-base">
                    <h1>Next :</h1>
                    <div className="px-4 rounded-sm font-karla font-bold bg-white text-black">
                      {convertSecondsToTime(
                        info.nextAiringEpisode.timeUntilAiring
                      )}
                    </div>
                  </div>
                  <div className="h-6 w-6">
                    <ClockIcon />
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <div
                onClick={() => setIsDub((prev) => !prev)}
                className="flex lg:hidden flex-col items-center relative rounded-md bg-secondary py-1.5 px-3 font-karla text-sm hover:ring-1 ring-action cursor-pointer group"
              >
                {isDub ? "Dub" : "Sub"}
                <span className="absolute invisible opacity-0 group-hover:opacity-100 group-hover:scale-100 scale-0 group-hover:-translate-y-7 translate-y-0 group-hover:visible rounded-sm shadow top-0 w-28 bg-secondary text-center transition-all transform duration-200 ease-out">
                  Switch to {isDub ? "Sub" : "Dub"}
                </span>
              </div>
              <div
                className="lg:hidden bg-secondary p-1 rounded-md cursor-pointer"
                onClick={() => setVisible(!visible)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
          <div
            className={`flex lg:flex gap-3 items-center justify-between ${
              visible ? "" : "hidden"
            }`}
          >
            {providers && (
              <div
                onClick={() => setIsDub((prev) => !prev)}
                className="hidden lg:flex flex-col items-center relative rounded-[3px] bg-secondary py-1 px-3 font-karla text-sm hover:ring-1 ring-action cursor-pointer group"
              >
                {isDub ? "Dub" : "Sub"}
                <span className="absolute invisible opacity-0 group-hover:opacity-100 group-hover:scale-100 scale-0 group-hover:-translate-y-7 translate-y-0 group-hover:visible rounded-sm shadow top-0 w-28 bg-secondary text-center transition-all transform duration-200 ease-out">
                  Switch to {isDub ? "Sub" : "Dub"}
                </span>
              </div>
            )}
            {providers && providers.length > 0 && (
              <>
                <div className="flex gap-3">
                  <div className="relative flex gap-2 items-center group">
                    <select
                      title="Providers"
                      onChange={handleChange}
                      value={providerId}
                      className="flex items-center text-sm gap-5 rounded-[3px] bg-secondary py-1 px-3 pr-8 font-karla appearance-none cursor-pointer outline-none focus:ring-1 focus:ring-action group-hover:ring-1 group-hover:ring-action"
                    >
                      {providers.map((provider) => (
                        <option
                          key={provider.providerId}
                          value={provider.providerId}
                        >
                          {provider.providerId}
                        </option>
                      ))}
                    </select>
                    {/* <span className="absolute invisible opacity-0 group-hover:opacity-100 group-hover:scale-100 scale-0 group-hover:-translate-y-7 translate-y-0 group-hover:visible rounded-sm shadow top-0 w-32 bg-secondary text-center transition-all transform duration-200 ease-out">
                      Select Providers
                    </span> */}
                    <ChevronDownIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 w-5 h-5 pointer-events-none" />
                  </div>

                  {totalPages > 1 && (
                    <div className="relative flex gap-2 items-center">
                      <select
                        title="Pages"
                        onChange={(e) =>
                          handlePageChange(Number(e.target.value))
                        }
                        className="flex items-center text-sm gap-5 rounded-[3px] bg-secondary py-1 px-3 pr-8 font-karla appearance-none cursor-pointer outline-none focus:ring-1 focus:ring-action hover:ring-1 hover:ring-action"
                      >
                        {[...Array(totalPages)].map((_, i) => (
                          <option key={i} value={i + 1}>
                            {i + 1}
                          </option>
                        ))}
                      </select>
                      <ChevronDownIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 w-5 h-5 pointer-events-none" />
                    </div>
                  )}
                </div>
              </>
            )}

            <ChangeView
              view={view}
              setView={setView}
              episode={currentEpisodes}
            />
          </div>
        </div>

        {/* Episodes */}
        {!loading ? (
          <div
            className={
              view === 1
                ? "grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5 lg:gap-8 place-items-center"
                : `flex flex-col gap-3`
            }
          >
            {Array.isArray(providers) ? (
              providers.length > 0 ? (
                currentEpisodes.map((episode, index) => {
                  return (
                    <Fragment key={index}>
                      {view === 1 && (
                        <ThumbnailOnly
                          key={index}
                          index={index}
                          info={info}
                          providerId={providerId}
                          episode={episode}
                          artStorage={artStorage}
                          progress={progress}
                          dub={isDub}
                          // image={thumbnail}
                        />
                      )}
                      {view === 2 && (
                        <ThumbnailDetail
                          key={index}
                          index={index}
                          epi={episode}
                          provider={providerId}
                          info={info}
                          artStorage={artStorage}
                          progress={progress}
                          dub={isDub}
                        />
                      )}
                      {view === 3 && (
                        <ListMode
                          key={index}
                          info={info}
                          episode={episode}
                          index={index}
                          artStorage={artStorage}
                          providerId={providerId}
                          progress={progress}
                          dub={isDub}
                        />
                      )}
                    </Fragment>
                  );
                })
              ) : (
                <div className="h-[20vh] lg:w-full flex-center flex-col gap-5">
                  <p className="text-center font-karla font-bold lg:text-lg">
                    Oops!<br></br> It looks like this anime is not available.
                  </p>
                </div>
              )
            ) : (
              <p>{providers.message}</p>
            )}
          </div>
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
    </>
  );
}
