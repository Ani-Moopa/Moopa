import { ChevronLeftIcon, PlayIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import Footer from "../../../components/footer";
import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]";
import MobileNav from "../../../components/home/mobileNav";
import { ToastContainer, toast } from "react-toastify";
import { ChevronRightIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/router";

export default function PopularAnime({ sessions }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [remove, setRemoved] = useState();
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      let data;
      if (sessions?.user?.name) {
        data = await fetch(
          `/api/user/profile?name=${sessions?.user?.name}`
        ).then((res) => {
          if (!res.ok) {
            switch (res.status) {
              case 404: {
                return console.log("user not found");
              }
              case 500: {
                return console.log("server error");
              }
            }
          }
          return res.json();
        });
      }
      if (!data) {
        const dat = JSON.parse(localStorage.getItem("artplayer_settings"));
        if (dat) {
          const arr = Object.keys(dat).map((key) => dat[key]);
          setData(arr);
          setLoading(false);
        }
      } else {
        setData(data?.WatchListEpisode);
        setLoading(false);
      }
    };
    fetchData();
  }, [remove]);

  const removeItem = async (id) => {
    if (sessions?.user?.name) {
      // remove from database
      const res = await fetch(`/api/user/update/episode`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: sessions?.user?.name,
          id: id,
        }),
      });
      const data = await res.json();

      // remove from local storage
      const artplayerSettings =
        JSON.parse(localStorage.getItem("artplayer_settings")) || {};
      if (artplayerSettings[id]) {
        delete artplayerSettings[id];
        localStorage.setItem(
          "artplayer_settings",
          JSON.stringify(artplayerSettings)
        );
      }

      // update client
      setRemoved(id);

      if (data?.message === "Episode deleted") {
        toast.success("Episode removed from history", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          draggable: true,
          theme: "dark",
        });
      }
    } else {
      const artplayerSettings =
        JSON.parse(localStorage.getItem("artplayer_settings")) || {};
      if (artplayerSettings[id]) {
        delete artplayerSettings[id];
        localStorage.setItem(
          "artplayer_settings",
          JSON.stringify(artplayerSettings)
        );
      }

      setRemoved(id);
    }
  };

  return (
    <>
      <MobileNav sessions={sessions} />
      <ToastContainer pauseOnHover={false} />
      <div className="flex flex-col gap-2 items-center min-h-screen w-screen px-2 relative pb-10">
        <div className="z-50 bg-primary pt-5 pb-3 shadow-md shadow-primary w-full fixed left-0 px-3">
          <Link href="/en" className="flex gap-2 items-center font-karla">
            <ChevronLeftIcon className="w-5 h-5" />
            <h1 className="text-xl">Recently Watched</h1>
          </Link>
        </div>
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-3 md:gap-7 pt-16">
          {data
            ?.filter((i) => i.title !== null)
            .map((i) => {
              const time = i.timeWatched;
              const duration = i.duration;
              let prog = (time / duration) * 100;
              if (prog > 90) prog = 100;

              return (
                <div
                  key={i.watchId}
                  className="flex flex-col gap-2 shrink-0 cursor-pointer relative group/item"
                >
                  <div className="absolute flex flex-col gap-1 z-40 top-1 right-1 transition-all duration-200 ease-out opacity-0 group-hover/item:opacity-100 scale-90 group-hover/item:scale-100 group-hover/item:visible invisible">
                    <button
                      type="button"
                      className="flex flex-col items-center group/delete relative"
                      onClick={() => removeItem(i.watchId)}
                    >
                      <XMarkIcon className="w-6 h-6 shrink-0 bg-primary p-1 rounded-full hover:text-action scale-100 hover:scale-105 transition-all duration-200 ease-out" />
                      <span className="absolute font-karla bg-secondary shadow-black shadow-2xl py-1 px-2 whitespace-nowrap text-white text-sm rounded-md right-7 -bottom-[2px] z-40 duration-300 transition-all ease-out group-hover/delete:visible group-hover/delete:scale-100 group-hover/delete:translate-x-0 group-hover/delete:opacity-100 opacity-0 translate-x-10 scale-50 invisible">
                        Remove from history
                      </span>
                    </button>
                    {i?.nextId && (
                      <button
                        type="button"
                        className="flex flex-col items-center group/next relative"
                        onClick={() => {
                          router.push(
                            `/en/anime/watch/${i.aniId}/${
                              i.provider
                            }?id=${encodeURIComponent(i?.nextId)}&num=${
                              i?.nextNumber
                            }`
                          );
                        }}
                      >
                        <ChevronRightIcon className="w-6 h-6 shrink-0 bg-primary p-1 rounded-full hover:text-action scale-100 hover:scale-105 transition-all duration-200 ease-out" />
                        <span className="absolute font-karla bg-secondary shadow-black shadow-2xl py-1 px-2 whitespace-nowrap text-white text-sm rounded-md right-7 -bottom-[2px] z-40 duration-300 transition-all ease-out group-hover/next:visible group-hover/next:scale-100 group-hover/next:translate-x-0 group-hover/next:opacity-100 opacity-0 translate-x-10 scale-50 invisible">
                          Play Next Episode
                        </span>
                      </button>
                    )}
                  </div>
                  <Link
                    className="relative md:w-[320px] aspect-video rounded-md overflow-hidden group"
                    href={`/en/anime/watch/${i.aniId}/${
                      i.provider
                    }?id=${encodeURIComponent(i.watchId)}&num=${i.episode}`}
                  >
                    <div className="w-full h-full bg-gradient-to-t from-black/70 from-20% to-transparent group-hover:to-black/40 transition-all duration-300 ease-out absolute z-30" />
                    <div className="absolute bottom-3 left-0 mx-2 text-white flex gap-2 items-center w-[80%] z-30">
                      <PlayIcon className="w-5 h-5 shrink-0" />
                      <h1
                        className="font-semibold text-sm md:text-base font-karla line-clamp-1"
                        title={i?.title || i.anititle}
                      >
                        {i?.title || i.anititle}
                      </h1>
                    </div>
                    <span
                      className={`absolute bottom-0 left-0 h-[2px] bg-red-600 z-30`}
                      style={{
                        width: `${prog}%`,
                      }}
                    />
                    {i?.image && (
                      <Image
                        src={i?.image}
                        width={200}
                        height={200}
                        alt="Episode Thumbnail"
                        className="w-fit group-hover:scale-[1.02] duration-300 ease-out z-10"
                      />
                    )}
                  </Link>
                  <Link
                    className="flex flex-col font-karla w-full"
                    href={`/en/anime/watch/${i.aniId}/${
                      i.provider
                    }?id=${encodeURIComponent(i.watchId)}&num=${i.episode}`}
                  >
                    {/* <h1 className="font-semibold">{i.title}</h1> */}
                    <p className="flex items-center gap-1 text-sm text-gray-400 md:w-[320px]">
                      <span
                        className="text-white max-w-[150px] md:max-w-[220px]"
                        style={{
                          display: "inline-block",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                        title={i.aniTitle}
                      >
                        {i.aniTitle}
                      </span>{" "}
                      | Episode {i.episode}
                    </p>
                  </Link>
                </div>
              );
            })}

          {loading && (
            <>
              {[1, 2, 4, 5, 6, 7, 8].map((item) => (
                <div
                  key={item}
                  className="flex flex-col gap-2 items-center md:w-[320px] rounded-md overflow-hidden"
                >
                  <div className="w-full">
                    <Skeleton className="w-fit aspect-video rounded" />
                  </div>
                  <div className="w-full">
                    <Skeleton width={80} height={20} />
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);

  return {
    props: {
      sessions: session,
    },
  };
}
