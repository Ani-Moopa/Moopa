import Head from "next/head";
import { Fragment, useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import Skeleton from "react-loading-skeleton";
import Footer from "../../../components/footer";
import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]";
import Image from "next/image";
import MobileNav from "../../../components/shared/MobileNav";

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);

  return {
    props: {
      sessions: session,
    },
  };
}

export default function Recent({ sessions }) {
  const [data, setData] = useState(null);
  const [page, setPage] = useState(1);
  const [nextPage, setNextPage] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    async function getRecent() {
      const data = await fetch(`/api/v2/etc/recent/${page}`).then((res) =>
        res.json()
      );
      if (data?.results?.length === 0) {
        setNextPage(false);
      } else if (data !== null && page > 1) {
        setData((prevData) => {
          return [...(prevData ?? []), ...data?.results];
        });
        setNextPage(data?.hasNextPage);
      } else {
        setData(data?.results);
      }
      setNextPage(data?.hasNextPage);
      setLoading(false);
    }
    getRecent();
  }, [page]);

  useEffect(() => {
    function handleScroll() {
      if (page > 5 || !nextPage) {
        window.removeEventListener("scroll", handleScroll);
        return;
      }

      if (
        window.innerHeight + window.pageYOffset >=
        document.body.offsetHeight - 3
      ) {
        setPage((prevPage) => prevPage + 1);
      }
    }

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [page, nextPage]);

  return (
    <Fragment>
      <Head>
        <title>Moopa - New Episodes</title>
        <meta name="title" content="New Episodes" />
        <meta
          name="description"
          content="Explore Beloved Classics and Favorites - Dive into a curated collection of timeless anime on Moopa's New Episodes Page. From iconic classics to all-time favorites, experience the stories that have captured hearts worldwide. Start streaming now and relive the magic of anime!"
        />
      </Head>
      <MobileNav sessions={sessions} />
      <main className="flex flex-col gap-2 items-center min-h-screen w-screen px-2 relative pb-10">
        <div className="z-50 bg-primary pt-5 pb-3 shadow-md shadow-primary w-full fixed px-3">
          <Link href="/en" className="flex gap-2 items-center font-karla">
            <ChevronLeftIcon className="w-5 h-5" />
            <h1 className="text-xl">New Episodes</h1>
          </Link>
        </div>
        <div className="grid grid-cols-2 xs:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-6 gap-5 max-w-6xl pt-20">
          {data?.map((i, index) => (
            <div
              key={index}
              className="flex flex-col items-center w-[150px] lg:w-[180px]"
            >
              <Link
                href={`/en/anime/${i.id}`}
                className=" relative hover:scale-105 scale-100 transition-all duration-200 ease-out"
                title={i.title.romaji}
              >
                <div className="w-[140px] h-[190px] lg:w-[170px] lg:h-[230px] object-cover rounded opacity-90 z-20">
                  <div className="absolute bg-gradient-to-b from-black/30 to-transparent from-5% to-30% top-0 z-30 w-[140px] h-[190px] lg:w-[170px] lg:h-[230px] rounded" />
                  <Image
                    src={i.image}
                    alt={i.title.romaji}
                    width={500}
                    height={500}
                    className="w-[140px] h-[190px] lg:w-[170px] lg:h-[230px] object-cover rounded opacity-90 z-20"
                  />
                </div>
                <Image
                  src="/svg/episode-badge.svg"
                  alt="episode-bade"
                  width={200}
                  height={100}
                  className="w-24 lg:w-28 absolute top-1 -right-[13px] lg:-right-[15px] z-40"
                />
                <p className="absolute z-40 text-center w-[80px] lg:w-[100px] top-[5px] -right-2 lg:top-[4px] lg:-right-3 font-karla text-sm lg:text-base">
                  Episode <span className="text-white">{i?.episodeNumber}</span>
                </p>
              </Link>
              <Link
                href={`/en/anime/${i.id}`}
                className="w-full px-1 py-2"
                title={i.title.romaji}
              >
                <h1 className="font-karla font-bold xl:text-base text-[15px] line-clamp-2">
                  <span className="dots bg-green-500" />
                  {i.title.romaji}
                </h1>
              </Link>
            </div>
          ))}

          {loading && (
            <>
              {[1, 2, 4, 5, 6, 7, 8].map((item) => (
                <div
                  key={item}
                  className="flex flex-col items-center w-[150px] lg:w-[180px]"
                >
                  <div className="w-full p-2">
                    <Skeleton className="w-[140px] h-[190px] lg:w-[170px] lg:h-[230px] rounded" />
                  </div>
                  <div className="w-full px-2">
                    <Skeleton width={80} height={20} />
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
        {!loading && page > 5 && nextPage && (
          <button
            onClick={() => setPage((p) => p + 1)}
            className="bg-secondary xl:w-[30%] w-[80%] h-10 rounded-md"
          >
            Load More
          </button>
        )}
      </main>
      <Footer />
    </Fragment>
  );
}
