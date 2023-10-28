import { useEffect, useState, Fragment } from "react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import ViewSelector from "./viewSelector";
import ThumbnailOnly from "./viewMode/thumbnailOnly";
import ThumbnailDetail from "./viewMode/thumbnailDetail";
import ListMode from "./viewMode/listMode";
import { toast } from "sonner";

function allProvider(response, setMapProviders, setProviderId) {
  const getMap = response.find((i) => i?.map === true);
  let allProvider = response;

  if (getMap) {
    allProvider = response.filter((i) => {
      if (i?.providerId === "gogoanime" && i?.map !== true) {
        return null;
      }
      return i;
    });
    setMapProviders(getMap?.episodes);
  }

  if (allProvider.length > 0) {
    const defaultProvider = allProvider.find(
      (x) => x.providerId === "gogoanime" || x.providerId === "9anime"
    );
    setProviderId(defaultProvider?.providerId || allProvider[0].providerId); // set to first provider id
  }

  return allProvider;
}

export default function AnimeEpisode({
  info,
  session,
  progress,
  setProgress,
  setWatch,
}) {
  const [providerId, setProviderId] = useState(); // default provider
  const [currentPage, setCurrentPage] = useState(1); // for pagination
  const [visible, setVisible] = useState(false); // for mobile view
  const itemsPerPage = 13; // choose your number of items per page

  const [loading, setLoading] = useState(true);
  const [artStorage, setArtStorage] = useState(null);
  const [view, setView] = useState(3);
  const [isDub, setIsDub] = useState(false);

  const [providers, setProviders] = useState(null);
  const [mapProviders, setMapProviders] = useState(null);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      const response = await fetch(
        `/api/v2/episode/${info.id}?releasing=${
          info.status === "RELEASING" ? "true" : "false"
        }${isDub ? "&dub=true" : ""}`
      ).then((res) => res.json());

      const providers = allProvider(response, setMapProviders, setProviderId);

      setView(Number(localStorage.getItem("view")) || 3);
      setArtStorage(JSON.parse(localStorage.getItem("artplayer_settings")));
      setProviders(providers);
      setLoading(false);
    };
    fetchData();

    return () => {
      setCurrentPage(1);
      setProviders(null);
      setMapProviders(null);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [info.id, isDub]);

  const episodes =
    providers
      ?.find((provider) => provider.providerId === providerId)
      ?.episodes?.slice(0, mapProviders?.length) || [];

  const lastEpisodeIndex = currentPage * itemsPerPage;
  const firstEpisodeIndex = lastEpisodeIndex - itemsPerPage;
  let currentEpisodes = episodes.slice(firstEpisodeIndex, lastEpisodeIndex);

  const totalPages = Math.ceil(episodes.length / itemsPerPage);

  const handleChange = (event) => {
    setProviderId(event.target.value);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    if (
      !mapProviders ||
      mapProviders?.every(
        (item) =>
          item?.img?.includes("https://s4.anilist.co/") ||
          item?.image?.includes("https://s4.anilist.co/") ||
          item?.img === null
      )
    ) {
      setView(3);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [providerId, episodes]);

  useEffect(() => {
    if (episodes) {
      const getEpi = info?.nextAiringEpisode
        ? episodes.find((i) => i.number === progress + 1)
        : episodes[0];
      if (getEpi) {
        const watchUrl = `/en/anime/watch/${
          info.id
        }/${providerId}?id=${encodeURIComponent(getEpi.id)}&num=${
          getEpi.number
        }${isDub ? `&dub=${isDub}` : ""}`;
        setWatch(watchUrl);
      } else {
        setWatch(null);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [episodes]);

  useEffect(() => {
    if (artStorage) {
      const currentData =
        JSON.parse(localStorage.getItem("artplayer_settings")) || {};

      // Create a new object to store the updated data
      const updatedData = {};

      // Iterate through the current data and copy items with different aniId to the updated object
      for (const key in currentData) {
        const item = currentData[key];
        if (Number(item.aniId) === info.id && item.provider === providerId) {
          updatedData[key] = item;
        }
      }

      if (!session?.user?.name) {
        const maxWatchedEpisode = Object.keys(updatedData).reduce(
          (maxEpisode, key) => {
            const episodeData = updatedData[key];
            if (episodeData.timeWatched >= episodeData.duration * 0.9) {
              return Math.max(maxEpisode, episodeData.episode);
            }
            return maxEpisode;
          },
          0
        );

        setProgress(maxWatchedEpisode);
      } else {
        return;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [providerId, artStorage, info.id, session?.user?.name]);

  let debounceTimeout;

  const handleRefresh = async () => {
    try {
      setLoading(true);
      clearTimeout(debounceTimeout);
      debounceTimeout = setTimeout(async () => {
        const res = await fetch(
          `/api/v2/episode/${info.id}?releasing=${
            info.status === "RELEASING" ? "true" : "false"
          }${isDub ? "&dub=true" : ""}&refresh=true`
        );
        if (!res.ok) {
          const json = await res.json();
          if (res.status === 429) {
            toast.error(json.error);
            const resp = await fetch(
              `/api/v2/episode/${info.id}?releasing=${
                info.status === "RELEASING" ? "true" : "false"
              }${isDub ? "&dub=true" : ""}`
            ).then((res) => res.json());

            if (resp) {
              const providers = allProvider(
                resp,
                setMapProviders,
                setProviderId
              );
              setProviders(providers);
            }
          } else {
            toast.error("Something went wrong");
            setProviders([]);
          }
          setLoading(false);
        } else {
          const remainingRequests = res.headers.get("X-RateLimit-Remaining");
          toast.success("Remaining requests " + remainingRequests);

          const data = await res.json();
          const getMap = data.find((i) => i?.map === true) || data[0];
          let allProvider = data;

          if (getMap) {
            allProvider = data.filter((i) => {
              if (i?.providerId === "gogoanime" && i?.map !== true) {
                return null;
              }
              return i;
            });
            setMapProviders(getMap?.episodes);
          }

          if (allProvider.length > 0) {
            const defaultProvider = allProvider.find(
              (x) => x.providerId === "gogoanime" || x.providerId === "9anime"
            );
            setProviderId(
              defaultProvider?.providerId || allProvider[0].providerId
            ); // set to first provider id
          }

          setView(Number(localStorage.getItem("view")) || 3);
          setArtStorage(JSON.parse(localStorage.getItem("artplayer_settings")));
          setProviders(allProvider);
          setLoading(false);
        }
      }, 1000);
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong");
    }
  };

  return (
    <>
      <div className="flex flex-col gap-5 px-3">
        <div className="flex lg:flex-row flex-col gap-5 lg:gap-0 justify-between ">
          <div className="flex justify-between">
            <div className="flex items-center gap-4 md:gap-5">
              {info && (
                <h1 className="text-[20px] lg:text-2xl font-bold font-karla">
                  Episodes
                </h1>
              )}
              {info?.status !== "NOT_YET_RELEASED" && (
                <button
                  type="button"
                  onClick={() => {
                    handleRefresh();
                    setProviders(null);
                    setMapProviders(null);
                  }}
                  className="relative flex flex-col items-center w-5 h-5 group"
                >
                  <span className="absolute pointer-events-none z-40 opacity-0 -translate-y-8 group-hover:-translate-y-10 group-hover:opacity-100 font-karla shadow-tersier shadow-md whitespace-nowrap bg-secondary px-2 py-1 rounded transition-all duration-200 ease-out">
                    Refresh Episodes
                  </span>
                  <svg
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      clipRule="evenodd"
                      fillRule="evenodd"
                      d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                    />
                  </svg>
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <div
                onClick={() => setIsDub((prev) => !prev)}
                className="flex lg:hidden flex-col items-center relative rounded-md bg-secondary py-1.5 px-3 font-karla text-sm hover:ring-1 ring-action cursor-pointer group"
              >
                {isDub ? "Dub" : "Sub"}

                <span className="absolute pointer-events-none z-40 opacity-0 -translate-y-8 group-hover:-translate-y-10 group-hover:opacity-100 font-karla shadow-tersier shadow-md whitespace-nowrap bg-secondary px-2 py-1 rounded transition-all duration-200 ease-out">
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
                <span className="absolute pointer-events-none z-40 opacity-0 -translate-y-8 group-hover:-translate-y-10 group-hover:opacity-100 font-karla shadow-tersier shadow-md whitespace-nowrap bg-secondary px-2 py-1 rounded transition-all duration-200 ease-out">
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

            <ViewSelector
              view={view}
              setView={setView}
              episode={currentEpisodes}
              map={mapProviders}
            />
          </div>
        </div>

        {/* Episodes */}
        {!loading ? (
          <div
            className={`${
              view === 1
                ? "grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5 lg:gap-8 place-items-center"
                : view === 2
                ? "flex flex-col gap-3"
                : `flex flex-col odd:bg-secondary even:bg-primary`
            } py-2`}
          >
            {Array.isArray(providers) ? (
              providers.length > 0 ? (
                currentEpisodes.map((episode, index) => {
                  const mapData = mapProviders?.find(
                    (i) => i.number === episode.number
                  );

                  return (
                    <Fragment key={index}>
                      {view === 1 && (
                        <ThumbnailOnly
                          key={index}
                          index={index}
                          info={info}
                          image={mapData?.img || mapData?.image}
                          providerId={providerId}
                          episode={episode}
                          artStorage={artStorage}
                          progress={progress}
                          dub={isDub}
                        />
                      )}
                      {view === 2 && (
                        <ThumbnailDetail
                          key={index}
                          image={mapData?.img || mapData?.image}
                          title={mapData?.title}
                          description={mapData?.description}
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
              <p>{providers?.message}</p>
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
