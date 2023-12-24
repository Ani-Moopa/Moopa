import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Content from "@/components/home/content";
import Modal from "@/components/modal";

import { signIn, useSession } from "next-auth/react";
import AniList from "@/components/media/aniList";
import ListEditor from "@/components/listEditor";

import DetailTop from "@/components/anime/mobile/topSection";
import AnimeEpisode from "@/components/anime/episode";
import { useAniList } from "@/lib/anilist/useAnilist";
import Footer from "@/components/shared/footer";
import { mediaInfoQuery } from "@/lib/graphql/query";
import MobileNav from "@/components/shared/MobileNav";

import pls from "@/utils/request/index";

import Characters from "@/components/anime/charactersCard";
import { redis } from "@/lib/redis";
import { toast } from "sonner";
import { Navbar } from "@/components/shared/NavBar";
import { AniListInfoTypes } from "types/info/AnilistInfoTypes";

type InfoTypes = {
  info: AniListInfoTypes;
  color: string;
  api: string;
  chapterNotFound: string;
};

export default function Info({ info, color, chapterNotFound }: InfoTypes) {
  const { data: session }: any = useSession();
  const { getUserLists } = useAniList(session);

  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState<number>(0);
  const [statuses, setStatuses] = useState<any>(null);
  const [domainUrl, setDomainUrl] = useState("");
  const [watch, setWatch] = useState<string>();

  const [open, setOpen] = useState(false);
  const { id } = useRouter().query;

  const rec = info?.recommendations?.nodes?.map(
    (data) => data.mediaRecommendation
  );

  useEffect(() => {
    if (chapterNotFound) {
      toast.error("Source not found");
      const cleanUrl = window.location.origin + window.location.pathname;
      window.history.replaceState(null, "", cleanUrl);
    }
  }, [chapterNotFound]);

  useEffect(() => {
    handleClose();
    async function fetchData() {
      setLoading(true);
      if (id) {
        try {
          setDomainUrl(window.location.origin);

          setProgress(0);
          setStatuses(null);

          if (session?.user?.name) {
            const res = await getUserLists(info.id);
            const user = res?.data?.Media?.mediaListEntry;

            if (user) {
              setProgress(user.progress);
              const statusMapping: {
                [key: string]: { name: string; value: string };
              } = {
                CURRENT: { name: "Watching", value: "CURRENT" },
                PLANNING: { name: "Plan to watch", value: "PLANNING" },
                COMPLETED: { name: "Completed", value: "COMPLETED" },
                DROPPED: { name: "Dropped", value: "DROPPED" },
                PAUSED: { name: "Paused", value: "PAUSED" },
                REPEATING: { name: "Rewatching", value: "REPEATING" },
              };
              setStatuses(statusMapping[user.status]);
            }
          }
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      }
    }
    fetchData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, info, session?.user?.name]);

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
        <meta
          name="title"
          content={info?.title?.romaji}
          data-title-romaji={info?.title?.romaji}
          data-title-english={info?.title?.english}
          data-title-native={info?.title?.native}
        />
        <meta name="description" content={info.description} />
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
      <Navbar info={info} />
      <Modal open={open} onClose={() => handleClose()}>
        <div>
          {!session && (
            <div className="flex-center flex-col gap-5 px-10 py-5 bg-secondary rounded-md">
              <div className="text-md font-extrabold font-karla">
                Edit your list
              </div>
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
              stats={statuses?.value}
              prg={progress}
              max={info?.episodes}
              info={info}
              close={handleClose}
            />
          )}
        </div>
      </Modal>
      <MobileNav hideProfile={true} />
      <main className="w-screen min-h-screen relative flex flex-col items-center bg-primary gap-5">
        <div className="w-screen absolute">
          <div className="bg-gradient-to-t from-primary from-10% to-transparent absolute h-[280px] w-screen z-10 inset-0" />
          {info?.bannerImage && (
            <Image
              src={info?.bannerImage}
              alt="banner anime"
              height={1000}
              width={1000}
              blurDataURL={info?.bannerImage}
              className="object-cover bg-image blur-[2px] w-screen absolute top-0 left-0 h-[250px] brightness-[55%] z-0"
            />
          )}
        </div>
        <div className="w-full lg:max-w-screen-lg xl:max-w-screen-2xl z-30 flex flex-col gap-5">
          <DetailTop
            info={info}
            handleOpen={handleOpen}
            statuses={statuses}
            watchUrl={watch}
            progress={progress || 0}
            color={color}
          />

          <AnimeEpisode
            info={info}
            session={session}
            progress={progress}
            setProgress={setProgress}
            setWatch={setWatch}
          />

          {info?.characters?.edges && (
            <div className="w-full">
              {/* <div className="w-full h-[150px] bg-white flex-center text-black">
                ad banner
              </div> */}
              <Characters info={info?.characters?.edges} />
            </div>
          )}

          {info && rec?.length !== 0 && (
            <div className="w-full">
              <Content
                ids="recommendAnime"
                section="Recommendations"
                data={rec}
              />
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

export async function getServerSideProps(ctx: any) {
  const { id, notfound } = ctx.query;

  let API_URI;
  API_URI = process.env.API_URI || null || null;
  if (API_URI && API_URI.endsWith("/")) {
    API_URI = API_URI.slice(0, -1);
  }

  let cache, chapterNotFound;

  if (notfound) {
    // create random id string
    chapterNotFound = Math.random().toString(36).substring(7);
  }

  if (redis) {
    cache = await redis.get(`anime:${id}`);
  }

  if (cache) {
    const { info, color } = JSON.parse(cache);
    return {
      props: {
        info,
        color,
        api: API_URI,
        chapterNotFound: chapterNotFound || null,
      },
    };
  } else {
    const [resp] = await pls.post("https://graphql.anilist.co/", {
      // method: "POST",
      // headers: {
      //   "Content-Type": "application/json",
      // },
      body: JSON.stringify({
        query: mediaInfoQuery,
        variables: {
          id: id?.[0],
        },
      }),
    });

    // const json = await resp.json();
    const data = resp?.data?.Media;

    const cacheTime = data?.nextAiringEpisode?.episode
      ? 60 * 10
      : 60 * 60 * 24 * 30;

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

    if (redis) {
      await redis.set(
        `anime:${id}`,
        JSON.stringify({
          info: data,
          color: color,
        }),
        "EX",
        cacheTime
      );
    }

    return {
      props: {
        info: data,
        color: color,
        api: API_URI,
        chapterNotFound: chapterNotFound || null,
      },
    };
  }
}

function getBrightness(hexColor: { match: (arg0: RegExp) => any[] }) {
  if (!hexColor) {
    return 200;
  }
  const rgb = hexColor
    .match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i)
    .slice(1)
    .map((x) => parseInt(x, 16));
  return (299 * rgb[0] + 587 * rgb[1] + 114 * rgb[2]) / 1000;
}

function setTxtColor(hexColor: { match: (arg0: RegExp) => any[] }) {
  const brightness = getBrightness(hexColor);
  return brightness < 150 ? "#fff" : "#000";
}
