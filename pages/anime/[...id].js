import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import { ClockIcon, HeartIcon } from "@heroicons/react/20/solid";
import {
  TvIcon,
  ArrowTrendingUpIcon,
  RectangleStackIcon,
} from "@heroicons/react/24/outline";

import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Layout from "../../components/layout";
import Link from "next/link";
import Content from "../../components/hero/content";

import { useSession } from "next-auth/react";

const query = `
          query ($username: String, $status: MediaListStatus) {
            MediaListCollection(userName: $username, type: ANIME, status: $status, sort: SCORE_DESC) {
              user {
                id
                name
                about (asHtml: true)
                createdAt
                avatar {
                    large
                }
                statistics {
                  anime {
                      count
                      episodesWatched
                      meanScore
                      minutesWatched
                  }
              }
                bannerImage
                mediaListOptions {
                  animeList {
                      sectionOrder
                  }
                }
              }
              lists {
                status
                name
                entries {
                  id
                  mediaId
                  status
                  progress
                  score
                  media {
                    id
                    status
                    title {
                      english
                      romaji
                    }
                    episodes
                    coverImage {
                      large
                    }
                  }
                }
              }
            }
          }
        `;

const infoQuery = `query ($id: Int) {
    Media(id: $id) {
        id
        type
        title {
            romaji
            english
            native
        }
        coverImage {
            extraLarge
            large
            color
        }
        bannerImage
        description
        episodes
        nextAiringEpisode {
            episode
            airingAt
        }
        averageScore
        popularity
        status
        startDate {
            year
        }
        duration
        genres
        relations {
            edges {
                relationType
                node {
                    id
                type
                status
                title {
                    romaji
                    english
                    userPreferred
                }
                coverImage {
                    extraLarge
                    large
                    color
                }
                }
            }
        }
        recommendations {
                nodes {
                    mediaRecommendation {
                        id
                        title {
                            romaji
                        }
                        coverImage {
                            extraLarge
                            large
                        }
                    }
            }
        }
    }
}`;

