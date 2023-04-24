import axios from "axios";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Layout from "../../../components/layout";

// { `Don't touch this` }

// import { useUser } from "@auth0/nextjs-auth0/client";
// import {
//   arrayRemove,
//   arrayUnion,
//   collection,
//   doc,
//   getDoc,
//   getDocs,
//   setDoc,
//   updateDoc,
// } from "firebase/firestore";
// import db from "../../../lib/firebase";

const options = [
  "mangadex",
  "mangahere",
  "mangakakalot",
  "mangapark",
  "mangapill",
  "mangareader",
  "mangasee123",
];

export default function MangaDetail({ data, manga, aniId, provider }) {
  const [selectOption, setSelectedOption] = useState(options[0]);
  const [recentWatch, setRecentWatch] = useState();

  const [load, setLoad] = useState(true);

  useEffect(() => {
    function getRecent() {
      const recentWatch = JSON.parse(localStorage.getItem("watchedManga"))?.map(
        (data) => data.id
      );
      setRecentWatch(recentWatch);
    }
    getRecent();
  }, []);

  function handleLoad() {
    setLoad(false);
  }

  const relation = data?.relations.filter(
    (relation) => relation.malId !== null
  );

  const mangan = JSON.stringify(manga);

  async function clickDeez(props) {
    localStorage.setItem("chapters", mangan);
    localStorage.setItem("currentChapterId", props);
  }

  return (
    <>
      <Head>
        <title>{data.title?.english || data.title.romaji}</title>
        <meta name="info" content="More detailed info about the Manga" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/c.svg" />
      </Head>
      <div className="w-screen">
        <Layout>
          <div className="flex w-screen justify-center pt-[10rem] ">
            {data ? (
              <div className="flex w-[85%] flex-col gap-10 ">
                <div className="flex gap-10">
                  <div className="relative h-[358px] w-[230px]">
                    <Image
                      src={data.image}
                      alt="CoverImage"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex w-[77%] flex-col gap-10">
                    <h1 className="font-karla text-3xl font-bold">
                      {data.title?.english}
                    </h1>
                    <p dangerouslySetInnerHTML={{ __html: data.description }} />
                  </div>
                </div>
                {relation?.length > 0 ? (
                  <div className="p-3 lg:p-0">
                    <h1 className="items-start py-5 text-2xl font-bold">
                      Relations
                    </h1>
                    <div
                      className={`grid grid-cols-1 justify-items-center py-5 px-5 lg:grid-cols-3 ${
                        load ? "h-[290px] overflow-y-clip" : ""
                      }`}
                    >
                      {relation &&
                        relation.map((relation, index) => {
                          return (
                            <div key={index} className="w-full gap-6 p-5 ">
                              <Link
                                href={
                                  relation.type === "MANGA" ||
                                  relation.type === "NOVEL"
                                    ? `/manga/detail/id?aniId=${relation.id}`
                                    : `/anime/${relation.id}`
                                }
                                className={`flex w-full justify-between rounded-md bg-[#282828] p-2 shadow-lg duration-300 ease-out hover:scale-105 ${
                                  relation.type === "TV" ||
                                  relation.type === "OVA" ||
                                  relation.type === "MOVIE" ||
                                  relation.type === "SPECIAL" ||
                                  relation.type === "ONA" ||
                                  relation.type === "MANGA" ||
                                  relation.type === "TV_SHORT"
                                    ? ``
                                    : "pointer-events-none"
                                }`}
                              >
                                <div className="flex flex-col justify-between">
                                  <div className="font-bold text-[#FF7F57]">
                                    {relation.relationType}
                                  </div>
                                  <div className="text-lg font-bold text-white">
                                    {relation.title.romaji ||
                                      relation.title.english ||
                                      relation.title.userPreferred}
                                  </div>
                                  <div className="flex">
                                    <p className="dynamic-text rounded-lg p-1 font-outfit text-sm font-semibold">
                                      {relation.type}
                                    </p>
                                  </div>
                                </div>
                                <div className="relative h-[200px] w-[140px] shrink-0">
                                  <Image
                                    fill
                                    src={relation.image}
                                    alt={`Cover Image for ${relation.title}`}
                                    className=" bg-slate-400 object-cover"
                                  />
                                </div>
                              </Link>
                            </div>
                          );
                        })}
                    </div>
                    {relation.length > 3 && (
                      <button
                        type="button"
                        className="w-full"
                        onClick={handleLoad}
                      >
                        {load ? "Load More" : ""}
                      </button>
                    )}
                  </div>
                ) : (
                  <p>No Relations</p>
                )}
                <div className="flex flex-col gap-10">
                  <h1 className="text-3xl font-bold">Chapters</h1>
                  <div className="flex h-[640px] flex-col gap-10 overflow-y-scroll scrollbar-thin scrollbar-thumb-slate-800 scrollbar-thumb-rounded-full hover:scrollbar-thumb-slate-600">
                    {manga?.map((chapter, index) => {
                      return (
                        <div
                          key={index}
                          onClick={() => clickDeez(chapter.id)}
                          className={`${
                            recentWatch?.includes(chapter.id)
                              ? "text-gray-400"
                              : ""
                          }`}
                        >
                          <Link
                            // href="#"
                            href={`/manga/chapter/[chapter]`}
                            as={`/manga/chapter/read?id=${chapter.id}&title=${
                              data.title?.english || data.title?.romaji
                            }&provider=${provider}&aniId=${aniId}`}
                          >
                            {typeof chapter.title === "string" &&
                            !isNaN(Number(chapter.title)) ? (
                              <div>Chapter {Number(chapter.title)}</div>
                            ) : (
                              <div>
                                {chapter.chapter ? (
                                  <p>Chapter {chapter.chapter}</p>
                                ) : (
                                  <p>{chapter.title}</p>
                                )}
                              </div>
                            )}
                          </Link>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <p>Oops no data found :(</p>
            )}
          </div>
        </Layout>
      </div>
    </>
  );
}

export const getServerSideProps = async (context) => {
  context.res.setHeader("Cache-Control", "public, max-age=3600");
  const { aniId, aniTitle } = context.query;
  const prv = "mangahere";

  try {
    const info = await axios.get(
      `https://api.moopa.my.id/meta/anilist-manga/info/${aniId}?provider=${prv}`
    );
    const result = info.data;
    const manga = result.chapters;

    return {
      props: {
        data: result,
        aniId: aniId,
        provider: prv,
        manga,
      },
    };
  } catch (error) {
    if (error.response && error.response.status === 404) {
      try {
        const prv = "mangakakalot";
        const manga = await axios.get(
          `https://api.moopa.my.id/meta/anilist-manga/info/${aniId}?provider=${prv}`
        );
        const results = manga.data;

        return {
          props: {
            data: results,
            aniId: aniId,
            manga: results.chapters,
            provider: prv,
          },
        };
      } catch (error) {
        console.error(error);
        return {
          notFound: true,
        };
      }
    } else {
      console.error(error);
      return {
        notFound: true,
      };
    }
  }
};
