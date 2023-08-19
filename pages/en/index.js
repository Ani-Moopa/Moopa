import { aniListData } from "../../lib/anilist/AniList";
import React, { useState, useEffect, Fragment } from "react";
import Head from "next/head";
import Link from "next/link";
import Footer from "../../components/footer";
import Image from "next/image";
import Content from "../../components/home/content";

import { motion } from "framer-motion";

import { signOut } from "next-auth/react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]";
import SearchBar from "../../components/searchBar";
import Genres from "../../components/home/genres";
import Schedule from "../../components/home/schedule";
import getUpcomingAnime from "../../lib/anilist/getUpcomingAnime";
import { useCountdown } from "../../utils/useCountdownSeconds";

import Navigasi from "../../components/home/staticNav";
import MobileNav from "../../components/home/mobileNav";
import axios from "axios";
import { createUser } from "../../prisma/user";

import { checkAdBlock } from "adblock-checker";
import { ToastContainer, toast } from "react-toastify";
import { useAniList } from "../../lib/anilist/useAnilist";

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);

  try {
    if (session) {
      await createUser(session.user.name);
    }
  } catch (error) {
    console.error(error);
  }

  const trendingDetail = await aniListData({
    sort: "TRENDING_DESC",
    page: 1,
  });
  const popularDetail = await aniListData({
    sort: "POPULARITY_DESC",
    page: 1,
  });
  const genreDetail = await aniListData({ sort: "TYPE", page: 1 });

  const upComing = await getUpcomingAnime();

  return {
    props: {
      genre: genreDetail.props,
      detail: trendingDetail.props,
      populars: popularDetail.props,
      sessions: session,
      upComing,
    },
  };
}

