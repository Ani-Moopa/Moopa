import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import {
  ChevronDownIcon,
  ClockIcon,
  HeartIcon,
} from "@heroicons/react/20/solid";
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

import { GET_MEDIA_USER } from "../../queries";
import { GET_MEDIA_INFO } from "../../queries";

// import { aniInfo } from "../../components/devComp/data";
// console.log(GET_MEDIA_USER);

export default function Info({ info, color }) {

  // Episodes Pagination
  const  [firstEpisodeIndex,setFirstEpisodeIndex ] = useState(0);
  const  [lastEpisodeIndex,setLastEpisodeIndex ] = useState();

  function onEpisodeIndexChange(e) {
    if(e.target.value==="All"){
      setFirstEpisodeIndex(0);
      setLastEpisodeIndex();
      return;
    }
    setFirstEpisodeIndex(e.target.value.split(" to ")[0]-1);
    setLastEpisodeIndex(e.target.value.split(" to ")[1]);
  }
  useEffect(() => {
    setFirstEpisodeIndex(0);
    setLastEpisodeIndex();
  }, [info]);
  
 
  const { data: session } = useSession();
  const [episode, setEpisode] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statuses, setStatuses] = useState(null);
  const [domainUrl, setDomainUrl] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [time, setTime] = useState(0);
  const { id } = useRouter().query;

  const [epiView, setEpiView] = useState("3");

  const [artStorage, setArtStorage] = useState(null);

  const rec = info?.recommendations?.nodes?.map(
    (data) => data.mediaRecommendation
  );

  const [provider, setProvider] = useState();
  const [prvValue, setPrvValue] = useState("gogoanime");
  // const [err, setErr] = useState('');

  function handleProvider(e) {
    setEpisode(
      Array.isArray(provider[e.target.value])
        ? provider[e.target.value]?.reverse()
        : provider[e.target.value]
    );
    setPrvValue(e.target.value);
    localStorage.setItem("provider", e.target.value);
  }
  
  useEffect(() => {
    handleClose();
    async function fetchData() {
      setLoading(true);
      if (id) {
        try {
          const { protocol, host } = window.location;
          const prv = localStorage.getItem("provider");
          const url = `${protocol}//${host}`;

          const view = localStorage.getItem("epiView");

          if (prv) {
            setPrvValue(prv);
          } else {
            setPrvValue("gogoanime");
          }

          setDomainUrl(url);

          setArtStorage(JSON.parse(localStorage.getItem("artplayer_settings")));

          setEpisode(null);
          setProgress(0);
          setStatuses(null);

          let reloadCount = 0;

          try {
            const fetchPromises = [
              fetch(
                `https://api.moopa.my.id/meta/anilist/info/${info.id}?provider=enime`
              ),
              fetch(
                `https://api.moopa.my.id/meta/anilist/info/${info.id}?provider=zoro`
              ),
              fetch(
                `https://api.moopa.my.id/meta/anilist/info/${info.id}?provider=gogoanime`
              ),
            ];

            const results = await Promise.allSettled(fetchPromises);
            const successfulResponses = [];
            let errorCount = 0;

            results.forEach((result) => {
              if (result.status === "fulfilled") {
                successfulResponses.push(result.value);
              } else {
                errorCount++;
              }
            });

            if (errorCount === fetchPromises.length) {
              // All fetch requests failed, handle the error here
              setEpisode([]);
            } else {
              // Process the successfulResponses here
              const responsesData = await Promise.all(
                successfulResponses.map((response) => response.json())
              );
              const [enime, zoro, gogoanime] = responsesData;

              const prov = {
                enime: enime?.episodes || enime,
                zoro: zoro?.episodes || zoro,
                gogoanime: gogoanime?.episodes || gogoanime,
              };

              const infProv = {
                enime: enime,
                zoro: zoro,
                gogoanime: gogoanime,
              };

              if (prv) {
                setEpisode(
                  Array.isArray(prov[prv]) ? prov[prv]?.reverse() : prov[prv]
                );
              } else {
                setEpisode(
                  Array.isArray(prov["gogoanime"])
                    ? prov["gogoanime"]?.reverse()
                    : prov["gogoanime"]
                );
              }

              const data = infProv[prv] || infProv["gogoanime"];
              // const data = aniInfo;
              if (!data || data?.episodes?.length === 0) {
                setEpisode([]);
              } else {
                if (data.episodes?.some((i) => i.title === null)) {
                  setEpiView("3");
                } else if (view) {
                  setEpiView(view);
                } else {
                  setEpiView("3");
                }
              }

              if (session?.user?.name) {
                const response = await fetch("https://graphql.anilist.co/", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    query: GET_MEDIA_USER,
                    variables: {
                      username: session?.user?.name,
                    },
                  }),
                });

                const responseData = await response.json();

                const prog = responseData?.data?.MediaListCollection;

                if (prog && prog.lists.length > 0) {
                  const gut = prog.lists
                    .flatMap((item) => item.entries)
                    .find((item) => item.mediaId === parseInt(id[0]));

                  if (gut) {
                    setProgress(gut.progress);
                    const statusMapping = {
                      CURRENT: { name: "Watching", value: "CURRENT" },
                      PLANNING: { name: "Plan to watch", value: "PLANNING" },
                      COMPLETED: { name: "Completed", value: "COMPLETED" },
                      DROPPED: { name: "Dropped", value: "DROPPED" },
                      PAUSED: { name: "Paused", value: "PAUSED" },
                      REPEATING: { name: "Rewatching", value: "REPEATING" },
                    };
                    setStatuses(statusMapping[gut.status]);
                  }
                }
              }

              if (data.nextAiringEpisode) {
                setTime(
                  convertSecondsToTime(data.nextAiringEpisode.timeUntilAiring)
                );
              }

              setProvider(prov);
            }
          } catch (error) {
            console.error(error);
            if (reloadCount < 2) {
              reloadCount++;
              setTimeout(() => {
                window.location.reload();
              }, 1000);
            } else {
              setEpisode([]);
            }
          }
        } catch (error) {
          console.error(error);
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        } finally {
          setLoading(false);
        }
      }
    }
    fetchData();
  }, [id, info, session?.user?.name]);

  // console.log();

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
          {session && info && (
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
                        >
                          <span className="">{item}</span>
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
                        {!loading
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
                  {info?.relations?.edges?.length > 0 && (
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
              <div className="flex flex-col gap-5 lg:gap-10 p-3 lg:p-0">
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
                              {time}
                            </div>
                          </div>
                          <div className="h-6 w-6">
                            <ClockIcon />
                          </div>
                        </div>
                      )}
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
                  { episode?.length>50 && episode[0]?.number===1 && (
                  <div className="relative flex gap-2 items-center">
                    <p className=" font-semibold">Episodes</p>
                      <select onChange={onEpisodeIndexChange}
                        className="rounded-md px-2 pr-7 py-1 focus:outline-none focus:ring-2 focus:ring-action focus:border-action appearance-none"
                      >
                        <option value="All">All</option>
                      {       
                          [...Array(Math.ceil(episode?.length / 50))].map((_, index) => {
                          const start = index * 50 + 1;
                          const end = Math.min(start + 50 - 1, episode?.length);
                          const optionLabel = `${start} to ${end}`;
                          return <option value={optionLabel}>{optionLabel}</option>;
                        })
                      }
                      </select>
                      <ChevronDownIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 w-5 h-5 pointer-events-none" />
                    </div>)
                  }
                  <div
                    className={`flex lg:flex items-center gap-0 lg:gap-5 justify-between ${
                      visible ? "" : "hidden"
                    }`}
                  >
                    <div className="relative">
                      <select
                        onChange={handleProvider}
                        value={prvValue}
                        className="flex items-center text-sm gap-5 rounded-[3px] bg-secondary py-1 px-3 pr-8 font-karla appearance-none cursor-pointer outline-none"
                      >
                        <option value="gogoanime">Gogoanime</option>
                        <option value="zoro">Zoro</option>
                        <option value="enime">Enime</option>
                      </select>
                      <ChevronDownIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 w-5 h-5 pointer-events-none" />
                    </div>
                    <div className="flex gap-3 rounded-sm items-center p-2">
                      <div
                        className={
                          episode?.length > 0
                            ? episode?.some((item) => item?.title === null)
                              ? "pointer-events-none"
                              : "cursor-pointer"
                            : "pointer-events-none"
                        }
                        onClick={() => {
                          setEpiView("1");
                          localStorage.setItem("epiView", "1");
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="31"
                          height="20"
                          fill="none"
                          viewBox="0 0 31 20"
                        >
                          <rect
                            width="31"
                            height="20"
                            className={`${
                              episode?.length > 0
                                ? episode?.some((item) => item?.title === null)
                                  ? "fill-[#1c1c22]"
                                  : epiView === "1"
                                  ? "fill-action"
                                  : "fill-[#3A3A44]"
                                : "fill-[#1c1c22]"
                            }`}
                            rx="3"
                          ></rect>
                        </svg>
                      </div>
                      <div
                        className={
                          episode?.length > 0
                            ? episode?.some((item) => item?.title === null)
                              ? "pointer-events-none"
                              : "cursor-pointer"
                            : "pointer-events-none"
                        }
                        onClick={() => {
                          setEpiView("2");
                          localStorage.setItem("epiView", "2");
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="33"
                          height="20"
                          fill="none"
                          className={`${
                            episode?.length > 0
                              ? episode?.some((item) => item?.title === null)
                                ? "fill-[#1c1c22]"
                                : epiView === "2"
                                ? "fill-action"
                                : "fill-[#3A3A44]"
                              : "fill-[#1c1c22]"
                          }`}
                          viewBox="0 0 33 20"
                        >
                          <rect width="33" height="7" y="1" rx="3"></rect>
                          <rect width="33" height="7" y="12" rx="3"></rect>
                        </svg>
                      </div>
                      <div
                        className={
                          episode?.length > 0
                            ? `cursor-pointer`
                            : "pointer-events-none"
                        }
                        onClick={() => {
                          setEpiView("3");
                          localStorage.setItem("epiView", "3");
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="33"
                          height="20"
                          fill="none"
                          className={`${
                            episode?.length > 0
                              ? epiView === "3"
                                ? "fill-action"
                                : "fill-[#3A3A44]"
                              : "fill-[#1c1c22]"
                          }`}
                          viewBox="0 0 33 20"
                        >
                          <rect width="29" height="4" x="2" y="2" rx="2"></rect>
                          <rect width="29" height="4" x="2" y="8" rx="2"></rect>
                          <rect
                            width="16"
                            height="4"
                            x="2"
                            y="14"
                            rx="2"
                          ></rect>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
                {!loading ? (
                  Array.isArray(episode) ? (
                    episode && (
                      <div
                        className={`${
                          epiView === "3" &&
                          "scrollbar-thin scrollbar-thumb-[#1b1c21] scrollbar-thumb-rounded-full overflow-y-scroll hover:scrollbar-thumb-[#2e2f37] h-[640px]"
                        }`}
                      >
                        {episode?.length !== 0 && episode ? (
                          <div
                            className={`grid ${
                              epiView === "1"
                                ? "grid-auto-fit gap-5 lg:gap-8"
                                : "flex flex-col gap-5"
                            }  pb-5 pt-2 lg:pt-0 ${
                              epiView === "3" ? "" : "place-items-center"
                            }`}
                          >
                            {epiView === "1"
                              ? episode.slice(firstEpisodeIndex,lastEpisodeIndex)?.map((epi, index) => {
                                  const time = artStorage?.[epi?.id]?.time;
                                  const duration =
                                    artStorage?.[epi?.id]?.duration;
                                  let prog = (time / duration) * 100;
                                  if (prog > 90) prog = 100;
                                  return (
                                    <Link
                                      key={index}
                                      href={`/anime/watch/${epi.id}/${info.id}/${prvValue}`}
                                      className="transition-all duration-200 ease-out lg:hover:scale-105 hover:ring-1 hover:ring-white cursor-pointer bg-secondary shrink-0 relative w-full h-[180px] sm:h-[130px] subpixel-antialiased rounded-md overflow-hidden"
                                    >
                                      <span className="absolute text-sm z-40 bottom-1 left-2 font-karla font-semibold text-white">
                                        Episode {epi?.number}
                                      </span>
                                      <span
                                        className={`absolute bottom-7 left-0 h-1 bg-red-600`}
                                        style={{
                                          width:
                                            progress &&
                                            artStorage &&
                                            epi?.number <= progress
                                              ? "100%"
                                              : artStorage?.[epi?.id]
                                              ? `${prog}%`
                                              : "0%",
                                        }}
                                      />
                                      <div className="absolute inset-0 bg-black z-30 opacity-20" />
                                      <Image
                                        src={epi?.image}
                                        alt="epi image"
                                        width={500}
                                        height={500}
                                        className="object-cover w-full h-[150px] sm:h-[100px] z-20"
                                      />
                                    </Link>
                                  );
                                })
                              : ""}
                            {epiView === "2" &&
                              episode.slice(firstEpisodeIndex,lastEpisodeIndex).map((epi, index) => {
                                const time = artStorage?.[epi?.id]?.time;
                                const duration =
                                  artStorage?.[epi?.id]?.duration;
                                let prog = (time / duration) * 100;
                                if (prog > 90) prog = 100;
                                return (
                                  <Link
                                    key={index}
                                    href={`/anime/watch/${epi.id}/${info.id}/${prvValue}`}
                                    className="flex group h-[110px] lg:h-[160px] w-full rounded-lg transition-all duration-300 ease-out bg-secondary cursor-pointer hover:scale-[1.02] ring-0 hover:ring-1 hover:shadow-lg ring-white"
                                  >
                                    <div className="w-[43%] lg:w-[30%] relative shrink-0 z-40 rounded-lg overflow-hidden shadow-[4px_0px_5px_0px_rgba(0,0,0,0.3)]">
                                      <div className="relative">
                                        <Image
                                          src={epi?.image}
                                          alt="Anime Cover"
                                          width={1000}
                                          height={1000}
                                          className="object-cover z-30 rounded-lg h-[110px] lg:h-[160px] brightness-[65%]"
                                        />
                                        <span
                                          className={`absolute bottom-0 left-0 h-[3px] bg-red-700`}
                                          style={{
                                            width:
                                              progress &&
                                              artStorage &&
                                              epi?.number <= progress
                                                ? "100%"
                                                : artStorage?.[epi?.id]
                                                ? `${prog}%`
                                                : "0",
                                          }}
                                        />
                                        <span className="absolute bottom-2 left-2 font-karla font-semibold text-sm lg:text-lg">
                                          Episode {epi?.number}
                                        </span>
                                        <div className="z-[9999] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 scale-[1.5]">
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                            className="w-5 h-5 invisible group-hover:visible"
                                          >
                                            <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                                          </svg>
                                        </div>
                                      </div>
                                    </div>

                                    <div
                                      className={`w-[70%] h-full select-none p-4 flex flex-col justify-center gap-5 ${
                                        epi?.id == id ? "text-[#7a7a7a]" : ""
                                      }`}
                                    >
                                      <h1 className="font-karla font-bold text-base lg:text-lg xl:text-xl italic line-clamp-1">
                                        {epi?.title}
                                      </h1>
                                      {epi?.description && (
                                        <p className="line-clamp-2 text-xs lg:text-md xl:text-lg italic font-outfit font-extralight">
                                          {epi?.description}
                                        </p>
                                      )}
                                    </div>
                                  </Link>
                                );
                              })}
                            {epiView === "3" &&
                              episode.slice(firstEpisodeIndex,lastEpisodeIndex).map((epi, index) => {
                                return (
                                  <div
                                    key={index}
                                    className="flex flex-col gap-3 px-2"
                                  >
                                    <Link
                                      href={`/anime/watch/${epi.id}/${info.id}/${prvValue}`}
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
                              })}
                          </div>
                        ) : (
                          <p>No Episodes Available</p>
                        )}
                      </div>
                    )
                  ) : (
                    <div className="flex flex-col">
                      <pre
                        className={`rounded-md overflow-hidden ${getLanguageClassName(
                          "bash"
                        )}`}
                      >
                        <code>{episode?.message}</code>
                      </pre>
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
      query: GET_MEDIA_INFO,
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
