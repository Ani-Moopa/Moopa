import { aniListData } from "../lib/AniList";
import React, { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import Footer from "../components/footer";
import Image from "next/image";
import Content from "../components/hero/content";
import { useRouter } from "next/router";

import { motion } from "framer-motion";

import { useSession, signIn, signOut } from "next-auth/react";
import { useAniList } from "../lib/useAnilist";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]";
import SearchBar from "../components/searchBar";
import Genres from "../components/hero/genres";

export function Navigasi() {
  const { data: sessions, status } = useSession();

  const router = useRouter();

  const handleFormSubmission = (inputValue) => {
    router.push(`/search/${encodeURIComponent(inputValue)}`);
  };

  const handleKeyDown = async (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      const inputValue = event.target.value;
      handleFormSubmission(inputValue);
    }
  };
  return (
    <>
      {/* NAVBAR PC */}
      <div className="flex items-center justify-center">
        <div className="flex w-full items-center justify-between px-5 lg:mx-[94px]">
          <div className="flex items-center lg:gap-16 lg:pt-7">
            <Link
              href="/"
              className=" font-outfit lg:text-[40px] text-[30px] font-bold text-[#FF7F57]"
            >
              moopa
            </Link>
            <ul className="hidden items-center gap-10 pt-2 font-outfit text-[14px] lg:flex">
              <li>
                <Link href="/search/anime">AniList Index</Link>
              </li>
              <li>
                <Link href="/search/manga">Manga</Link>
              </li>
              <li>
                <Link href="/search/anime">Anime</Link>
              </li>

              {status === "loading" ? (
                <li>Loading...</li>
              ) : (
                <>
                  {!sessions && (
                    <li>
                      <button
                        onClick={() => signIn("AniListProvider")}
                        className="ring-1 ring-action font-karla font-bold px-2 py-1 rounded-md"
                      >
                        Sign in
                      </button>
                    </li>
                  )}
                  {sessions && (
                    <li className="text-center">
                      <Link href={`/profile/${sessions?.user.name}`}>
                        My List
                      </Link>
                    </li>
                  )}
                </>
              )}
            </ul>
          </div>
          <div className="relative flex lg:scale-75 scale-[65%] items-center mb-7 lg:mb-0">
            <div className="search-box ">
              <input
                className="search-text"
                type="text"
                placeholder="Search Anime"
                onKeyDown={handleKeyDown}
              />
              <div className="search-btn">
                <i className="fas fa-search"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function Home({ detail, populars, sessions }) {
  const { media: current } = useAniList(sessions, { stats: "CURRENT" });
  const { media: plan } = useAniList(sessions, { stats: "PLANNING" });

  const [isVisible, setIsVisible] = useState(false);
  const [list, setList] = useState(null);
  const [planned, setPlanned] = useState(null);
  const [greeting, setGreeting] = useState("");
  const [onGoing, setOnGoing] = useState(null);

  const [prog, setProg] = useState(null);

  const popular = populars?.data;
  const data = detail.data[0];

  const handleShowClick = () => {
    setIsVisible(true);
  };

  const handleHideClick = () => {
    setIsVisible(false);
  };

  useEffect(() => {
    const time = new Date().getHours();
    let greeting = "";

    if (time >= 5 && time < 12) {
      greeting = "Good morning";
    } else if (time >= 12 && time < 18) {
      greeting = "Good afternoon";
    } else if (time >= 18 && time < 22) {
      greeting = "Good evening";
    } else if (time >= 22 || time < 5) {
      greeting = "Good night";
    }

    setGreeting(greeting);

    async function userData() {
      if (!sessions) return;
      const getMedia =
        current.filter((item) => item.status === "CURRENT")[0] || null;
      const list = getMedia?.entries
        .map(({ media }) => media)
        .filter((media) => media);

      const prog = getMedia?.entries.filter(
        (item) => item.media.nextAiringEpisode !== null
      );

      setProg(prog);

      const planned = plan?.[0]?.entries
        .map(({ media }) => media)
        .filter((media) => media);

      const onGoing = list?.filter((item) => item.nextAiringEpisode !== null);
      setOnGoing(onGoing);

      if (list) {
        setList(list.reverse());
      }
      if (planned) {
        setPlanned(planned.reverse());
      }
    }
    userData();
  }, [sessions, current, plan]);

  // console.log(log);

  return (
    <>
      <Head>
        <title>Moopa</title>
        <meta charSet="UTF-8"></meta>
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Moopa - Free Anime and Manga Streaming"
        />
        <meta
          name="twitter:description"
          content="Discover your new favorite anime or manga title! Moopa offers a vast library of high-quality content, accessible on multiple devices and without any interruptions. Start using Moopa today!"
        />
        <meta
          name="twitter:image"
          content="https://cdn.discordapp.com/attachments/1084446049986420786/1093300833422168094/image.png"
        />
        <link rel="icon" href="/c.svg" />
      </Head>

      {/* NAVBAR */}
      <div className="z-50">
        {!isVisible && (
          <button
            onClick={handleShowClick}
            className="fixed bottom-[30px] right-[20px] z-[100] flex h-[51px] w-[50px] cursor-pointer items-center justify-center rounded-[8px] bg-[#17171f] shadow-lg lg:hidden"
            id="bars"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-[42px] w-[61.5px] text-[#8BA0B2] fill-orange-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Mobile Menu */}
      <div className={`transition-all duration-150 subpixel-antialiased z-50`}>
        {isVisible && sessions && (
          <Link
            href={`/profile/${sessions?.user.name}`}
            className="fixed lg:hidden bottom-[100px] w-[60px] h-[60px] flex items-center justify-center right-[20px] rounded-full z-50 bg-[#17171f]"
          >
            <img
              src={sessions?.user.image.large}
              alt="user avatar"
              className="object-cover w-[60px] h-[60px] rounded-full"
            />
          </Link>
        )}
        {isVisible && (
          <div className="fixed bottom-[30px] right-[20px] z-50 flex h-[51px] w-[300px] items-center justify-center gap-8 rounded-[8px] text-[11px] bg-[#17171f] shadow-lg lg:hidden">
            <div className="grid grid-cols-4 place-items-center gap-6">
              <button className="group flex flex-col items-center">
                <Link href="/" className="">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6 group-hover:stroke-action"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                    />
                  </svg>
                </Link>
                <Link
                  href="/"
                  className="font-karla font-bold text-[#8BA0B2] group-hover:text-action"
                >
                  home
                </Link>
              </button>
              <button className="group flex flex-col items-center">
                <Link href="/about">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6 group-hover:stroke-action"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                    />
                  </svg>
                </Link>
                <Link
                  href="/about"
                  className="font-karla font-bold text-[#8BA0B2] group-hover:text-action"
                >
                  about
                </Link>
              </button>
              <button className="group flex gap-[1.5px] flex-col items-center ">
                <div>
                  <Link href="/search/anime">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6 group-hover:stroke-action"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                      />
                    </svg>
                  </Link>
                </div>
                <Link
                  href="/search/anime"
                  className="font-karla font-bold text-[#8BA0B2] group-hover:text-action"
                >
                  search
                </Link>
              </button>
              {sessions ? (
                <button
                  onClick={() => signOut("AniListProvider")}
                  className="group flex gap-[1.5px] flex-col items-center "
                >
                  <div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 96 960 960"
                      className="group-hover:fill-action w-6 h-6 fill-txt"
                    >
                      <path d="M186.666 936q-27 0-46.833-19.833T120 869.334V282.666q0-27 19.833-46.833T186.666 216H474v66.666H186.666v586.668H474V936H186.666zm470.668-176.667l-47-48 102-102H370v-66.666h341.001l-102-102 46.999-48 184 184-182.666 182.666z"></path>
                    </svg>
                  </div>
                  <h1 className="font-karla font-bold text-[#8BA0B2] group-hover:text-action">
                    logout
                  </h1>
                </button>
              ) : (
                <button
                  onClick={() => signIn("AniListProvider")}
                  className="group flex gap-[1.5px] flex-col items-center "
                >
                  <div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 96 960 960"
                      className="group-hover:fill-action w-6 h-6 fill-txt mr-2"
                    >
                      <path d="M486 936v-66.666h287.334V282.666H486V216h287.334q27 0 46.833 19.833T840 282.666v586.668q0 27-19.833 46.833T773.334 936H486zm-78.666-176.667l-47-48 102-102H120v-66.666h341l-102-102 47-48 184 184-182.666 182.666z"></path>
                    </svg>
                  </div>
                  <h1 className="font-karla font-bold text-[#8BA0B2] group-hover:text-action">
                    login
                  </h1>
                </button>
              )}
            </div>
            <button onClick={handleHideClick}>
              <svg
                width="20"
                height="21"
                className="fill-orange-500"
                viewBox="0 0 20 21"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="2.44043"
                  y="0.941467"
                  width="23.5842"
                  height="3.45134"
                  rx="1.72567"
                  transform="rotate(45 2.44043 0.941467)"
                />
                <rect
                  x="19.1172"
                  y="3.38196"
                  width="23.5842"
                  height="3.45134"
                  rx="1.72567"
                  transform="rotate(135 19.1172 3.38196)"
                />
              </svg>
            </button>
          </div>
        )}
      </div>

      <div className="h-auto w-screen bg-[#141519] text-[#dbdcdd] ">
        <Navigasi />
        <SearchBar />
        {/* PC / TABLET */}
        <div className=" hidden justify-center lg:flex my-16">
          <div className="relative grid grid-rows-2 items-center lg:flex lg:h-[467px] lg:w-[80%] lg:justify-between">
            <div className="row-start-2 flex h-full flex-col gap-7 lg:w-[55%] lg:justify-center">
              <h1 className="w-[85%] font-outfit font-extrabold lg:text-[34px] line-clamp-2">
                {data.title.english || data.title.romaji || data.title.native}
              </h1>
              <p
                className="font-roboto font-light lg:text-[18px] line-clamp-5"
                dangerouslySetInnerHTML={{ __html: data?.description }}
              />

              <div className="lg:pt-5">
                <Link
                  href={`/anime/${data.id}`}
                  legacyBehavior
                  className="flex"
                >
                  <a className="rounded-sm p-3 text-md font-karla font-light ring-1 ring-[#FF7F57]">
                    START WATCHING
                  </a>
                </Link>
              </div>
            </div>
            <div className="z-10 row-start-1 flex justify-center ">
              <div className="relative  lg:h-[467px] lg:w-[322px] lg:scale-100">
                <div className="absolute bg-gradient-to-t from-[#141519] to-transparent lg:h-[467px] lg:w-[322px]" />

                <Image
                  draggable={false}
                  src={data.coverImage?.extraLarge || data.image}
                  alt={`alt for ${data.title.english || data.title.romaji}`}
                  width={460}
                  height={662}
                  priority
                  className="rounded-tl-xl rounded-tr-xl object-cover bg-blend-overlay lg:h-[467px] lg:w-[322px]"
                />
              </div>
            </div>
          </div>
        </div>
        {/* {!sessions && (
          <h1 className="font-bold font-karla mx-5 text-[32px] mt-2 lg:mx-24 xl:mx-36">
            {greeting}!
          </h1>
        )} */}
        {sessions && (
          <div className="flex items-center justify-center lg:bg-none mt-4 lg:mt-0 w-screen">
            <div className="lg:w-[85%] w-screen px-5 lg:px-0 lg:text-4xl flex items-center gap-3 text-2xl font-bold font-karla">
              {greeting},<h1 className="lg:hidden">{sessions?.user.name}</h1>
              <button
                onClick={() => signOut()}
                className="hidden text-center relative lg:flex justify-center group"
              >
                {sessions?.user.name}
                <span className="absolute text-sm z-50 w-20 text-center bottom-11 text-white shadow-lg opacity-0 bg-secondary p-1 rounded-md font-karla font-light invisible group-hover:visible group-hover:opacity-100 duration-300 transition-all">
                  Sign Out
                </span>
              </button>
            </div>
          </div>
        )}

        <div className="lg:mt-16 mt-5 flex flex-col items-center">
          <motion.div
            className="w-screen flex-none lg:w-[87%]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, staggerChildren: 0.2 }} // Add staggerChildren prop
          >
            {sessions && onGoing && (
              <motion.div // Add motion.div to each child component
                key="onGoing"
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <Content
                  ids="onGoing"
                  section="On-Going Anime"
                  data={onGoing}
                  og={prog}
                />
              </motion.div>
            )}

            {sessions && list && (
              <motion.div // Add motion.div to each child component
                key="listAnime"
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <Content
                  ids="listAnime"
                  section="Your Watch List"
                  data={list}
                />
              </motion.div>
            )}

            {/* SECTION 2 */}
            {sessions && planned && (
              <motion.div // Add motion.div to each child component
                key="plannedAnime"
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <Content
                  ids="plannedAnime"
                  section="Your Plan"
                  data={planned}
                />
              </motion.div>
            )}

            {/* SECTION 3 */}
            {detail && (
              <motion.div // Add motion.div to each child component
                key="trendingAnime"
                initial={{ y: 20, opacity: 0 }}
                transition={{ duration: 0.5 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
              >
                <Content
                  ids="trendingAnime"
                  section="Trending Now"
                  data={detail.data}
                />
              </motion.div>
            )}

            {/* SECTION 4 */}
            {popular && (
              <motion.div // Add motion.div to each child component
                key="popularAnime"
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <Content
                  ids="popularAnime"
                  section="Popular Anime"
                  data={popular}
                />
              </motion.div>
            )}

            <motion.div // Add motion.div to each child component
              key="Genres"
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <Genres />
            </motion.div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);

  const trendingDetail = await aniListData({
    sort: "TRENDING_DESC",
    page: 1,
  });
  const popularDetail = await aniListData({
    sort: "POPULARITY_DESC",
    page: 1,
  });
  const genreDetail = await aniListData({ sort: "TYPE", page: 1 });

  return {
    props: {
      genre: genreDetail.props,
      detail: trendingDetail.props,
      populars: popularDetail.props,
      sessions: session,
    },
  };
}
