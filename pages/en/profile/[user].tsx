import Image from "next/image";
import Link from "next/link";
import Head from "next/head";
import { useEffect, useState } from "react";
import { getUser } from "@/prisma/user";
import { toast } from "sonner";
import { Navbar } from "@/components/shared/NavBar";
import pls from "@/utils/request";
import { CurrentMediaTypes } from "..";

type MyListProps = {
  media: CurrentMediaTypes[];
  sessions: any;
  user: any;
  time: any;
  userSettings: any;
};

export default function MyList({
  media,
  sessions,
  user,
  time,
  userSettings,
}: MyListProps) {
  const [listFilter, setListFilter] = useState("all");
  const [visible, setVisible] = useState(false);
  const [useCustomList, setUseCustomList] = useState(true);

  useEffect(() => {
    if (userSettings) {
      localStorage.setItem("customList", userSettings.CustomLists);
      setUseCustomList(userSettings.CustomLists);
    }
  }, [userSettings]);

  // Function to handle checkbox state changes
  const handleCheckboxChange = async () => {
    setUseCustomList(!useCustomList); // Toggle the checkbox state
    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: sessions?.user?.name,
          settings: {
            CustomLists: !useCustomList,
          },
        }),
      });
      const data = await res.json();
      if (data) {
        toast.success(`Custom List is now ${!useCustomList ? "on" : "off"}`);
      }
      localStorage.setItem("customList", String(!useCustomList));
    } catch (error) {
      console.error(error);
    }
  };

  const filterMedia = (status: string) => {
    if (status === "all") {
      return media;
    }
    return media.filter((m: { name: string }) => m.name === status);
  };
  return (
    <>
      <Head>
        <title>My Lists</title>
      </Head>

      <Navbar withNav toTop shrink bgHover scrollP={110} paddingY={"py-1"} />

      <div className="w-screen lg:flex justify-between lg:px-10 xl:px-32 py-5 mt-10 xl:mt-16 relative">
        <div className="lg:w-[30%] h-full mt-12 lg:mr-10 grid gap-5 mx-3 lg:mx-0 antialiased">
          <div className="flex items-center gap-5">
            <Image
              src={user.avatar.large}
              alt="user avatar"
              width={1000}
              height={1000}
              className="object-cover h-28 w-28 rounded-lg"
            />
            {user.bannerImage ? (
              <Image
                src={user.bannerImage}
                alt="image"
                width={1000}
                height={1000}
                priority
                className="absolute w-screen h-[240px] object-cover -top-[7.75rem] left-0 -z-50 brightness-[65%]"
              />
            ) : (
              <div className="absolute w-screen h-[240px] object-cover -top-[7.75rem] left-0 -z-50 brightness-[65%] bg-image" />
            )}
            <h1 className="font-karla font-bold text-2xl pt-7">{user.name}</h1>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex gap-2 text-sm font-karla">
              Created At :
              <UnixTimeConverter unixTime={user.createdAt} />
            </div>
            <div className="flex items-center gap-2">
              {sessions && user.name === sessions?.user.name ? (
                <Link
                  href={"https://anilist.co/settings/"}
                  className="flex items-center gap-2 p-1 px-2 ring-[1px] antialiased ring-txt rounded-lg text-xs font-karla hover:bg-txt hover:shadow-lg group"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-4 h-4 group-hover:stroke-black"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42"
                    />
                  </svg>
                  <span className="group-hover:text-black">Edit Profile</span>
                </Link>
              ) : null}
            </div>
          </div>
          <div className="bg-secondary lg:min-h-[160px] text-xs rounded-md p-4 font-karla">
            <div>
              {user.about ? (
                <div dangerouslySetInnerHTML={{ __html: user.about }} />
              ) : (
                "No description created."
              )}
            </div>
          </div>

          <div className="bg-secondary font-karla rounded-md h-20 p-1 grid grid-cols-3 place-items-center text-center text-txt">
            <div>
              <h1 className="text-action font-bold">
                {user.statistics.anime.episodesWatched}
              </h1>
              <h2 className="text-sm">Total Episodes</h2>
            </div>
            <div>
              <h1 className="text-action font-bold">
                {user.statistics.anime.count}
              </h1>
              <h2 className="text-sm">Total Anime</h2>
            </div>
            {time?.days ? (
              <div>
                <h1 className="text-action font-bold">{time.days}</h1>
                <h2 className="text-sm">Days Watched</h2>
              </div>
            ) : (
              <div>
                <h1 className="text-action font-bold">{time.hours}</h1>
                <h2 className="text-sm">hours</h2>
              </div>
            )}
          </div>
          {sessions && user.name === sessions?.user.name && (
            <div className="font-karla flex flex-col gap-4">
              <h1>User Settings</h1>
              <div className="flex p-2 items-center justify-between">
                <h2
                  className="text-sm text-white/70"
                  title="Disabling this will stop adding your Anime to 'Watched using Moopa' list."
                >
                  Custom Lists
                </h2>
                <div className="w-5 h-5">
                  <input
                    type="checkbox"
                    checked={useCustomList}
                    onChange={handleCheckboxChange}
                    className="accent-action"
                  />
                </div>
              </div>
            </div>
          )}
          {media.length !== 0 && (
            <div className="font-karla grid gap-4">
              <div className="flex md:justify-normal justify-between items-center">
                <div className="flex items-center gap-3">
                  <h1>Lists Filter</h1>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-[20px] h-[20px]"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z"
                    />
                  </svg>
                </div>
                <div
                  className="md:hidden bg-secondary p-1 rounded-md cursor-pointer"
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
              <ul
                className={`group md:grid gap-1 text-sm ${
                  visible ? "" : "hidden"
                }`}
              >
                <li
                  onClick={() => setListFilter("all")}
                  className={`p-2 cursor-pointer hover:text-action ${
                    listFilter === "all" && "bg-secondary text-action"
                  }`}
                >
                  <h1 className={`cursor-pointer hover:text-action`}>
                    Show All
                  </h1>
                </li>
                {media.map((item) => (
                  <li
                    key={item.name}
                    onClick={() => setListFilter(item.name)}
                    className={`cursor-pointer hover:text-action flex gap-2 p-2 duration-200 ${
                      item.name === listFilter && "bg-secondary text-action"
                    }`}
                  >
                    <h1 className="">{item.name}</h1>
                    <div className="text-gray-400 opacity-0 invisible duration-200 transition-all group-hover:visible group-hover:opacity-100">
                      ({item.entries.length})
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="lg:w-[75%] grid gap-10 my-5 lg:my-12 lg:pt-16">
          {media.length !== 0 ? (
            filterMedia(listFilter).map((item, index) => {
              return (
                <div
                  key={index}
                  id={item.status?.toLowerCase()}
                  className="flex flex-col gap-5 mx-3"
                >
                  <h1 className="font-karla font-bold text-xl">{item.name}</h1>
                  <table className="bg-secondary rounded-lg">
                    <thead>
                      <tr>
                        <th className="font-bold text-xs py-3 text-start pl-10 lg:w-[75%] w-[65%]">
                          Title
                        </th>
                        <th className="font-bold text-xs py-3">Score</th>
                        <th className="font-bold text-xs py-3">Progress</th>
                      </tr>
                    </thead>
                    <tbody className="">
                      {item.entries.map((item) => {
                        return (
                          <tr
                            key={item.mediaId}
                            className="hover:bg-orange-400 duration-150 ease-in-out group relative"
                          >
                            <td className="font-medium py-2 pl-2 rounded-l-lg">
                              <div className="flex items-center gap-2">
                                {item.media.status === "RELEASING" ? (
                                  <span className="dot group-hover:invisible bg-green-500 shrink-0" />
                                ) : item.media.status === "NOT_YET_RELEASED" ? (
                                  <span className="dot group-hover:invisible bg-red-500 shrink-0" />
                                ) : (
                                  <span className="dot group-hover:invisible shrink-0" />
                                )}
                                <Image
                                  src={item.media.coverImage.large}
                                  alt="Cover Image"
                                  width={500}
                                  height={500}
                                  className="object-cover rounded-md w-10 h-10 shrink-0"
                                />
                                <div className="absolute -top-10 -left-40 invisible lg:group-hover:visible">
                                  <Image
                                    src={item.media.coverImage.large}
                                    alt={String(item.media.id)}
                                    width={1000}
                                    height={1000}
                                    className="object-cover h-[186px] w-[140px] shrink-0 rounded-md"
                                  />
                                </div>
                                <Link
                                  href={`/en/anime/${item.media.id}`}
                                  className="font-semibold font-karla pl-2 text-sm line-clamp-1"
                                  title={item.media.title.romaji}
                                >
                                  {item.media.title.romaji}
                                </Link>
                              </div>
                            </td>
                            <td className="text-center text-xs text-txt">
                              {item.score === 0 ? null : item.score}
                            </td>
                            <td className="text-center text-xs text-txt rounded-r-lg">
                              {item.progress === item.media.episodes
                                ? item.progress
                                : item.media.episodes === null
                                ? item.progress
                                : `${item.progress}/${item.media.episodes}`}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              );
            })
          ) : (
            <div className="w-screen lg:w-full flex-center flex-col gap-5">
              {user.name === sessions?.user.name ? (
                <p className="text-center font-karla font-bold lg:text-lg">
                  Oops!<br></br> Looks like you haven't watch anything yet.
                </p>
              ) : (
                <p className="text-center font-karla font-bold lg:text-lg">
                  Oops!<br></br> It looks like this user haven't watch anything
                  yet.
                </p>
              )}
              <Link
                href="/en/search/anime"
                className="flex gap-2 text-sm ring-1 ring-action p-2 rounded-lg font-karla"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                  />
                </svg>
                <span>Start Watching</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(context: any) {
  const query = context.query;

  const [data, session] = await pls.post(
    "https://graphql.anilist.co/",
    {
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
          username: query.user,
        },
      }),
    },
    context
  );

  const get = data?.data?.MediaListCollection;
  const sectionOrder = get?.user.mediaListOptions.animeList.sectionOrder;

  if (!sectionOrder) {
    return {
      notFound: true,
    };
  }

  let userData;

  if (session) {
    userData = await getUser(session.user.name, false);
  }

  const prog = get.lists;

  function getIndex(status: string) {
    const index = sectionOrder.indexOf(status);
    return index === -1 ? sectionOrder.length : index;
  }

  prog.sort(
    (a: { name: string }, b: { name: string }) =>
      getIndex(a.name) - getIndex(b.name)
  );

  const user = get.user;

  const time = convertMinutesToDays(user.statistics.anime.minutesWatched);

  return {
    props: {
      media: prog,
      sessions: session,
      user: user,
      time: time,
      userSettings: userData?.setting || null,
    },
  };
}

function UnixTimeConverter({ unixTime }: { unixTime: number }) {
  const date = new Date(unixTime * 1000); // multiply by 1000 to convert to milliseconds
  const formattedDate = date.toISOString().slice(0, 10); // format date to YYYY-MM-DD

  return <p>{formattedDate}</p>;
}

function convertMinutesToDays(minutes: number) {
  const hours = minutes / 60;
  const days = hours / 24;

  if (days >= 1) {
    return days % 1 === 0
      ? { days: `${days}` }
      : { days: `${days.toFixed(1)}` };
  } else {
    return hours % 1 === 0
      ? { hours: `${hours}` }
      : { hours: `${hours.toFixed(1)}` };
  }
}
