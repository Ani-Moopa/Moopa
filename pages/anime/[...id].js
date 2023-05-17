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
import Modal from "../../components/modal";

import { signIn, useSession } from "next-auth/react";
import AniList from "../../components/media/aniList";
import ListEditor from "../../components/listEditor";
import { closestMatch } from "closest-match";

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

export default function Info({ info, color }) {
  const { data: session } = useSession();
  const [data, setData] = useState(null);
  const [episode, setEpisode] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statuses, setStatuses] = useState(null);
  const [stall, setStall] = useState(false);
  const [domainUrl, setDomainUrl] = useState("");

  const [showAll, setShowAll] = useState(false);
  const [open, setOpen] = useState(false);

  const [time, setTime] = useState(0);
  const { id } = useRouter().query;

  const [epiStatus, setEpiStatus] = useState("ok");
  const [error, setError] = useState(null);

  const rec = info?.recommendations?.nodes.map(
    (data) => data.mediaRecommendation
  );

  useEffect(() => {
    const { protocol, host } = window.location;
    const url = `${protocol}//${host}`;

    setDomainUrl(url);

    const defaultState = {
      data: null,
      // info: null,
      episode: null,
      loading: true,
      statuses: null,
      progress: null,
      stall: false,
      EpiStatus: "ok",
      error: null,
    };

    // Reset all state variables to their default values
    Object.keys(defaultState).forEach((key) => {
      document.body.style.overflow = "auto";
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
          const [res] = await Promise.all([
            fetch(`https://api.moopa.my.id/meta/anilist/info/${id?.[0]}`),
            // fetch("https://graphql.anilist.co/", {
            //   method: "POST",
            //   headers: {
            //     "Content-Type": "application/json",
            //   },
            //   body: JSON.stringify({
            //     query: infoQuery,
            //     variables: {
            //       id: id?.[0],
            //     },
            //   }),
            // }),
          ]);
          const data = await res.json();
          // const infos = await info.json();

          if (res.status === 500) {
            setEpisode(null);
            setEpiStatus("error");
            setError(data.message);
          } else if (res.status === 404) {
            window.location.href("/404");
          }
          // setInfo(infos.data.Media);
          // setLog(data);

          // const textColor = setTxtColor(infos.data.Media.coverImage?.color);

          if (!data || data?.episodes?.length === 0) {
            const res = await fetch(
              `https://api.moopa.my.id/anime/gogoanime/${info.title.romaji}`
            );
            const datas = await res.json();

            if (datas) {
              const release = datas.results.map((i) => i.releaseDate);
              const match = closestMatch(info.startDate.year, release);
              const filter = datas.results.find((i) => i.releaseDate === match);

              // const found = filter.find((i) => i.title === info.title.romaji);

              // setLog(found);

              if (filter) {
                const res = await fetch(
                  `https://api.moopa.my.id/anime/gogoanime/info/${filter.id}`
                );
                const dataA = await res.json();
                setEpisode(dataA.episodes);
                // setLog(dataA);
              }
            } else if (res.status === 500) {
              setEpisode(null);
              setEpiStatus("error");
              setError(datas.message);
            } else {
              setEpisode(datas.episodes);
            }
            // setColor({
            //   backgroundColor: `${data?.color || "#ffff"}`,
            //   color: textColor,
            // });
          } else {
            setEpisode(data.episodes);
          }

          // setColor({
          //   backgroundColor: `${data?.color || "#ffff"}`,
          //   color: textColor,
          // });

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
              item.find((item) => item.mediaId === parseInt(id[0]))
            );
            const gut = git?.find((item) => item?.mediaId === parseInt(id[0]));

            if (gut) {
              setProgress(gut?.progress);
              if (gut.status === "CURRENT") {
                setStatuses({ name: "Watching", value: "CURRENT" });
              } else if (gut.status === "PLANNING") {
                setStatuses({ name: "Plan to watch", value: "PLANNING" });
              } else if (gut.status === "COMPLETED") {
                setStatuses({ name: "Completed", value: "COMPLETED" });
              } else if (gut.status === "DROPPED") {
                setStatuses({ name: "Dropped", value: "DROPPED" });
              } else if (gut.status === "PAUSED") {
                setStatuses({ name: "Paused", value: "PAUSED" });
              } else if (gut.status === "REPEATING") {
                setStatuses({ name: "Rewatching", value: "REPEATING" });
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
  }, [id, session?.user?.name, info]);

  function handleOpen() {
    setOpen(true);
    document.body.style.overflow = "hidden";
  }

  function handleClose() {
    setOpen(false);
    document.body.style.overflow = "auto";
  }

  return (
    <>
      <Head>
        <title>
          {info
            ? info?.title?.romaji || info?.title?.english
            : "Retrieving Data..."}
        </title>
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content={`Moopa - ${info.title.romaji || info.title.english}`}
        />
        <meta
          name="twitter:description"
          content={`${info.description?.slice(0, 180)}...`}
        />
        <meta
          name="twitter:image"
          content={`${domainUrl}/api/og?title=${
            info.title.romaji || info.title.english
          }&image=${info.bannerImage || info.coverImage.extraLarge}`}
        />
      </Head>
      <Modal open={open} onClose={() => handleClose()}>
        <div>
          {!session && (
            <div className="flex-center flex-col gap-5 px-10 py-5 bg-secondary rounded-md">
              <h1 className="text-md font-extrabold font-karla">
                Edit your list
              </h1>
              <button
                className="flex items-center bg-[#363642] rounded-md text-white p-1"
                onClick={() => signIn("AniListProvider")}
              >
                <h1 className="px-1 font-bold font-karla">
                  Login with AniList
                </h1>
                <div className="scale-[60%] pb-[1px]">
                  <AniList />
                </div>
              </button>
            </div>
          )}
          {session && loading && info && (
            <ListEditor
              animeId={info?.id}
              session={session}
              stats={statuses}
              prg={progress}
              max={info?.episodes}
              image={info}
            />
          )}
        </div>
      </Modal>
      <SkeletonTheme baseColor="#232329" highlightColor="#2a2a32">
        <Layout navTop="text-white bg-primary lg:pt-0 lg:px-0 bg-slate bg-opacity-40 z-50">
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
                  priority={true}
                  alt="banner anime"
                  height={1000}
                  width={1000}
                  className="object-cover bg-image w-screen absolute top-0 left-0 h-[300px] brightness-[70%] z-0"
                />
              ) : (
                <div className="bg-image w-screen absolute top-0 left-0 h-[300px]" />
              )}
            </div>
            <div className="lg:w-[90%] xl:w-[75%] lg:pt-[10rem] z-30 flex flex-col gap-5">
              {/* Mobile */}

              <div className="lg:hidden pt-5 w-screen px-5 flex flex-col">
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
                        <button
                          type="button"
                          className="bg-action px-10 rounded-sm font-karla font-bold"
                          onClick={() => handleOpen()}
                        >
                          {loading
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

              {/* PC */}
              <div className="hidden lg:flex gap-8 w-full flex-nowrap">
                <div className="shrink-0 lg:h-[250px] lg:w-[180px] w-[115px] h-[164px] relative">
                  {info ? (
                    <>
                      <div className="bg-image lg:h-[250px] lg:w-[180px] w-[115px] h-[164px] bg-opacity-30 absolute backdrop-blur-lg z-10 -top-7" />
                      <Image
                        src={
                          info.coverImage.extraLarge || info.coverImage.large
                        }
                        priority={true}
                        alt="poster anime"
                        height={700}
                        width={700}
                        className="object-cover lg:h-[250px] lg:w-[180px] w-[115px] h-[164px] z-20 absolute rounded-md -top-7"
                      />
                      <button
                        type="button"
                        className="bg-action flex-center z-20 h-[20px] w-[180px] absolute bottom-0 rounded-sm font-karla font-bold"
                        onClick={() => handleOpen()}
                      >
                        {loading
                          ? statuses
                            ? statuses.name
                            : "Add to List"
                          : "Loading..."}
                      </button>
                    </>
                  ) : (
                    <Skeleton className="h-[250px] w-[180px]" />
                  )}
                </div>

                {/* PC */}
                <div className="hidden lg:flex w-full flex-col gap-5 h-[250px]">
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
                        {info?.episodes && (
                          <div
                            className={`dynamic-text rounded-md px-2 font-karla font-bold`}
                            style={color}
                          >
                            {info?.episodes} Episodes
                          </div>
                        )}
                        {info?.startDate?.year && (
                          <div
                            className={`dynamic-text rounded-md px-2 font-karla font-bold`}
                            style={color}
                          >
                            {info?.startDate?.year}
                          </div>
                        )}
                        {info?.averageScore && (
                          <div
                            className={`dynamic-text rounded-md px-2 font-karla font-bold`}
                            style={color}
                          >
                            {info?.averageScore}%
                          </div>
                        )}
                        {info?.type && (
                          <div
                            className={`dynamic-text rounded-md px-2 font-karla font-bold`}
                            style={color}
                          >
                            {info?.type}
                          </div>
                        )}
                        {info?.status && (
                          <div
                            className={`dynamic-text rounded-md px-2 font-karla font-bold`}
                            style={color}
                          >
                            {info?.status}
                          </div>
                        )}
                        <div
                          className={`dynamic-text rounded-md px-2 font-karla font-bold`}
                          style={color}
                        >
                          Sub | EN
                        </div>
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
                </div>
              </div>

              <div>
                <div className="flex gap-5 items-center">
                  {info && (
                    <div className="p-3 lg:p-0 text-[20px] lg:text-2xl font-bold font-karla">
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
                            className={`hover:scale-[1.02] hover:shadow-lg lg:px-0 px-4 scale-100 transition-transform duration-200 ease-out w-full ${
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
                        <div key={item} className="w-full hidden lg:block">
                          <Skeleton className="h-[126px]" />
                        </div>
                      ))}
                      <div className="w-full lg:hidden">
                        <Skeleton className="h-[126px]" />
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div className="z-20 flex flex-col gap-10 p-3 lg:p-0">
                <div className="flex items-center lg:gap-10 gap-7">
                  {info && (
                    <h1 className="text-[20px] lg:text-2xl font-bold font-karla">
                      Episodes
                    </h1>
                  )}
                  {info?.nextAiringEpisode && (
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-4 text-[10px] xxs:text-sm lg:text-base">
                        <h1>Next :</h1>
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
                </div>
                {loading ? (
                  data && (
                    <div className="flex h-[640px] flex-col gap-5 scrollbar-thin scrollbar-thumb-[#1b1c21] scrollbar-thumb-rounded-full overflow-y-scroll hover:scrollbar-thumb-[#2e2f37]">
                      {epiStatus === "ok" ? (
                        episode?.length !== 0 && episode ? (
                          episode?.map((epi, index) => {
                            return (
                              <div
                                key={index}
                                className="flex flex-col gap-3 px-2"
                              >
                                <Link
                                  href={`/anime/watch/${epi.id}/${info.id}/${
                                    stall ? `9anime` : ""
                                  }`}
                                  className={`text-start text-sm lg:text-lg ${
                                    progress && epi.number <= progress
                                      ? "text-[#5f5f5f]"
                                      : "text-white"
                                  }`}
                                >
                                  <p>Episode {epi.number}</p>
                                  {epi.title && (
                                    <p
                                      className={`text-xs lg:text-sm ${
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
                        )
                      ) : (
                        // <p className="flex-center">
                        //   Something went wrong, can't retrieve any episodes :/
                        // </p>
                        <div className="flex flex-col">
                          {/* <h1>{epiStatus} while retrieving data</h1> */}
                          <pre
                            className={`rounded-md ${getLanguageClassName(
                              "bash"
                            )}`}
                          >
                            <code>
                              Something went wrong while retrieving data :/
                            </code>
                          </pre>
                        </div>
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
            {info && rec?.length !== 0 && (
              <div className="w-screen lg:w-[90%] xl:w-[85%]">
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

export async function getServerSideProps(context) {
  const { id } = context.query;

  const res = await fetch("https://graphql.anilist.co/", {
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
  });

  const json = await res.json();
  const data = json?.data?.Media;

  if (!data) {
    return {
      notFound: true,
    };
  }

  const textColor = setTxtColor(data?.coverImage?.color);

  const color = {
    backgroundColor: `${data?.coverImage?.color || "#ffff"}`,
    color: textColor,
  };

  return {
    props: {
      info: data,
      color: color,
    },
  };
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

const getLanguageClassName = (language) => {
  switch (language) {
    case "javascript":
      return "language-javascript";
    case "html":
      return "language-html";
    case "bash":
      return "language-bash";
    // add more languages here as needed
    default:
      return "";
  }
};
