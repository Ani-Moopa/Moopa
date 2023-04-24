import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

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

export default function Info() {
  const { data: session, status } = useSession();
  const [data, setData] = useState(null);
  const [episode, setEpisode] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(null);
  const [statuses, setStatuses] = useState(null);
  const [stall, setStall] = useState(false);
  const [color, setColor] = useState(null);

  const [showAll, setShowAll] = useState(false);

  const [time, setTime] = useState(0);
  const { id } = useRouter().query;

  // console.log(stall);

  useEffect(() => {
    const defaultState = {
      data: null,
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
          const res = await fetch(
            `https://api.moopa.my.id/meta/anilist/info/${id?.[0]}`
          );
          const data = await res.json();
          if (data.episodes.length === 0) {
            const res = await fetch(
              `https://api.consumet.org/meta/anilist/info/${id[0]}?provider=9anime`
            );
            const datas = await res.json();
            setColor({ backgroundColor: `${data?.color || "white"}` });
            setStall(true);
            setEpisode(datas.episodes);
          } else {
            setEpisode(data.episodes);
          }

          setColor({ backgroundColor: `${data?.color || "white"}` });

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

          function getBrightness(color) {
            const rgb = color.match(/\d+/g);
            return (299 * rgb[0] + 587 * rgb[1] + 114 * rgb[2]) / 1000;
          }

          // set the text color based on the background color
          function setTextColor(element) {
            const backgroundColor = getComputedStyle(element).backgroundColor;
            const brightness = getBrightness(backgroundColor);
            if (brightness < 128) {
              element.style.color = "#fff"; // white
            } else {
              element.style.color = "#000"; // black
            }
          }

          const elements = document.querySelectorAll(".dynamic-text");
          elements.forEach((element) => {
            setTextColor(element);
          });

          setData(data);
          setLoading(true);
        } catch (error) {
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        }
      }
      // setLoading(true);
    }
    fetchData();
  }, [id, session?.user?.name]);
  // console.log(episode);
  return (
    <>
      <Head>
        <title>{data?.title?.romaji || data?.title?.english}</title>
      </Head>
      <SkeletonTheme baseColor="#3B3C41" highlightColor="#4D4E52">
        <Layout navTop="text-white bg-primary md:pt-0 md:px-0 bg-slate bg-opacity-40 z-50">
          <div className="w-screen min-h-screen relative flex flex-col items-center bg-primary gap-5">
            <div className="bg-image">
              <div className="bg-gradient-to-t from-primary from-10% to-transparent absolute h-[300px] w-screen z-10 inset-0" />
              {data && (
                <Image
                  src={data?.cover}
                  alt="banner anime"
                  height={1000}
                  width={1000}
                  className="object-cover bg-image w-screen absolute top-0 left-0 h-[300px] brightness-75 z-0"
                />
              )}
            </div>
            <div className="lg:w-[70%] pt-[10rem] z-30 flex flex-col gap-10">
              <div className="md:flex gap-5 w-full flex-nowrap">
                <div className="shrink-0 md:h-[250px] md:w-[180px] w-[115px] h-[164px] relative">
                  {loading ? (
                    data && (
                      <>
                        <div className="bg-image md:h-[250px] md:w-[180px] w-[115px] h-[164px] bg-opacity-30 absolute backdrop-blur-lg z-10" />
                        <Image
                          src={data.image}
                          alt="poster anime"
                          height={700}
                          width={700}
                          className="object-cover md:h-[250px] md:w-[180px] w-[115px] h-[164px] z-20 absolute"
                        />
                      </>
                    )
                  ) : (
                    <Skeleton className="h-[250px] w-[180px]" />
                  )}
                </div>
                <div className="flex w-full flex-col gap-10 h-[250px]">
                  <div className="flex flex-col gap-2">
                    <h1 className=" font-inter font-bold text-[36px] text-white line-clamp-1">
                      {loading ? (
                        data?.title?.romaji || data?.title?.english
                      ) : (
                        <Skeleton width={450} />
                      )}
                    </h1>
                    {loading ? (
                      data && (
                        <div>
                          <div className="flex gap-6">
                            <div
                              className={`dynamic-text text-black rounded-md px-2 font-karla font-bold`}
                              style={color}
                            >
                              {data?.totalEpisodes} Episodes
                            </div>
                            <div
                              className={`dynamic-text text-black rounded-md px-2 font-karla font-bold`}
                              style={color}
                            >
                              {data?.releaseDate}
                            </div>
                            <div
                              className={`dynamic-text text-black rounded-md px-2 font-karla font-bold`}
                              style={color}
                            >
                              {data?.rating}%
                            </div>
                            <div
                              className={`dynamic-text text-black rounded-md px-2 font-karla font-bold`}
                              style={color}
                            >
                              {data?.type}
                            </div>
                            <div
                              className={`dynamic-text text-black rounded-md px-2 font-karla font-bold`}
                              style={color}
                            >
                              {data?.status}
                            </div>
                            <div
                              className={`dynamic-text text-black rounded-md px-2 font-karla font-bold`}
                              style={color}
                            >
                              Sub | EN
                            </div>
                            {data && data.nextAiringEpisode && (
                              <div
                                className={`dynamic-text text-black shadow-button rounded-md px-2 font-karla font-bold`}
                                style={color}
                              >
                                Ep {data.nextAiringEpisode.episode}: {time}
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    ) : (
                      <Skeleton width={240} height={32} />
                    )}
                  </div>
                  {loading ? (
                    <p
                      dangerouslySetInnerHTML={{ __html: data?.description }}
                      className="overflow-y-scroll scrollbar-thin pr-2  scrollbar-thumb-secondary scrollbar-thumb-rounded-lg h-[125px]"
                    />
                  ) : (
                    <Skeleton className="h-[110px]" />
                  )}
                  {/* <p>{data.description}</p> */}
                </div>
              </div>

              <div>
                <div className="flex gap-5 items-center">
                  {data && (
                    <div className="p-3 lg:p-0 text-[20px] md:text-2xl font-bold font-karla">
                      Relations
                    </div>
                  )}
                  {data?.relations?.length > 3 && (
                    <div
                      className="cursor-pointer"
                      onClick={() => setShowAll(!showAll)}
                    >
                      {showAll ? "show less" : "show more"}
                    </div>
                  )}
                </div>
                <div
                  className={`w-screen lg:w-full grid lg:grid-cols-3 justify-items-center gap-7 lg:pt-7 px-3 lg:px-4 pt-10 rounded-xl`}
                >
                  {loading
                    ? data?.relations &&
                      data?.relations
                        .slice(0, showAll ? data?.relations.length : 3)
                        .map((relation, index) => {
                          return (
                            <Link
                              key={relation.id}
                              href={
                                relation.type === "TV" ||
                                relation.type === "OVA" ||
                                relation.type === "MOVIE" ||
                                relation.type === "SPECIAL" ||
                                relation.type === "ONA"
                                  ? `/anime/${relation.id}`
                                  : `/manga/detail/id?aniId=${
                                      relation.id
                                    }&aniTitle=${encodeURIComponent(
                                      data?.title?.english ||
                                        data?.title.romaji ||
                                        data?.title.native
                                    )}`
                              }
                              className={`hover:scale-[1.02] hover:shadow-lg md:px-0 px-4 scale-100 transition-transform duration-200 ease-out w-full ${
                                relation.type === "MUSIC"
                                  ? "pointer-events-none"
                                  : ""
                              }`}
                            >
                              <div
                                key={relation.id}
                                className="w-full shrink h-[126px] bg-secondary flex rounded-md"
                              >
                                <div className="w-[90px] bg-image rounded-l-md shrink-0">
                                  <Image
                                    src={relation.image}
                                    alt={relation.id}
                                    height={500}
                                    width={500}
                                    className="object-cover h-full w-full shrink-0 rounded-l-md"
                                  />
                                </div>
                                <div className="h-full grid px-3 items-center">
                                  <div className="text-action font-outfit font-bold">
                                    {relation.relationType}
                                  </div>
                                  <div className="font-outfit font-thin line-clamp-2">
                                    {relation.title.romaji}
                                  </div>
                                  <div className={``}>{relation.type}</div>
                                </div>
                              </div>
                            </Link>
                          );
                        })
                    : [1, 2, 3].map((item) => (
                        <div key={item} className="w-full">
                          <Skeleton className="h-[126px]" />
                        </div>
                      ))}
                </div>
              </div>
              <div className="z-20 flex flex-col gap-10 p-3 lg:p-0">
                <div className="flex items-center md:gap-10 gap-7">
                  {data && (
                    <h1 className="text-[20px] md:text-2xl font-bold font-karla">
                      Episodes
                    </h1>
                  )}
                  {statuses && (
                    <>
                      <div className="font-karla relative group flex justify-center">
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
                      {episode ? (
                        episode.map((episode, index) => {
                          return (
                            <div
                              key={index}
                              className="flex flex-col gap-3 px-2"
                            >
                              <Link
                                href={`/anime/watch/${episode.id}/${data.id}/${
                                  stall ? `9anime` : ""
                                }`}
                                className={`text-start text-sm md:text-lg ${
                                  episode.number <= progress
                                    ? "text-[#5f5f5f]"
                                    : "text-white"
                                }`}
                              >
                                <p>Episode {episode.number}</p>
                                {episode.title && (
                                  <p
                                    className={`text-xs md:text-sm ${
                                      episode.number <= progress
                                        ? "text-[#5f5f5f]"
                                        : "text-[#b1b1b1]"
                                    } italic`}
                                  >
                                    "{episode.title}"
                                  </p>
                                )}
                              </Link>
                              <div className="h-[1px] bg-white" />
                            </div>
                          );
                        })
                      ) : (
                        <p>No Episodes Available</p>
                      )}
                    </div>
                  )
                ) : (
                  <></>
                )}
              </div>
            </div>
            {data && (
              <div className="w-screen md:w-[80%]">
                <Content
                  ids="recommendAnime"
                  section="Recommendations"
                  data={data.recommendations}
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
