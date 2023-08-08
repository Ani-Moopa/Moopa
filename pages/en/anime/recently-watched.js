import { ChevronLeftIcon, PlayIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import Navbar from "../../../components/navbar";
import Footer from "../../../components/footer";
import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]";
import MobileNav from "../../../components/home/mobileNav";

export default function PopularAnime({ sessions }) {
  const [data, setData] = useState(null);
  const [page, setPage] = useState(1);
  const [nextPage, setNextPage] = useState(true);
  const [loading, setLoading] = useState(true);

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
  }, []);

  //   useEffect(() => {
  //     function handleScroll() {
  //       if (page > 5 || !nextPage) {
  //         window.removeEventListener("scroll", handleScroll);
  //         return;
  //       }

  //       if (
  //         window.innerHeight + window.pageYOffset >=
  //         document.body.offsetHeight - 3
  //       ) {
  //         setPage((prevPage) => prevPage + 1);
  //       }
  //     }

  //     window.addEventListener("scroll", handleScroll);

  //     return () => window.removeEventListener("scroll", handleScroll);
  //   }, [page, nextPage]);

  return (
    <>
      <MobileNav sessions={sessions} />
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
                <Link
                  key={i.watchId}
                  className="flex flex-col gap-2 shrink-0 cursor-pointer"
                  href={`/en/anime/watch/${i.aniId}/${
                    i.provider
                  }?id=${encodeURIComponent(i.watchId)}&num=${i.episode}`}
                >
                  <div className="relative md:w-[320px] aspect-video rounded-md overflow-hidden group">
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
                  </div>
                  <div className="flex flex-col font-karla w-full">
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
                      >
                        {i.aniTitle}
                      </span>{" "}
                      | Episode {i.episode}
                    </p>
                  </div>
                </Link>
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
        {/* {!loading && page > 5 && nextPage && (
          <button
            onClick={() => setPage((p) => p + 1)}
            className="bg-secondary xl:w-[30%] w-[80%] h-10 rounded-md"
          >
            Load More
          </button>
        )} */}
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
