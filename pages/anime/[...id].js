import React, { useEffect, useState } from "react";
import { META } from "@consumet/extensions";

import Link from "next/link";
import Layout from "../../components/layout";
import Head from "next/head";

import { closestMatch } from "closest-match";
import Content from "../../components/hero/content";

import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]";
import Image from "next/image";

export default function Himitsu({
  info,
  color,
  episodeList,
  episode1,
  sessions,
  progress,
  status,
  lastPlayed,
  stall,
}) {
  const [showText, setShowtext] = useState(false);
  const [load, setLoad] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [time, setTime] = useState(0);

  const episode = episodeList;
  const epi1 = episode1;

  const maxItems = 3;

  const nextAir = info.nextAiringEpisode;
  // console.log(time);

  useEffect(() => {
    if (nextAir) {
      setTime(convertSecondsToTime(nextAir.timeUntilAiring));
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

    setLoad(false);
  }, [color, sessions, info.id]);

  return (
    <>
      <Head>
        <title>{info.title?.english || info.title.romaji}</title>
        <meta name="detail" content="Detail about the Anime" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/c.svg" />
      </Head>

      <Layout navTop="text-white bg-primary md:pt-0 md:px-0 bg-slate bg-opacity-40">
        <div className="text static bg-primary flex w-screen flex-col justify-center pt-nav md:pt-1 pb-10">
          <div className="pointer-events-none absolute top-0 left-0">
            <div className="absolute bg-gradient-to-t w-screen z-20 top-0 md:h-[300px] h-[420px] from-10% from-primary to-transparent" />
            <img
              // ref={ref}
              src={info.cover || info.image}
              className="md:h-[300px] h-[420px] w-screen object-cover brightness-[60%]"
            />
          </div>
          {info ? (
            <div className="flex flex-col items-center gap-10">
              <div className="flex w-screen flex-col gap-10 md:w-[70%]">
                <div className="z-40 flex flex-col gap-10 px-5 pt-[7rem] md:flex-row lg:mt-[5rem] lg:px-0">
                  <div className="flex gap-5 md:h-[250px] md:w-52">
                    <div className="flex h-[200px] w-52 bg-[#dadada50] md:h-[250px] md:w-full">
                      {info.image && (
                        <>
                          <div
                            key={info.id}
                            // src={info.image}
                            className=""
                          >
                            <Image
                              src={info.image}
                              alt="image"
                              width={500}
                              height={500}
                              draggable={false}
                              className="object-cover h-[200px] w-[200px] md:h-[250px] shrink-0 bg-image shadow-md"
                            />
                          </div>
                        </>
                      )}
                    </div>

                    {/* MOBILE */}
                    <div className="w-full grid place-items-stretch gap-3 lg:hidden ">
                      <h1 className="shrink-0 text-xl font-semibold line-clamp-2">
                        {info.title.romaji || info.title.english}
                      </h1>
                      <div className="flex w-[90%] flex-col gap-1">
                        <div className="flex gap-2">
                          <h1>Rate:</h1>
                          <p className="font-bold">{info.rating}%</p>
                        </div>

                        <div className="flex w-[200px] gap-2">
                          <h1>Format:</h1>
                          <p>{info.type}</p>
                        </div>

                        <div className="flex gap-2">
                          <h1>Status:</h1>
                          <p>{info.status}</p>
                        </div>

                        {/* {nextAir && (
                          <div className="flex gap-2">
                            <h1>Ep {nextAir.episode}:</h1>
                            <p>{time}</p>
                          </div>
                        )} */}
                      </div>
                      <div className="flex">
                        {epi1 && epi1[0] ? (
                          <Link href={`/anime/watch/${epi1[0].id}/${info.id}`}>
                            <h1 className="flex cursor-pointer items-center gap-2 px-1 py-2 font-bold text-[#ffffff]">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="13"
                                height="12"
                                fill="none"
                                viewBox="0 0 250 289"
                              >
                                <path
                                  fill="#fff"
                                  d="M249.734 144.5l-249 143.761V.741l249 143.759z"
                                ></path>
                              </svg>{" "}
                              WATCH
                            </h1>
                          </Link>
                        ) : (
                          <h1 className="pointer-events-none flex items-center gap-2 px-1 py-2 font-bold text-[#ffffffa5]">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="13"
                              height="12"
                              className="fill-[#ffffff8d]"
                              viewBox="0 0 250 289"
                            >
                              <path d="M249.734 144.5l-249 143.761V.741l249 143.759z"></path>
                            </svg>{" "}
                            WATCH
                          </h1>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* PC */}
                  <div className="w-full flex-col gap-5 md:flex">
                    <div className="hidden flex-col gap-5 lg:flex">
                      <h1 className="text-4xl font-bold">
                        {info.title?.english ||
                          info.title.romaji ||
                          info.title.native}
                      </h1>
                      <div className="flex gap-6">
                        <div
                          className={`dynamic-text rounded-md px-2 font-karla font-bold`}
                          style={color}
                        >
                          {episode && episode.length} Episodes
                        </div>
                        <div
                          className={`dynamic-text rounded-md px-2 font-karla font-bold`}
                          style={color}
                        >
                          {info.releaseDate}
                        </div>
                        <div
                          className={`dynamic-text rounded-md px-2 font-karla font-bold`}
                          style={color}
                        >
                          {info.rating}%
                        </div>
                        <div
                          className={`dynamic-text rounded-md px-2 font-karla font-bold`}
                          style={color}
                        >
                          {info.type}
                        </div>
                        <div
                          className={`dynamic-text rounded-md px-2 font-karla font-bold`}
                          style={color}
                        >
                          {info.status}
                        </div>
                        <div
                          className={`dynamic-text rounded-md px-2 font-karla font-bold`}
                          style={color}
                        >
                          Sub | EN
                        </div>
                        {nextAir && (
                          <div
                            className={`dynamic-text shadow-button rounded-md px-2 font-karla font-bold`}
                            style={color}
                          >
                            Ep {nextAir.episode}: {time}
                          </div>
                        )}
                      </div>
                    </div>
                    <div
                      className={`hidden h-[140px] transition-all duration-300 scrollbar-thin scrollbar-thumb-[#1b1c21] scrollbar-thumb-rounded-md overflow-y-scroll hover:scrollbar-thumb-[#2e2f37] lg:block`}
                    >
                      <p
                        dangerouslySetInnerHTML={{ __html: info.description }}
                        className="mr-5"
                      />
                    </div>
                    <div className="lg:hidden text-sm text-txt">
                      <p
                        className={`${showText ? "" : "line-clamp-3"}`}
                        dangerouslySetInnerHTML={{
                          __html: info.description,
                        }}
                      />
                      <button
                        onClick={() => setShowtext(!showText)}
                        className="font-rama font-bold text-white"
                      >
                        {showText ? " Show Less" : " Show More"}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="">
                  <div className="flex gap-5 items-center">
                    <div className="p-3 lg:p-0 text-[20px] md:text-2xl font-bold font-karla">
                      Relations
                    </div>
                    {info.relations.length > maxItems && (
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
                    {info.relations &&
                      info.relations
                        .slice(0, showAll ? info.relations.length : maxItems)
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
                                      info.title?.english ||
                                        info.title.romaji ||
                                        info.title.native
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
                                  <img
                                    src={relation.image}
                                    alt={relation.id}
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
                        })}
                  </div>
                </div>

                <div className="z-20 flex flex-col gap-10 p-3 lg:p-0">
                  <div className="flex items-center md:gap-10 gap-7">
                    <h1 className="text-[20px] md:text-2xl font-bold font-karla">
                      Episodes
                    </h1>
                    <div className="flex items-center rounded-md">
                      <button
                        // onClick={handleEnLang}
                        className={
                          // Lang?
                          `w-14 p-1 rounded-l-md bg-secondary text-action shadow-action`
                          // `w-14 p-1 rounded-l-md bg-[#17171b] text-[#404040]`
                        }
                      >
                        EN
                      </button>
                      <div className="w-[1px] bg-white h-4" />
                      <button
                        // onClick={handleIdLang}
                        className={
                          // subIndo === null
                          //   ?
                          `w-14 p-1 rounded-r-md bg-[#171717] text-[#404040] pointer-events-none`
                          // : Lang
                          // ? `w-14 p-1 rounded-r-md bg-[#171717] text-[#404040]`
                          // : `w-14 p-1 rounded-r-md bg-[#212121]`
                        }
                      >
                        ID
                      </button>
                    </div>
                    {status && (
                      <>
                        <div className="font-karla relative group flex justify-center">
                          {status}
                          <span className="absolute bottom-8  shadow-lg invisible group-hover:visible transition-all opacity-0 group-hover:opacity-100 font-karla font-light bg-secondary p-1 px-2 rounded-lg">
                            status
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="flex h-[640px] flex-col gap-5 scrollbar-thin scrollbar-thumb-[#1b1c21] scrollbar-thumb-rounded-full overflow-y-scroll hover:scrollbar-thumb-[#2e2f37]">
                    {load ? (
                      <p>Loading...</p>
                    ) : episode ? (
                      episode.map((episode, index) => {
                        return (
                          <div key={index} className="flex flex-col gap-3 px-2">
                            <Link
                              href={`/anime/watch/${episode.id}/${info.id}/${
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
                </div>
              </div>
              <div className="w-screen md:w-[80%]">
                <Content
                  ids="recommendAnime"
                  section="Recommendations"
                  data={info.recommendations}
                />
              </div>
            </div>
          ) : (
            <div className="flex h-screen flex-col items-center justify-center gap-10 pb-52 ">
              <h1 className="scale-150 font-roboto text-6xl text-red-400">
                404
              </h1>
              <p className="text-4xl font-semibold">{`> Woops.. I think we don't have that Anime :(`}</p>
              <Link className="pt-10 text-2xl" href="/search/anime">
                Return to search
              </Link>
            </div>
          )}
        </div>
      </Layout>
    </>
  );
}

export async function getServerSideProps(context) {
  context.res.setHeader(
    "Cache-Control",
    "public, s-maxage=10, stale-while-revalidate=59"
  );
  const session = await getServerSession(context.req, context.res, authOptions);

  const { id } = context.query;
  if (!id) {
    return {
      notFound: true,
    };
  }

  const provider = new META.Anilist();

  const [info, episodes] = await Promise.all([
    fetch(`https://api.moopa.my.id/meta/anilist/info/${id[0]}`).then((res) =>
      res.json()
    ),
    provider.fetchEpisodesListById(id[0]),
  ]);

  if (!info) {
    return {
      notFound: true,
    };
  }

  let episodeList = episodes;
  let stall = false;

  if (episodes.length === 0) {
    const res = await fetch(
      `https://api.consumet.org/meta/anilist/info/${id[0]}?provider=9anime`
    );
    const data = await res.json();
    episodeList = data.episodes;
    stall = true;
  }

  let progress = null;
  let status = null;
  let lastPlayed = null;

  if (session) {
    const response = await fetch("https://graphql.anilist.co/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
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
        `,
        variables: {
          username: session?.user.name,
        },
      }),
    });

    const dat = await response.json();

    // const resp = await fetch(`/api/get-user?userName=${session?.user.name}`);
    // const data = await resp.json();

    lastPlayed = session?.user?.recentWatch?.filter(
      (item) => item.title.romaji === info.title.romaji
    )[0]?.episode;

    const prog = dat.data.MediaListCollection;

    const gat = prog.lists.map((item) => item.entries);
    const git = gat.map((item) =>
      item.find((item) => item.media.id === parseInt(info.id))
    );
    const gut = git?.find((item) => item?.media.id === parseInt(info.id));

    if (gut) {
      progress = gut?.progress;
      if (gut.status === "CURRENT") {
        status = "Watching";
      } else if (gut.status === "PLANNING") {
        status = "Planned to watch";
      } else if (gut.status === "COMPLETED") {
        status = "Completed";
      } else if (gut.status === "DROPPED") {
        status = "Dropped";
      } else if (gut.status === "PAUSED") {
        status = "Paused";
      } else if (gut.status === "REPEATING") {
        status = "Rewatching";
      }
    }
  }

  const color = { backgroundColor: `${info.color || 'white'}` };
  const epi1 = episodes.filter((epi) => epi.number === 1);
  const title = info.title?.userPreferred || "No Title";

  return {
    props: {
      info: {
        ...info,
        title: {
          ...info.title,
          userPreferred: title,
        },
      },
      color,
      episodeList,
      episode1: epi1,
      sessions: session,
      progress: progress || null,
      status: status,
      lastPlayed: lastPlayed || null,
      stall,
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
