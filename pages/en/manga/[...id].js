import ChapterSelector from "@/components/manga/chapters";
import Footer from "@/components/shared/footer";
import Head from "next/head";
import { useEffect, useState } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]";
import { mediaInfoQuery } from "@/lib/graphql/query";
import Modal from "@/components/modal";
import { signIn, useSession } from "next-auth/react";
import AniList from "@/components/media/aniList";
import ListEditor from "@/components/listEditor";
import MobileNav from "@/components/shared/MobileNav";
import Image from "next/image";
import DetailTop from "@/components/anime/mobile/topSection";
import Characters from "@/components/anime/charactersCard";
import Content from "@/components/home/content";
import { toast } from "sonner";
import axios from "axios";
import getAnifyInfo from "@/lib/anify/info";
import { redis } from "@/lib/redis";
import getMangaId from "@/lib/anify/getMangaId";

export default function Manga({ info, anifyData, color, chapterNotFound }) {
  const [domainUrl, setDomainUrl] = useState("");
  const { data: session } = useSession();

  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statuses, setStatuses] = useState(null);
  const [watch, setWatch] = useState();

  const [chapter, setChapter] = useState(null);

  const [open, setOpen] = useState(false);

  const rec = info?.recommendations?.nodes?.map(
    (data) => data.mediaRecommendation
  );

  useEffect(() => {
    setDomainUrl(window.location.origin);
  }, []);

  useEffect(() => {
    if (chapterNotFound) {
      toast.error("Chapter not found");
      const cleanUrl = window.location.origin + window.location.pathname;
      window.history.replaceState(null, null, cleanUrl);
    }
  }, [chapterNotFound]);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        const { data } = await axios.get(`/api/v2/info?id=${anifyData.id}`);

        if (!data.chapters) {
          setLoading(false);
          return;
        }

        setChapter(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    }
    fetchData();

    return () => {
      setChapter(null);
    };
  }, [info?.id]);

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
            ? `Manga - ${
                info.title.romaji || info.title.english || info.title.native
              }`
            : "Getting Info..."}
        </title>
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
          }&image=${info.bannerImage || info.coverImage}`}
        />
        <meta
          name="title"
          data-title-romaji={info?.title?.romaji}
          data-title-english={info?.title?.english}
          data-title-native={info?.title?.native}
        />
      </Head>
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
      <MobileNav sessions={session} hideProfile={true} />
      <main className="w-screen min-h-screen overflow-hidden relative flex flex-col items-center gap-5">
        {/* <div className="absolute bg-gradient-to-t from-primary from-85% to-100% to-transparent w-screen h-full z-10" /> */}
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
        <div className="w-full lg:max-w-screen-lg xl:max-w-screen-2xl z-30 flex flex-col gap-5 pb-10">
          <DetailTop
            info={info}
            session={session}
            handleOpen={handleOpen}
            loading={loading}
            statuses={statuses}
            watchUrl={watch}
            progress={progress}
            color={color}
          />

          {!loading ? (
            chapter?.chapters?.length > 0 ? (
              <ChapterSelector
                chaptersData={chapter.chapters}
                mangaId={chapter.id}
                data={info}
                setWatch={setWatch}
              />
            ) : (
              <div className="h-[20vh] lg:w-full flex-center flex-col gap-5">
                <p className="text-center font-karla font-bold lg:text-lg">
                  Oops!<br></br> It looks like this manga is not available.
                </p>
              </div>
            )
          ) : (
            <div className="flex justify-center">
              <div className="lds-ellipsis">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </div>
            </div>
          )}

          {info?.characters?.edges?.length > 0 && (
            <div className="w-full">
              <Characters info={info?.characters?.edges} />
            </div>
          )}

          {info && rec && rec?.length !== 0 && (
            <div className="w-full">
              <Content
                ids="recommendAnime"
                section="Recommendations"
                type="manga"
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

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);
  const accessToken = session?.user?.token || null;

  const { chapter } = context.query;
  const [id1, id2] = context.query.id;

  let cached;
  let aniId, mangadexId;
  let info, data, color, chapterNotFound;

  if (String(id1).length > 6) {
    aniId = id2;
    mangadexId = id1;
  } else {
    aniId = id1;
    mangadexId = id2;
  }

  if (chapter) {
    // create random id string
    chapterNotFound = Math.random().toString(36).substring(7);
  }

  if (aniId === "na" && mangadexId) {
    const datas = await getAnifyInfo(mangadexId);

    aniId =
      datas.mappings?.filter((i) => i.providerId === "anilist")[0]?.id || null;

    if (!aniId) {
      info = datas;
      data = datas;
      color = {
        backgroundColor: `${"#ffff"}`,
        color: "#000",
      };
      // return {
      //   redirect: {
      //     destination: "/404",
      //     permanent: false,
      //   },
      // };
    }
  } else if (aniId && !mangadexId) {
    // console.log({ aniId });
    const response = await fetch("https://graphql.anilist.co/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      },
      body: JSON.stringify({
        query: `query ($id: Int, $type: MediaType) {
          Media (id: $id, type: $type) {
            id
            title {
              romaji
              english
              native
            }
          }
        }`,
        variables: {
          id: parseInt(aniId),
          type: "MANGA",
        },
      }),
    });
    const aniListData = await response.json();
    const info = aniListData?.data?.Media;

    const mangaId = await getMangaId(
      info?.title?.romaji,
      info?.title?.english,
      info?.title?.native
    );
    mangadexId = mangaId?.id;

    if (!mangadexId) {
      return {
        redirect: {
          destination: "/404",
          permanent: false,
        },
      };
    }

    return {
      redirect: {
        destination: `/en/manga/${aniId}/${mangadexId}${
          chapter ? "?chapter=404" : ""
        }`,
        permanent: true,
      },
    };
  } else if (!aniId && mangadexId) {
    const data = await getAnifyInfo(mangadexId);

    aniId =
      data.mappings.filter((i) => i.providerId === "anilist")[0]?.id || null;

    if (!aniId) {
      info = data;
      // return {
      //   redirect: {
      //     destination: "/404",
      //     permanent: false,
      //   },
      // };
    }

    return {
      redirect: {
        destination: `/en/manga/${aniId ? aniId : "na"}${`/${mangadexId}`}${
          chapter ? "?chapter=404" : ""
        }`,
        permanent: true,
      },
    };
  } else {
    if (redis) {
      const getCached = await redis.get(`mangaPage:${mangadexId}`);

      if (getCached) {
        cached = JSON.parse(getCached);
      }
    }
    // let chapters;
    if (cached) {
      data = cached.data;
      info = cached.info;
      color = cached.color;
    } else {
      data = await getAnifyInfo(mangadexId);

      const aniListId =
        data.mappings?.filter((i) => i.providerId === "anilist")[0]?.id || null;

      const response = await fetch("https://graphql.anilist.co/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
        },
        body: JSON.stringify({
          query: mediaInfoQuery,
          variables: {
            id: parseInt(aniListId),
            type: "MANGA",
          },
        }),
      });
      const aniListData = await response.json();
      if (aniListData?.data?.Media) info = aniListData?.data?.Media;

      const textColor = setTxtColor(info?.color);

      color = {
        backgroundColor: `${info?.color || "#ffff"}`,
        color: textColor,
      };

      if (redis) {
        await redis.set(
          `mangaPage:${mangadexId}`,
          JSON.stringify({ data, info, color }),
          "ex",
          60 * 60 * 24
        );
      }
    }
  }

  return {
    props: {
      info: info || null,
      anifyData: data || null,
      chapterNotFound: chapterNotFound || null,
      color: color || null,
    },
  };
}

function getBrightness(hexColor) {
  if (!hexColor) {
    return 200;
  }
  const rgb = hexColor
    .match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i)
    .slice(1)
    .map((x) => parseInt(x, 16));
  return (299 * rgb[0] + 587 * rgb[1] + 114 * rgb[2]) / 1000;
}

function setTxtColor(hexColor) {
  const brightness = getBrightness(hexColor);
  return brightness < 150 ? "#fff" : "#000";
}
