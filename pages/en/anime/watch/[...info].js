import Image from "next/image";
import Link from "next/link";
import Head from "next/head";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../api/auth/[...nextauth]";

import Skeleton from "react-loading-skeleton";

import { ChevronDownIcon, ForwardIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/router";

import { GET_MEDIA_USER } from "../../../../queries";

import dotenv from "dotenv";
import Navigasi from "../../../../components/home/staticNav";
import DisqusComments from "../../../../components/disqus";

const VideoPlayer = dynamic(() =>
  import("../../../../components/videoPlayer", { ssr: false })
);

export default function Info({ sessions, id, aniId, provider, proxy, api }) {
  const [epiData, setEpiData] = useState(null);
  const [data, setAniData] = useState(null);
  const [skip, setSkip] = useState({ op: null, ed: null });
  const [statusWatch, setStatusWatch] = useState("CURRENT");
  const [loading, setLoading] = useState(false);
  const [showComments, setShowComments] = useState(false);

  const [playing, setPlaying] = useState(null);
  const [playingEpisode, setPlayingEpisode] = useState(null);
  const [playingTitle, setPlayingTitle] = useState(null);

  const [poster, setPoster] = useState(null);
  const [progress, setProgress] = useState(0);

  const [episodes, setEpisodes] = useState([]);
  const [artStorage, setArtStorage] = useState(null);

  const [url, setUrl] = useState(null);

  const router = useRouter();

  // console.log({ playing });

  useEffect(() => {
    const defaultState = {
      epiData: null,
      skip: { op: null, ed: null },
      statusWatch: "CURRENT",
      playingEpisode: null,
      loading: false,
      showComments: false,
    };

    // Reset all state variables to their default values
    Object.keys(defaultState).forEach((key) => {
      const value = defaultState[key];
      if (Array.isArray(value)) {
        value.length
          ? eval(
              `set${
                key.charAt(0).toUpperCase() + key.slice(1)
              }(${JSON.stringify(value)})`
            )
          : eval(`set${key.charAt(0).toUpperCase() + key.slice(1)}([])`);
      } else {
        eval(
          `set${key.charAt(0).toUpperCase() + key.slice(1)}(${JSON.stringify(
            value
          )})`
        );
      }
    });

    const url = window.location.href;
    setUrl(url);

    const fetchData = async () => {
      try {
        if (provider) {
          const res = await fetch(
            `${api}/meta/anilist/watch/${id}?provider=${provider}`
          );
          const epiData = await res.json();
          setEpiData(epiData);
        } else {
          const res = await fetch(`${api}/meta/anilist/watch/${id}`);
          const epiData = await res.json();
          setEpiData(epiData);
        }
      } catch (error) {
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      }

      let aniData = null;
      setArtStorage(JSON.parse(localStorage.getItem("artplayer_settings")));

      if (provider) {
        const res = await fetch(
          `${api}/meta/anilist/info/${aniId}?provider=${provider}`
        );
        aniData = await res.json();
        setEpisodes(aniData.episodes?.reverse());
        setAniData(aniData);
      } else {
        const res2 = await fetch(`${api}/meta/anilist/info/${aniId}`);
        aniData = await res2.json();
        setEpisodes(aniData.episodes?.reverse());
        setAniData(aniData);
      }

      let playingEpisode = aniData.episodes
        .filter((item) => item.id == id)
        .map((item) => item.number);

      setPlayingEpisode(playingEpisode);

      const playing = aniData.episodes.find((item) => item.id === id);

      setPoster(playing?.image);
      setPlaying(playing);

      const title = aniData.episodes
        .filter((item) => item.id == id)
        .find((item) => item.title !== null);
      setPlayingTitle(
        title?.title || aniData.title?.romaji || aniData.title?.english
      );

      const res4 = await fetch(
        `https://api.aniskip.com/v2/skip-times/${aniData.malId}/${parseInt(
          playingEpisode
        )}?types[]=ed&types[]=mixed-ed&types[]=mixed-op&types[]=op&types[]=recap&episodeLength=`
      );
      const skip = await res4.json();

      const op = skip.results?.find((item) => item.skipType === "op") || null;
      const ed = skip.results?.find((item) => item.skipType === "ed") || null;

      setSkip({ op, ed });

      if (sessions) {
        const response = await fetch("https://graphql.anilist.co/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: GET_MEDIA_USER,
            variables: {
              username: sessions?.user.name,
            },
          }),
        });

        const dat = await response.json();

        const prog = dat.data.MediaListCollection;

        const gat = prog?.lists.map((item) => item.entries);
        const git = gat?.map((item) =>
          item?.find((item) => item.media.id === parseInt(aniId))
        );
        const gut = git?.find((item) => item?.media.id === parseInt(aniId));

        if (gut) {
          setProgress(gut.progress);
        }

        if (gut?.status === "COMPLETED") {
          setStatusWatch("REPEATING");
        } else if (
          gut?.status === "REPEATING" &&
          gut?.media?.episodes === parseInt(playingEpisode)
        ) {
          setStatusWatch("COMPLETED");
        } else if (gut?.status === "REPEATING") {
          setStatusWatch("REPEATING");
        } else if (gut?.media?.episodes === parseInt(playingEpisode)) {
          setStatusWatch("COMPLETED");
        } else if (
          gut?.media?.episodes !== null &&
          aniData.totalEpisodes === parseInt(playingEpisode)
        ) {
          setStatusWatch("COMPLETED");
          setLoading(true);
        }
      }
      setLoading(true);
    };
    fetchData();
  }, [id, aniId, provider, sessions]);

  useEffect(() => {
    const mediaSession = navigator.mediaSession;
    if (!mediaSession) return;

    const artwork = poster
      ? [{ src: poster, sizes: "512x512", type: "image/jpeg" }]
      : undefined;

    mediaSession.metadata = new MediaMetadata({
      title: playingTitle,
      artist: `Moopa ${
        playingTitle === data?.title?.romaji
          ? "- Episode " + playingEpisode
          : `- ${data?.title?.romaji || data?.title?.english}`
      }`,
      artwork,
    });
  }, [poster, playingTitle, playingEpisode, data]);

  return (
    <>
      <Head>
        <title>{playingTitle || "Loading..."}</title>
      </Head>

      <div className="bg-primary">
        <Navigasi />
        <div className="min-h-screen mt-3 md:mt-0 flex flex-col lg:gap-0 gap-5 lg:flex-row lg:py-10 lg:px-10 justify-start w-screen">
          <div className="w-screen lg:w-[67%]">
            {loading ? (
              Array.isArray(epiData?.sources) ? (
                <div className="aspect-video z-20 bg-black">
                  <VideoPlayer
                    key={id}
                    data={epiData}
                    id={id}
                    progress={parseInt(playingEpisode)}
                    session={sessions}
                    aniId={parseInt(data?.id)}
                    stats={statusWatch}
                    op={skip.op}
                    ed={skip.ed}
                    title={playingTitle}
                    poster={poster}
                    proxy={proxy}
                    provider={provider}
                  />
                </div>
              ) : (
                <div className="aspect-video bg-black flex-center select-none">
                  <p className="lg:p-0 p-5 text-center">
                    Whoops! Something went wrong. Please reload the page or try
                    other sources. {`:(`}
                  </p>
                </div>
              )
            ) : (
              <div className="aspect-video bg-black" />
            )}
            <div>
              {data && data?.episodes.length > 0 ? (
                data.episodes
                  .filter((items) => items.id == id)
                  .map((item, index) => (
                    <div className="flex justify-between" key={index}>
                      <div key={item.id} className="p-3 grid gap-2 w-[60%]">
                        <div className="text-xl font-outfit font-semibold line-clamp-1">
                          <Link
                            href={`/en/anime/${data.id}`}
                            className="inline hover:underline"
                          >
                            {item.title ||
                              data.title.romaji ||
                              data.title.english}
                          </Link>
                        </div>
                        <h4 className="text-sm font-karla font-light">
                          Episode {item.number}
                        </h4>
                      </div>
                      <div className="w-[50%] flex gap-4 items-center justify-end px-4">
                        <div className="relative">
                          <select
                            className="flex items-center gap-5 rounded-[3px] bg-secondary py-1 px-3 pr-8 font-karla appearance-none cursor-pointer"
                            value={item.number}
                            onChange={(e) => {
                              const selectedEpisode = data.episodes.find(
                                (episode) =>
                                  episode.number === parseInt(e.target.value)
                              );
                              router.push(
                                `/en/anime/watch/${selectedEpisode.id}/${data.id}`
                              );
                            }}
                          >
                            {data.episodes.map((episode) => (
                              <option
                                key={episode.number}
                                value={episode.number}
                              >
                                Episode {episode.number}
                              </option>
                            ))}
                          </select>
                          <ChevronDownIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 w-5 h-5 pointer-events-none" />
                        </div>
                        <button
                          className={`${
                            item.number === data.episodes.length
                              ? "pointer-events-none"
                              : ""
                          } relative group`}
                          onClick={() => {
                            const currentEpisodeIndex = data.episodes.findIndex(
                              (episode) => episode.number === item.number
                            );
                            if (
                              currentEpisodeIndex !== -1 &&
                              currentEpisodeIndex < data.episodes.length - 1
                            ) {
                              const nextEpisode =
                                data.episodes[currentEpisodeIndex + 1];
                              router.push(
                                `/en/anime/watch/${nextEpisode.id}/${data.id}`
                              );
                            }
                          }}
                        >
                          <span className="absolute z-[9999] -left-11 -top-14 p-2 shadow-xl rounded-md transform transition-all whitespace-nowrap bg-secondary lg:group-hover:block group-hover:opacity-1 hidden font-karla font-bold">
                            Next Episode
                          </span>
                          <ForwardIcon className="w-6 h-6" />
                        </button>
                      </div>
                    </div>
                  ))
              ) : (
                <div className="p-3 grid gap-2">
                  <div className="text-xl font-outfit font-semibold line-clamp-2">
                    <div className="inline hover:underline">
                      <Skeleton width={240} />
                    </div>
                  </div>
                  <h4 className="text-sm font-karla font-light">
                    <Skeleton width={75} />
                  </h4>
                </div>
              )}
              <div className="h-[1px] bg-[#3b3b3b]" />

              <div className="px-4 pt-7 pb-4 h-full flex">
                <div className="aspect-[9/13] h-[240px]">
                  {data ? (
                    <Image
                      src={data.image}
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
                <div className="grid w-full px-5 gap-3 h-[240px]">
                  <div className="grid grid-cols-2 gap-1 items-center">
                    <h2 className="text-sm font-light font-roboto text-[#878787]">
                      Studios
                    </h2>
                    <div className="row-start-2">
                      {data ? data.studios : <Skeleton width={80} />}
                    </div>
                    <div className="hidden xxs:grid col-start-2 place-content-end relative">
                      <div>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-8 h-8 hover:fill-white hover:cursor-pointer"
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
                    <div>{data ? data.status : <Skeleton width={75} />}</div>
                  </div>
                  <div className="grid gap-1 items-center overflow-y-hidden">
                    <h2 className="text-sm font-light font-roboto text-[#878787]">
                      Titles
                    </h2>
                    <div className="grid grid-flow-dense grid-cols-2 gap-2 h-full w-full">
                      {data ? (
                        <>
                          <div className="line-clamp-3">
                            {data.title.romaji || ""}
                          </div>
                          <div className="line-clamp-3">
                            {data.title.english || ""}
                          </div>
                          <div className="line-clamp-3">
                            {data.title.native || ""}
                          </div>
                        </>
                      ) : (
                        <Skeleton width={200} height={50} />
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-3 px-4 pt-3">
                {data &&
                  data.genres.map((item, index) => (
                    <div
                      key={index}
                      className="border border-action text-gray-100 py-1 px-2 rounded-md font-karla text-sm"
                    >
                      {item}
                    </div>
                  ))}
              </div>
              <div className={`bg-secondary rounded-md mt-3 mx-3`}>
                {data && (
                  <p
                    dangerouslySetInnerHTML={{ __html: data.description }}
                    className={`p-5 text-sm font-light font-roboto text-[#e4e4e4] `}
                  />
                )}
              </div>
              {!showComments && loading && (
                <div className="w-full flex justify-center py-5 font-karla px-3 lg:px-0">
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
                  {data && url && playing && (
                    <div className="mt-5 px-5">
                      <DisqusComments
                        key={id}
                        post={{
                          id: id,
                          title: data.title.romaji,
                          url: url,
                          episode: playing.number,
                        }}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col w-screen lg:w-[35%] ">
            <h1 className="text-xl font-karla pl-4 pb-5 font-semibold">
              Up Next
            </h1>
            <div className="flex flex-col gap-5 lg:pl-5 px-2 py-2 scrollbar-thin scrollbar-thumb-[#313131] scrollbar-thumb-rounded-full">
              {data && data?.episodes.length > 0 ? (
                data.episodes.some((item) => item.title && item.description) ? (
                  episodes.map((item) => {
                    const time = artStorage?.[item.id]?.time;
                    const duration = artStorage?.[item.id]?.duration;
                    let prog = (time / duration) * 100;
                    if (prog > 90) prog = 100;
                    return (
                      <Link
                        href={`/en/anime/watch/${item.id}/${data.id}${
                          provider ? `/${provider}` : ""
                        }`}
                        key={item.id}
                        className={`bg-secondary flex w-full h-[110px] rounded-lg scale-100 transition-all duration-300 ease-out ${
                          item.id == id
                            ? "pointer-events-none ring-1 ring-action"
                            : "cursor-pointer hover:scale-[1.02] ring-0 hover:ring-1 hover:shadow-lg ring-white"
                        }`}
                      >
                        <div className="w-[43%] lg:w-[40%] h-[110px] relative rounded-lg z-40 shrink-0 overflow-hidden shadow-[4px_0px_5px_0px_rgba(0,0,0,0.3)]">
                          <div className="relative">
                            <Image
                              src={item.image}
                              alt="Anime Cover"
                              width={1000}
                              height={1000}
                              className={`object-cover z-30 rounded-lg h-[110px]  ${
                                item.id == id
                                  ? "brightness-[30%]"
                                  : "brightness-75"
                              }`}
                            />
                            <span
                              className={`absolute bottom-0 left-0 h-[3px] bg-red-700`}
                              style={{
                                width:
                                  progress &&
                                  artStorage &&
                                  item?.number <= progress
                                    ? "100%"
                                    : artStorage?.[item?.id]
                                    ? `${prog}%`
                                    : "0",
                              }}
                            />
                            <span className="absolute bottom-2 left-2 font-karla font-bold text-sm">
                              Episode {item.number}
                            </span>
                            {item.id == id && (
                              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 scale-[1.5]">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                  className="w-5 h-5"
                                >
                                  <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                                </svg>
                              </div>
                            )}
                          </div>
                        </div>
                        <div
                          className={`w-[70%] h-full select-none p-4 flex flex-col gap-2 ${
                            item.id == id ? "text-[#7a7a7a]" : ""
                          }`}
                        >
                          <h1 className="font-karla font-bold italic line-clamp-1">
                            {item.title}
                          </h1>
                          <p className="line-clamp-2 text-xs italic font-outfit font-extralight">
                            {item.description}
                          </p>
                        </div>
                      </Link>
                    );
                  })
                ) : (
                  data.episodes.map((item) => {
                    return (
                      <Link
                        href={`/en/anime/watch/${item.id}/${data.id}${
                          provider ? "/9anime" : ""
                        }`}
                        key={item.id}
                        className={`bg-secondary flex-center w-full h-[50px] rounded-lg scale-100 transition-all duration-300 ease-out ${
                          item.id == id
                            ? "pointer-events-none ring-1 ring-action text-[#5d5d5d]"
                            : "cursor-pointer hover:scale-[1.02] ring-0 hover:ring-1 hover:shadow-lg ring-white"
                        }`}
                      >
                        Episode {item.number}
                      </Link>
                    );
                  })
                )
              ) : (
                <>
                  {[1].map((item) => (
                    <Skeleton
                      key={item}
                      className="bg-secondary flex w-full h-[110px] rounded-lg scale-100 transition-all duration-300 ease-out"
                    />
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  dotenv.config();

  const API_URI = process.env.API_URI;

  const session = await getServerSession(context.req, context.res, authOptions);

  const proxy = process.env.PROXY_URI;

  const { info } = context.query;
  if (!info) {
    return {
      notFound: true,
    };
  }

  const id = info[0];
  const aniId = info[1];
  const provider = info[2] || null;

  return {
    props: {
      sessions: session,
      id,
      aniId,
      provider,
      proxy,
      api: API_URI,
    },
  };
}