export default function Info() {
  const { data: session, status } = useSession();
  const [data, setData] = useState(null);
  const [info, setInfo] = useState(null);
  const [episode, setEpisode] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(null);
  const [statuses, setStatuses] = useState(null);
  const [stall, setStall] = useState(false);
  const [color, setColor] = useState(null);

  const [showAll, setShowAll] = useState(false);

  const [time, setTime] = useState(0);
  const { id } = useRouter().query;

  const rec = info?.recommendations?.nodes.map(
    (data) => data.mediaRecommendation
  );

  useEffect(() => {
    const defaultState = {
      data: null,
      info: null,
      episode: null,
      loading: true,
      statuses: null,
      progress: null,
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
    async function fetchData() {
      if (id) {
        setLoading(false);
        try {
          const [res, info] = await Promise.all([
            fetch(`https://api.moopa.my.id/meta/anilist/info/${id?.[0]}`),
            fetch("https://graphql.anilist.co/", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                query: infoQuery,
                variables: {
                  id: id?.[0],
                },
              }),
            }),
          ]);
          const data = await res.json();
          const infos = await info.json();
          setInfo(infos.data.Media);

          const textColor = setTxtColor(infos.data.Media.coverImage?.color);

          if (!data || data.episodes.length === 0) {
            const res = await fetch(
              `https://api.consumet.org/meta/anilist/info/${id[0]}?provider=9anime`
            );
            const datas = await res.json();
            setColor({
              backgroundColor: `${data?.color || "#ffff"}`,
              color: textColor,
            });
            setStall(true);
            setEpisode(datas.episodes);
          } else {
            setEpisode(data.episodes);
          }

          setColor({
            backgroundColor: `${data?.color || "#ffff"}`,
            color: textColor,
          });

          if (session?.user?.name) {
            const response = await fetch("https://graphql.anilist.co/", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                query: query,
                variables: {
                  username: session?.user?.name,
                },
              }),
            });

            const dat = await response.json();

            const prog = dat.data.MediaListCollection;

            const gat = prog.lists.map((item) => item.entries);
            const git = gat.map((item) =>
              item.find((item) => item.media.id === parseInt(data?.id))
            );
            const gut = git?.find(
              (item) => item?.media.id === parseInt(data?.id)
            );

            if (gut) {
              setProgress(gut?.progress);
              if (gut.status === "CURRENT") {
                setStatuses("Watching");
              } else if (gut.status === "PLANNING") {
                setStatuses("Planned to watch");
              } else if (gut.status === "COMPLETED") {
                setStatuses("Completed");
              } else if (gut.status === "DROPPED") {
                setStatuses("Dropped");
              } else if (gut.status === "PAUSED") {
                setStatuses("Paused");
              } else if (gut.status === "REPEATING") {
                setStatuses("Rewatching");
              }
            }
          }

          if (data.nextAiringEpisode) {
            setTime(
              convertSecondsToTime(data.nextAiringEpisode.timeUntilAiring)
            );
          }

          setData(data);
          setLoading(true);
        } catch (error) {
          console.log(error);
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        }
      }
    }
    fetchData();
  }, [id, session?.user?.name]);

  return (
    <>
      <Head>
        <title>
          {info
            ? info?.title?.romaji || info?.title?.english
            : "Retrieving Data..."}
        </title>
      </Head>
      <SkeletonTheme baseColor="#232329" highlightColor="#2a2a32">
        <Layout navTop="text-white bg-primary md:pt-0 md:px-0 bg-slate bg-opacity-40 z-50">
          <div className="w-screen min-h-screen relative flex flex-col items-center bg-primary gap-5">
            <div className="bg-image w-screen">
              <div className="bg-gradient-to-t from-primary from-10% to-transparent absolute h-[300px] w-screen z-10 inset-0" />
              {info ? (
                <Image
                  src={
                    info?.bannerImage ||
                    info?.coverImage?.extraLarge ||
                    info?.coverImage.large
                  }
                  alt="banner anime"
                  height={1000}
                  width={1000}
                  className="object-cover bg-image w-screen absolute top-0 left-0 h-[300px] brightness-[70%] z-0"
                />
              ) : (
                <div className="bg-image w-screen absolute top-0 left-0 h-[300px]" />
              )}
            </div>
            <div className="lg:w-[70%] md:pt-[10rem] z-30 flex flex-col gap-5">
              {/* Mobile */}

              <div className="md:hidden pt-5 w-screen px-5 flex flex-col">
                <div className="h-[250px] flex flex-col gap-1 justify-center">
                  <h1 className="font-karla font-extrabold text-lg line-clamp-1 w-[70%]">
                    {/* Yuru Camp△ SEASON 2 */}
                    {info?.title?.romaji || info?.title?.english}
                  </h1>
                  <p
                    className="line-clamp-2 text-sm font-light antialiased w-[56%]"
                    dangerouslySetInnerHTML={{ __html: info?.description }}
                  />
                  <div className="font-light flex gap-1 py-1 flex-wrap font-outfit text-[10px] text-[#ffffff] w-[70%]">
                    {info?.genres
                      ?.slice(
                        0,
                        info?.genres?.length > 3 ? info?.genres?.length : 3
                      )
                      .map((item, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-secondary shadow-lg font-outfit font-light rounded-full"
                          // style={color}
                        >
                          <span className="">{item}</span>
                          {/* {index !== info?.genres?.length - 1 && (
                            <span className="w-[5px] h-[5px] ml-[6px] mb-[2px] inline-block rounded-full bg-white" />
                          )} */}
                        </span>
                      ))}
                  </div>
                  {info && (
                    <div className="flex items-center gap-5 pt-3 text-center">
                      <div className="flex items-center gap-2  text-center">
                        <div className="bg-action px-10 rounded-sm font-karla font-bold">
                          {statuses ? statuses : "Add to List"}
                        </div>
                        <div className="h-6 w-6">
                          <HeartIcon />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="bg-secondary rounded-sm h-[30px]">
                  <div className="flex items-center justify-center h-full gap-10 p-2">
                    {info && info.status !== "NOT_YET_RELEASED" ? (
                      <>
                        <div className="flex-center gap-2">
                          <TvIcon className="w-5 h-5 text-action" />
                          <h4 className="font-karla">{info?.type}</h4>
                        </div>
                        <div className="flex-center gap-2">
                          <ArrowTrendingUpIcon className="w-5 h-5 text-action" />
                          <h4>{info?.averageScore}%</h4>
                        </div>
                        <div className="flex-center gap-2">
                          <RectangleStackIcon className="w-5 h-5 text-action" />
                          <h1>{info?.episodes} Episodes</h1>
                        </div>
                      </>
                    ) : (
                      <div>{info && "Not Yet Released"}</div>
                    )}
                  </div>
                </div>
              </div>

              {/* PC */}
              <div className="hidden md:flex gap-8 w-full flex-nowrap">
                <div className="shrink-0 md:h-[250px] md:w-[180px] w-[115px] h-[164px] relative">
                  {info ? (
                    <>
                      <div className="bg-image md:h-[250px] md:w-[180px] w-[115px] h-[164px] bg-opacity-30 absolute backdrop-blur-lg z-10" />
                      <Image
                        src={
                          info.coverImage.extraLarge || info.coverImage.large
                        }
                        alt="poster anime"
                        height={700}
                        width={700}
                        className="object-cover md:h-[250px] md:w-[180px] w-[115px] h-[164px] z-20 absolute"
                      />
                    </>
                  ) : (
                    <Skeleton className="h-[250px] w-[180px]" />
                  )}
                </div>

                {/* PC */}
                <div className="hidden md:flex w-full flex-col gap-5 h-[250px]">
                  <div className="flex flex-col gap-2">
                    <h1 className=" font-inter font-bold text-[36px] text-white line-clamp-1">
                      {info ? (
                        info?.title?.romaji || info?.title?.english
                      ) : (
                        <Skeleton width={450} />
                      )}
                    </h1>
                    {info ? (
                      <div className="flex gap-6">
                        <div
                          className={`dynamic-text rounded-md px-2 font-karla font-bold`}
                          style={color}
                        >
                          {info?.episodes} Episodes
                        </div>
                        <div
                          className={`dynamic-text rounded-md px-2 font-karla font-bold`}
                          style={color}
                        >
                          {info?.startDate?.year}
                        </div>
                        <div
                          className={`dynamic-text rounded-md px-2 font-karla font-bold`}
                          style={color}
                        >
                          {info?.averageScore}%
                        </div>
                        <div
                          className={`dynamic-text rounded-md px-2 font-karla font-bold`}
                          style={color}
                        >
                          {info?.type}
                        </div>
                        <div
                          className={`dynamic-text rounded-md px-2 font-karla font-bold`}
                          style={color}
                        >
                          {info?.status}
                        </div>
                        <div
                          className={`dynamic-text rounded-md px-2 font-karla font-bold`}
                          style={color}
                        >
                          Sub | EN
                        </div>
                        {info && info.nextAiringEpisode && (
                          <div
                            className={`dynamic-text shadow-button rounded-md px-2 font-karla font-bold`}
                            style={color}
                          >
                            Ep {info.nextAiringEpisode.episode}: {time}
                          </div>
                        )}
                      </div>
                    ) : (
                      <Skeleton width={240} height={32} />
                    )}
                  </div>
                  {info ? (
                    <p
                      dangerouslySetInnerHTML={{ __html: info?.description }}
                      className="overflow-y-scroll scrollbar-thin pr-2  scrollbar-thumb-secondary scrollbar-thumb-rounded-lg h-[140px]"
                    />
                  ) : (
                    <Skeleton className="h-[130px]" />
                  )}
                  {/* <p>{data.description}</p> */}
                </div>
              </div>

              <div>
                <div className="flex gap-5 items-center">
                  {info && (
                    <div className="p-3 lg:p-0 text-[20px] md:text-2xl font-bold font-karla">
                      Relations
                    </div>
                  )}
                  {info?.relations?.edges?.length > 3 && (
                    <div
                      className="cursor-pointer"
                      onClick={() => setShowAll(!showAll)}
                    >
                      {showAll ? "show less" : "show more"}
                    </div>
                  )}
                </div>
                <div
                  className={`w-screen lg:w-full grid lg:grid-cols-3 justify-items-center gap-7 lg:pt-7 lg:pb-5 px-3 lg:px-4 pt-4 rounded-xl`}
                >
                  {info?.relations?.edges ? (
                    info?.relations?.edges
                      .slice(0, showAll ? info?.relations?.edges.length : 3)
                      .map((r, index) => {
                        const rel = r.node;
                        return (
                          <Link
                            key={rel.id}
                            href={
                              rel.type === "ANIME" ||
                              rel.type === "OVA" ||
                              rel.type === "MOVIE" ||
                              rel.type === "SPECIAL" ||
                              rel.type === "ONA"
                                ? `/anime/${rel.id}`
                                : `/manga/detail/id?aniId=${
                                    rel.id
                                  }&aniTitle=${encodeURIComponent(
                                    info?.title?.english ||
                                      info?.title.romaji ||
                                      info?.title.native
                                  )}`
                            }
                            className={`hover:scale-[1.02] hover:shadow-lg md:px-0 px-4 scale-100 transition-transform duration-200 ease-out w-full ${
                              rel.type === "MUSIC" ? "pointer-events-none" : ""
                            }`}
                          >
                            <div
                              key={rel.id}
                              className="w-full shrink h-[126px] bg-secondary flex rounded-md"
                            >
                              <div className="w-[90px] bg-image rounded-l-md shrink-0">
                                <Image
                                  src={
                                    rel.coverImage.extraLarge ||
                                    rel.coverImage.large
                                  }
                                  alt={rel.id}
                                  height={500}
                                  width={500}
                                  className="object-cover h-full w-full shrink-0 rounded-l-md"
                                />
                              </div>
                              <div className="h-full grid px-3 items-center">
                                <div className="text-action font-outfit font-bold">
                                  {r.relationType}
                                </div>
                                <div className="font-outfit font-thin line-clamp-2">
                                  {rel.title.userPreferred || rel.title.romaji}
                                </div>
                                <div className={``}>{rel.type}</div>
                              </div>
                            </div>
                          </Link>
                        );
                      })
                  ) : (
                    <>
                      {[1, 2, 3].map((item) => (
                        <div key={item} className="w-full hidden md:block">
                          <Skeleton className="h-[126px]" />
                        </div>
                      ))}
                      <div className="w-full md:hidden">
                        <Skeleton className="h-[126px]" />
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div className="z-20 flex flex-col gap-10 p-3 lg:p-0">
                <div className="flex items-center md:gap-10 gap-7">
                  {info && (
                    <h1 className="text-[20px] md:text-2xl font-bold font-karla">
                      Episodes
                    </h1>
                  )}
                  {info?.nextAiringEpisode && (
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-4">
                        <h1>Next Ep :</h1>
                        <div
                          className="px-5 rounded-sm font-karla font-bold bg-white text-black"
                          // style={color}
                        >
                          {time}
                        </div>
                      </div>
                      <div className="h-6 w-6">
                        <ClockIcon />
                      </div>
                    </div>
                  )}
                  {statuses && (
                    <>
                      <div className="hidden font-karla relative group md:flex justify-center">
                        {statuses}
                        <span className="absolute bottom-8  shadow-lg invisible group-hover:visible transition-all opacity-0 group-hover:opacity-100 font-karla font-light bg-secondary p-1 px-2 rounded-lg">
                          status
                        </span>
                      </div>
                    </>
                  )}
                </div>
                {loading ? (
                  data && (
                    <div className="flex h-[640px] flex-col gap-5 scrollbar-thin scrollbar-thumb-[#1b1c21] scrollbar-thumb-rounded-full overflow-y-scroll hover:scrollbar-thumb-[#2e2f37]">
                      {episode?.length !== 0 ? (
                        episode?.map((epi, index) => {
                          return (
                            <div
                              key={index}
                              className="flex flex-col gap-3 px-2"
                            >
                              <Link
                                href={`/anime/watch/${epi.id}/${data.id}/${
                                  stall ? `9anime` : ""
                                }`}
                                className={`text-start text-sm md:text-lg ${
                                  progress && epi.number <= progress
                                    ? "text-[#5f5f5f]"
                                    : "text-white"
                                }`}
                              >
                                <p>Episode {epi.number}</p>
                                {epi.title && (
                                  <p
                                    className={`text-xs md:text-sm ${
                                      progress && epi.number <= progress
                                        ? "text-[#5f5f5f]"
                                        : "text-[#b1b1b1]"
                                    } italic`}
                                  >
                                    "{epi.title}"
                                  </p>
                                )}
                              </Link>
                              {index !== episode?.length - 1 && (
                                <span className="h-[1px] bg-white" />
                              )}
                            </div>
                          );
                        })
                      ) : (
                        <p>No Episodes Available</p>
                      )}
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
            </div>
            {rec && (
              <div className="w-screen md:w-[80%]">
                <Content
                  ids="recommendAnime"
                  section="Recommendations"
                  data={rec}
                />
              </div>
            )}
            <div></div>
            <div></div>
          </div>
        </Layout>
      </SkeletonTheme>
    </>
  );
}

function convertSecondsToTime(sec) {
  let days = Math.floor(sec / (3600 * 24));
  let hours = Math.floor((sec % (3600 * 24)) / 3600);
  let minutes = Math.floor((sec % 3600) / 60);

  let time = "";

  if (days > 0) {
    time += `${days}d `;
  }

  if (hours > 0) {
    time += `${hours}h `;
  }

  if (minutes > 0) {
    time += `${minutes}m `;
  }

  return time.trim();
}

function getBrightness(hexColor) {
  if (!hexColor) {
    return 200;
  }
  const rgb = hexColor
    .match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i)
    .slice(1)
    .map((x) => parseInt(x, 16));
  return (299 * rgb[0] + 587 * rgb[1] + 114 * rgb[2]) / 1000;
}

function setTxtColor(hexColor) {
  const brightness = getBrightness(hexColor);
  return brightness < 150 ? "#fff" : "#000";
}
