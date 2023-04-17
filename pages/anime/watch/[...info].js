import Layout from "../../../components/layout";
// import { data } from "../../../lib/testData";
// import { aniData } from "../../../lib/infoData";
import Image from "next/image";
import VideoPlayer from "../../../components/videoPlayer";
import Link from "next/link";
import { closestMatch } from "closest-match";
import Head from "next/head";
import { useEffect, useState } from "react";
import Modal from "../../../components/modal";

import { useNotification } from "../../../lib/useNotify";

import { signIn, signOut } from "next-auth/react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../api/auth/[...nextauth]";

import AniList from "../../../components/media/aniList";

import { Navigasi } from "../..";

export default function Info({ info, sessions, statusWatch }) {
  const title = info.aniData.title.romaji || info.aniData.title.english;
  const data = info.aniData;
  const fallback = info.epiFallback;
  const { Notification: NotificationComponent, show } = useNotification();

  let playingEpisode = data.episodes
    .filter((item) => item.id == info.id)
    .map((item) => item.number);

  if (playingEpisode == 0) {
    playingEpisode = fallback
      .filter((item) => item.id == info.id)
      .map((item) => item.number);
  }

  const [open, setOpen] = useState(false);
  const [aniStatus, setAniStatus] = useState("");
  const [aniProgress, setAniProgress] = useState(parseInt(playingEpisode));

  const handleStatus = (e) => {
    setAniStatus(e.target.value);
  };

  const handleProgress = (e) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value >= 0 && value <= data.totalEpisodes) {
      setAniProgress(value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = { status: aniStatus, progress: aniProgress };
    console.log(formData);
  };

  const playingTitle = data.episodes
    .filter((item) => item.id == info.id)
    .map((item) => item.title);

  return (
    <>
      <Head>
        <title>
          {fallback ? data.title.romaji || data.title.english : playingTitle}
        </title>
      </Head>

      <NotificationComponent />

      <Modal open={open} onClose={() => setOpen(false)}>
        <div className="bg-[#202020] rounded-lg text-center">
          <div className="p-5 grid gap-2 justify-center place-items-center">
            <h1 className="text-md font-extrabold font-karla">
              Save this Anime to Your List
            </h1>
            {!sessions && (
              <button
                className="flex items-center bg-[#3a3a3a] mt-4 rounded-md text-white p-1"
                onClick={() => signIn("AniListProvider")}
              >
                <h1 className="px-1 font-bold font-karla">
                  Login with AniList
                </h1>
                <div className="scale-[60%] pb-[1px]">
                  <AniList />
                </div>
              </button>
            )}
            {sessions && (
              <>
                <form
                  onSubmit={handleSubmit}
                  className="grid grid-cols-2 gap-5 max-w-sm mx-auto mt-5 items-center"
                >
                  <div className="mb-4">
                    <label
                      htmlFor="option"
                      className="block font-bold mb-2 text-sm"
                    >
                      Select an option
                    </label>
                    <select
                      id="option"
                      value={aniStatus}
                      onChange={handleStatus}
                      className="form-select block w-full px-2 py-1 rounded-lg shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-blue-300"
                    >
                      {aniStatus === "" && (
                        <option value="" hidden>
                          Select an option
                        </option>
                      )}
                      <option value="option1">Option 1</option>
                      <option value="option2">Option 2</option>
                      <option value="option3">Option 3</option>
                    </select>
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="number"
                      className="block text-sm font-bold mb-2"
                    >
                      Episode Progress
                    </label>
                    <input
                      id="number"
                      type="number"
                      step="1"
                      min="0"
                      max={data.totalEpisodes}
                      className="form-input block w-full px-2 py-1 rounded-lg shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-blue-300"
                      value={aniProgress}
                      onChange={handleProgress}
                    />
                  </div>
                  <div className="col-start-2 row-start-2 w-full justify-items-end text-center">
                    <button
                      type="submit"
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                      onClick={() => setOpen(false)}
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </Modal>
      <div className="bg-primary">
        <Navigasi />
        <div className="min-h-screen mt-3 md:mt-0 flex flex-col lg:gap-0 gap-5 lg:flex-row lg:py-10 lg:px-10 justify-start w-screen">
          <div className="w-screen lg:w-[67%]">
            <div className="h-auto aspect-video z-20">
              <VideoPlayer
                key={info.id}
                data={info.epiData}
                seek={info.seek}
                titles={title}
                id={info.id}
                progress={parseInt(playingEpisode)}
                session={sessions}
                aniId={parseInt(data.id)}
                stats={statusWatch}
              />
            </div>
            <div>
              <div className="">
                {data.episodes.length > 0 ? (
                  data.episodes
                    .filter((items) => items.id == info.id)
                    .map((item) => (
                      <div key={item.id} className="p-3 grid gap-2">
                        <div className="text-xl font-outfit font-semibold line-clamp-2">
                          <Link
                            href={`/anime/${data.id}`}
                            className="inline hover:underline"
                          >
                            {item.title}
                          </Link>
                        </div>
                        <h4 className="text-sm font-karla font-light">
                          Episode {item.number}
                        </h4>
                      </div>
                    ))
                ) : (
                  <>
                    {fallback
                      .filter((item) => item.id == info.id)
                      .map((item) => (
                        <div key={item.id} className="p-3 grid gap-2">
                          <div className="text-xl font-outfit font-semibold line-clamp-2">
                            <Link
                              href={`/anime/${data.id}`}
                              className="inline hover:underline"
                            >
                              {title}
                            </Link>
                          </div>
                          <h4 className="text-sm font-karla font-light">
                            Episode {item.number}
                          </h4>
                        </div>
                      ))}
                  </>
                )}
              </div>
              <div className="h-[1px] bg-[#3b3b3b]" />
              <div>
                <div className="px-4 pt-7 pb-4 h-full flex">
                  <div className="aspect-[9/13] h-[240px]">
                    <Image
                      src={data.image}
                      alt="Anime Cover"
                      width={1000}
                      height={1000}
                      className="object-cover aspect-[9/13] h-[240px] rounded-md"
                    />
                  </div>
                  <div className="grid w-full px-5 gap-3 h-[240px]">
                    <div className="grid grid-cols-2 gap-1 items-center">
                      <h2 className="text-sm font-light font-roboto text-[#878787]">
                        Studios
                      </h2>
                      <div className="row-start-2">{data.studios}</div>
                      <div className="grid col-start-2 place-content-end relative">
                        <div className="" onClick={() => setOpen(true)}>
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
                          {/* <span className=" transition-all duration-300 absolute -top-12 bg-[#2c2c2c] font-karla p-2 rounded-l-lg rounded-tr-lg right-3 select-none">
                            Save to My List
                          </span> */}
                        </div>
                      </div>
                    </div>
                    <div className="grid gap-1 items-center">
                      <h2 className="text-sm font-light font-roboto text-[#878787]">
                        Status
                      </h2>
                      <div>{data.status}</div>
                    </div>
                    <div className="grid gap-1 items-center overflow-y-hidden">
                      <h2 className="text-sm font-light font-roboto text-[#878787]">
                        Titles
                      </h2>
                      <div className="grid grid-flow-dense grid-cols-2 gap-2 h-full w-full">
                        <div className="line-clamp-3">
                          {data.title.romaji || ""}
                        </div>
                        <div className="line-clamp-3">
                          {data.title.english || ""}
                        </div>
                        <div className="line-clamp-3">
                          {data.title.native || ""}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3 px-4 pt-3 ">
                  {data.genres.map((item, index) => (
                    <div
                      key={index}
                      className="border border-action text-gray-100 py-1 px-2 rounded-md font-karla text-sm"
                    >
                      {item}
                    </div>
                  ))}
                </div>
                <div className={`bg-secondary rounded-md mt-3 mx-3`}>
                  <p
                    dangerouslySetInnerHTML={{ __html: data.description }}
                    className={`p-5 text-sm font-light font-roboto text-[#e4e4e4] `}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col w-screen lg:w-[33%] ">
            <h1 className="text-xl font-karla pl-4 pb-5 font-semibold">
              Up Next
            </h1>
            <div className="grid gap-5 lg:px-5 px-2 py-2 scrollbar-thin scrollbar-thumb-[#313131] scrollbar-thumb-rounded-full">
              {data.episodes.length > 0
                ? data.episodes.map((item) => {
                    return (
                      <Link
                        href={`/anime/watch/${item.id}/${data.id}`}
                        key={item.id}
                        className={`bg-secondary flex w-full h-[110px] rounded-lg scale-100 transition-all duration-300 ease-out ${
                          item.id == info.id
                            ? "pointer-events-none ring-1 ring-action"
                            : "cursor-pointer hover:scale-[1.02] ring-0 hover:ring-1 hover:shadow-lg ring-white"
                        }`}
                      >
                        <div className="w-[40%] h-full relative shrink-0">
                          <Image
                            src={item.image}
                            alt="image"
                            height={1000}
                            width={1000}
                            className={`object-cover rounded-lg h-[110px] shadow-[4px_0px_5px_0px_rgba(0,0,0,0.3)] ${
                              item.id == info.id
                                ? "brightness-[30%]"
                                : "brightness-75"
                            }`}
                          />
                          <span className="absolute bottom-2 left-2 font-karla font-light text-sm">
                            Episode {item.number}
                          </span>
                          {item.id == info.id && (
                            <div className="absolute top-11 left-[105px] scale-[1.5]">
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
                        <div
                          className={`w-[70%] h-full select-none p-4 flex flex-col gap-2 ${
                            item.id == info.id ? "text-[#7a7a7a]" : ""
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
                : fallback.map((item) => {
                    return (
                      <Link
                        href={`/anime/watch/${item.id}/${data.id}`}
                        key={item.id}
                        className={`bg-secondary flex-center w-full h-[50px] rounded-lg scale-100 transition-all duration-300 ease-out ${
                          item.id == info.id
                            ? "pointer-events-none ring-1 ring-action text-[#5d5d5d]"
                            : "cursor-pointer hover:scale-[1.02] ring-0 hover:ring-1 hover:shadow-lg ring-white"
                        }`}
                      >
                        Episode {item.number}
                      </Link>
                    );
                  })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);

  const { info } = context.query;
  if (!info) {
    return {
      notFound: true,
    };
  }

  const id = info[0];
  const aniId = info[1];
  const seek = info[2] || 0;
  let epiFallback = null;

  const res = await fetch(`https://api.moopa.my.id/meta/anilist/watch/${id}`);
  const epiData = await res.json();

  const res2 = await fetch(
    `https://api.moopa.my.id/meta/anilist/info/${aniId}`
  );
  const aniData = await res2.json();

  if (aniData.episodes.length === 0) {
    const res = await fetch(
      `https://api.moopa.my.id/anime/gogoanime/${
        aniData.title.romaji || aniData.title.english
      }`
    );
    const data = await res.json();
    const match = closestMatch(
      aniData.title.romaji,
      data.results.map((item) => item.title)
    );
    const anime = data.results.filter((item) => item.title === match);
    if (anime.length !== 0) {
      const infos = await fetch(
        `https://api.moopa.my.id/anime/gogoanime/info/${anime[0].id}`
      ).then((res) => res.json());
      epiFallback = infos.episodes;
    }
  }

  const playingEpisode = aniData.episodes
    .filter((item) => item.id == id)
    .map((item) => item.number);

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

  const prog = dat.data.MediaListCollection;

  const gat = prog?.lists.map((item) => item.entries);
  const git = gat?.map((item) =>
    item.find((item) => item.media.id === parseInt(aniId))
  );
  const gut = git?.find((item) => item?.media.id === parseInt(aniId));

  let statusWatch = "CURRENT";

  if (gut?.status === "COMPLETED") {
    statusWatch = "REPEATING";
  } else if (
    gut?.status === "REPEATING" &&
    gut?.media?.episodes === parseInt(playingEpisode)
  ) {
    statusWatch = "COMPLETED";
  } else if (gut?.status === "REPEATING") {
    statusWatch = "REPEATING";
  } else if (aniData.totalEpisodes === parseInt(playingEpisode)) {
    statusWatch = "COMPLETED";
  }

  return {
    props: {
      info: {
        id,
        seek,
        epiData,
        aniData,
        epiFallback,
      },
      sessions: session,
      statusWatch: statusWatch,
    },
  };
}