export default function Home({ detail, populars, sessions, upComing }) {
  const { media: current } = useAniList(sessions, { stats: "CURRENT" });
  const { media: plan } = useAniList(sessions, { stats: "PLANNING" });
  const { media: release } = useAniList(sessions);

  const [schedules, setSchedules] = useState(null);

  const [anime, setAnime] = useState([]);

  useEffect(() => {
    async function adBlock() {
      const ad = await checkAdBlock();
      if (ad) {
        toast.dark(
          "Please disable your adblock for better experience, we don't have any ads on our site.",
          {
            position: "top-center",
            autoClose: false,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "dark",
          }
        );
      }
    }
    adBlock();
  }, []);

  const update = () => {
    setAnime((prevAnime) => prevAnime.slice(1));
  };

  const [days, hours, minutes, seconds] = useCountdown(
    anime[0]?.nextAiringEpisode?.airingAt * 1000 || Date.now(),
    update
  );

  useEffect(() => {
    if (upComing && upComing.length > 0) {
      setAnime(upComing);
    }
  }, [upComing]);

  useEffect(() => {
    const getSchedule = async () => {
      const res = await fetch(`/api/anify/schedule`);
      const data = await res.json();

      if (!res.ok) {
        setSchedules(null);
      } else {
        setSchedules(data);
      }
    };
    getSchedule();
  }, []);

  const [releaseData, setReleaseData] = useState([]);

  useEffect(() => {
    function getRelease() {
      let releasingAnime = [];
      let progress = [];
      let seenIds = new Set(); // Create a Set to store the IDs of seen anime
      release.map((list) => {
        list.entries.map((entry) => {
          if (
            entry.media.status === "RELEASING" &&
            !seenIds.has(entry.media.id)
          ) {
            releasingAnime.push(entry.media);
            seenIds.add(entry.media.id); // Add the ID to the Set
          }
          progress.push(entry);
        });
      });
      setReleaseData(releasingAnime);
      setProg(progress);
    }
    getRelease();
  }, [release]);

  const [list, setList] = useState(null);
  const [planned, setPlanned] = useState(null);
  const [greeting, setGreeting] = useState("");
  const [user, setUser] = useState(null);
  const [removed, setRemoved] = useState();

  const [prog, setProg] = useState(null);

  const popular = populars?.data;
  const data = detail.data[0];

  useEffect(() => {
    async function userData() {
      let data;
      try {
        if (sessions?.user?.name) {
          const res = await fetch(
            `/api/user/profile?name=${sessions.user.name}`
          );
          if (!res.ok) {
            switch (res.status) {
              case 404: {
                console.log("user not found");
                break;
              }
              case 500: {
                console.log("server error");
                break;
              }
              default: {
                console.log("unknown error");
                break;
              }
            }
          } else {
            data = await res.json();
            // Do something with the data
          }
        }
      } catch (error) {
        console.error(error);
        // Handle the error here
      }
      if (!data) {
        const dat = JSON.parse(localStorage.getItem("artplayer_settings"));
        if (dat) {
          const arr = Object.keys(dat).map((key) => dat[key]);
          const newFirst = arr?.sort((a, b) => {
            return new Date(b?.createdAt) - new Date(a?.createdAt);
          });

          const uniqueTitles = new Set();

          // Filter out duplicates and store unique entries
          const filteredData = newFirst.filter((entry) => {
            if (uniqueTitles.has(entry.aniTitle)) {
              return false;
            }
            uniqueTitles.add(entry.aniTitle);
            return true;
          });

          setUser(filteredData);
        }
      } else {
        // Create a Set to store unique aniTitles
        const uniqueTitles = new Set();

        // Filter out duplicates and store unique entries
        const filteredData = data?.WatchListEpisode.filter((entry) => {
          if (uniqueTitles.has(entry.aniTitle)) {
            return false;
          }
          uniqueTitles.add(entry.aniTitle);
          return true;
        });
        setUser(filteredData);
      }
      // const data = await res.json();
    }
    userData();
  }, [sessions?.user?.name, removed]);

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
      if (!sessions?.user?.name) return;

      const getMedia =
        current.filter((item) => item.status === "CURRENT")[0] || null;
      const list = getMedia?.entries
        .map(({ media }) => media)
        .filter((media) => media);

      const planned = plan?.[0]?.entries
        .map(({ media }) => media)
        .filter((media) => media);

      if (list) {
        setList(list.reverse());
      }
      if (planned) {
        setPlanned(planned.reverse());
      }
    }
    userData();
  }, [sessions?.user?.name, current, plan]);

  return (
    <Fragment>
      <Head>
        <title>Moopa</title>
        <meta charSet="UTF-8"></meta>
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="title" content="Moopa" />
        <meta
          name="description"
          content="Discover your new favorite anime or manga title! Moopa offers a vast library of high-quality content, accessible on multiple devices and without any interruptions. Start using Moopa today!"
        />
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
          content="https://beta.moopa.live/preview.png"
        />

        <link rel="icon" href="/c.svg" />
      </Head>

      <MobileNav sessions={sessions} />

      <div className="h-auto w-screen bg-[#141519] text-[#dbdcdd] ">
        <Navigasi />
        <SearchBar />
        <ToastContainer
          pauseOnHover={false}
          style={{
            width: "400px",
          }}
        />

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
                  href={`/en/anime/${data.id}`}
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
            {user?.length > 0 && (
              <motion.div // Add motion.div to each child component
                key="recentlyWatched"
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <Content
                  ids="recentlyWatched"
                  section="Recently Watched"
                  userData={user}
                  userName={sessions?.user?.name}
                  setRemoved={setRemoved}
                />
              </motion.div>
            )}

            {sessions && releaseData?.length > 0 && (
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
                  data={releaseData}
                  og={prog}
                  userName={sessions?.user?.name}
                />
              </motion.div>
            )}

            {sessions && list?.length > 0 && (
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
                  og={prog}
                  userName={sessions?.user?.name}
                />
              </motion.div>
            )}

            {/* SECTION 2 */}
            {sessions && planned?.length > 0 && (
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
                  userName={sessions?.user?.name}
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

            {/* Schedule */}
            {anime.length > 0 && (
              <motion.div // Add motion.div to each child component
                key="schedule"
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <Schedule
                  data={anime[0]}
                  time={{
                    days: days || 0,
                    hours: hours || 0,
                    minutes: minutes || 0,
                    seconds: seconds || 0,
                  }}
                  scheduleData={schedules}
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
    </Fragment>
  );
}
