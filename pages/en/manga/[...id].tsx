import Footer from "@/components/shared/footer";
import Head from "next/head";
import { useEffect, useState } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]";
import { mediaInfoQuery } from "@/lib/graphql/query";
import Modal from "@/components/modal";
import { signIn } from "next-auth/react";
import AniList from "@/components/media/aniList";
import ListEditor from "@/components/listEditor";
import MobileNav from "@/components/shared/MobileNav";
import Image from "next/image";
import DetailTop from "@/components/anime/mobile/topSection";
import Characters from "@/components/anime/charactersCard";
import Content from "@/components/home/content";
import { toast } from "sonner";
import getAnifyInfo from "@/lib/anify/info";
import getMangaId from "@/lib/anify/getMangaId";
import { useRouter } from "next/router";
import ChaptersComponent from "@/components/manga/ChaptersComponent";
import pls from "@/utils/request/index";
import { AniListInfoTypes } from "types/info/AnilistInfoTypes";
import { Navbar } from "@/components/shared/NavBar";

type MangaProps = {
  aniId: string;
  mangadexId: string;
  sessions: any;
  metaData: any;
  chapterNotFound: string;
};

export default function Manga({
  aniId,
  mangadexId,
  sessions: session,
  chapterNotFound,
  metaData,
}: MangaProps) {
  const [domainUrl, setDomainUrl] = useState("");

  const [loading, setLoading] = useState(false);
  const [watch, setWatch] = useState();

  const [mangaId, setMangaId] = useState<string | null>(mangadexId);
  const [chapters, setChapters] = useState(null);
  const [notFound, setNotFound] = useState(false);

  const [info, setInfo] = useState<AniListInfoTypes | null>(null);
  const [color, setColor] = useState(null);

  const [open, setOpen] = useState(false);

  const router = useRouter();

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
      window.history.replaceState(null, "", cleanUrl);
    }
  }, [chapterNotFound]);

  useEffect(() => {
    setMangaId(null);
  }, [aniId]);

  useEffect(() => {
    async function fetchData() {
      try {
        let info, data, color: any;
        setChapters(null);
        setNotFound(false);

        if (aniId && mangadexId) {
          const [aniListData] = await pls.post("https://graphql.anilist.co/", {
            body: JSON.stringify({
              query: mediaInfoQuery,
              variables: {
                id: parseInt(aniId),
                type: "MANGA",
              },
            }),
          });
          // const aniListData = await response.json();
          info = aniListData?.data?.Media;
          const textColor = setTxtColor(info?.color);

          color = {
            backgroundColor: `${info?.color || "#ffff"}`,
            color: textColor,
          };

          setInfo(info);
          setColor(color);
          setMangaId(mangadexId);
          // console.log("wow two of them here");
        } else if (aniId && !mangadexId) {
          const [aniListData] = await pls.post("https://graphql.anilist.co/", {
            body: JSON.stringify({
              query: mediaInfoQuery,
              variables: {
                id: parseInt(aniId),
                type: "MANGA",
              },
            }),
          });
          // const aniListData = await response.json();
          info = aniListData?.data?.Media;
          const textColor = setTxtColor(info?.color);

          color = {
            backgroundColor: `${info?.color || "#ffff"}`,
            color: textColor,
          };

          setInfo(info);
          setColor(color);

          const mangaId = await getMangaId(
            info?.title?.romaji,
            info?.title?.english,
            info?.title?.native
          );

          mangadexId = (mangaId as { id: string }).id;

          if (mangadexId) {
            setMangaId(mangadexId);
            // console.log("mangadex is here", mangadexId);
            router.push("/en/manga/" + aniId + "/" + mangadexId, undefined, {
              shallow: true,
            });
          } else {
            // console.log("why is this running?");
            setMangaId(null);
            setLoading(false);
            setNotFound(true);
            // router.push("/en/manga/" + aniId, undefined, { shallow: true });
          }
        } else if (!aniId && mangadexId) {
          data = await getAnifyInfo(mangadexId);

          const aniListId =
            data.mappings?.filter((i: any) => i.providerId === "anilist")[0]
              ?.id || null;

          if (aniListId) {
            const [aniListData] = await pls.post(
              "https://graphql.anilist.co/",
              {
                body: JSON.stringify({
                  query: mediaInfoQuery,
                  variables: {
                    id: parseInt(aniListId),
                    type: "MANGA",
                  },
                }),
              }
            );
            // const aniListData = await response.json();
            info = aniListData?.data?.Media;

            router.push(
              "/en/manga/" + aniListId + "/" + mangadexId,
              undefined,
              { shallow: true }
            );
          }

          const textColor = setTxtColor(data?.color);

          color = {
            backgroundColor: `${data?.color || "#ffff"}`,
            color: textColor,
          };

          setInfo(aniListId ? info : data);
          setColor(color);
          setMangaId(mangadexId);
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();

    return () => {
      setInfo(null);
    };
  }, [session?.user?.token, aniId, mangadexId]);

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
          {metaData
            ? `Manga - ${
                metaData.title.romaji ||
                metaData.title.english ||
                metaData.title.native
              }`
            : "Getting Info..."}
        </title>
        <meta
          name="description"
          content={`${metaData?.description?.slice(0, 180)}...`}
        />
        <meta
          name="keywords"
          content={`${metaData?.genres}, ${metaData?.author} `}
        />
        <meta
          property="og:title"
          content={`Moopa - ${
            metaData?.title.romaji || metaData?.title.english
          }`}
        />
        <meta
          property="og:description"
          content={`${metaData?.description?.slice(0, 180)}...`}
        />
        <meta
          property="og:image"
          content={`${domainUrl}/api/og?title=${
            metaData?.title.romaji || metaData?.title.english
          }&image=${metaData?.bannerImage || metaData?.coverImage}`}
        />
        <meta
          property="og:url"
          content={`${domainUrl}/en/manga/${metaData?.id}`}
        />
        <meta property="og:type" content="book" />
        <meta property="og:locale" content="en_US" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@yourTwitterHandle" />
        <meta
          name="twitter:title"
          content={`Moopa - ${
            metaData?.title.romaji || metaData?.title.english
          }`}
        />
        <meta
          name="twitter:description"
          content={`${metaData?.description?.slice(0, 180)}...`}
        />
        <meta name="robots" content="noindex" />
        <meta
          name="twitter:image"
          content={`${domainUrl}/api/og?title=${
            metaData?.title.romaji || metaData?.title.english
          }&image=${metaData?.bannerImage || metaData?.coverImage}`}
        />
      </Head>
      <Navbar info={info} manga />
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
              // stats={statuses?.value}
              // prg={progress}
              max={info?.episodes}
              info={info}
              close={handleClose}
            />
          )}
        </div>
      </Modal>
      <MobileNav hideProfile={true} />
      <main className="w-screen min-h-screen overflow-hidden relative flex flex-col items-center gap-5">
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
          {/* {info && ( */}
          <DetailTop
            info={info}
            handleOpen={handleOpen}
            // statuses={statuses}
            watchUrl={watch}
            // progress={progress}
            color={color}
          />
          {/* )} */}

          <ChaptersComponent
            info={info}
            mangaId={mangaId}
            aniId={aniId}
            setWatch={setWatch}
            chapter={chapters}
            setChapter={setChapters}
            loading={loading}
            setLoading={setLoading}
            notFound={notFound}
            setNotFound={setNotFound}
          />

          {info && info.characters.edges.length > 0 && (
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

export async function getServerSideProps(context: any) {
  const session: any = await getServerSession(
    context.req,
    context.res,
    authOptions
  );
  const accessToken = session?.user?.token || null;

  const { chapter } = context.query;
  const [id1, id2] = context.query.id;

  let aniId, mangadexId;
  let chapterNotFound;

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

  const [aniListData] = await pls.post("https://graphql.anilist.co/", {
    body: JSON.stringify({
      query: `query ($id: Int, $type: MediaType) {
        Media(id: $id, type: $type) {
          id
          title {
            romaji
            english
            native
          }
          bannerImage
          genres
          coverImage {
            extraLarge
            large
            medium
            color
          }
          status
          description
        }
      }`,
      variables: {
        id: parseInt(aniId),
        type: "MANGA",
      },
    }),
  });
  const info = aniListData?.data?.Media;

  return {
    props: {
      aniId: aniId || null,
      mangadexId: mangadexId || null,
      accessToken: accessToken || null,
      sessions: session || null,
      metaData: info || null,
      // info: info || null,
      // anifyData: data || null,
      chapterNotFound: chapterNotFound || null,
      // color: color || null,
    },
  };
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
