import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Layout from "../../../components/layout";
import Content from "../../../components/home/content";
import Modal from "../../../components/modal";

import { signIn, useSession } from "next-auth/react";
import AniList from "../../../components/media/aniList";
import ListEditor from "../../../components/listEditor";

import { GET_MEDIA_USER } from "../../../queries";
import { GET_MEDIA_INFO } from "../../../queries";

import { ToastContainer } from "react-toastify";

import DetailTop from "../../../components/anime/mobile/topSection";
import DesktopDetails from "../../../components/anime/infoDetails";
import AnimeEpisode from "../../../components/anime/episode";

export default function Info({ info, color }) {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statuses, setStatuses] = useState(null);
  const [domainUrl, setDomainUrl] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [open, setOpen] = useState(false);
  const { id } = useRouter().query;

  const rec = info?.recommendations?.nodes?.map(
    (data) => data.mediaRecommendation
  );

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
            const response = await fetch("https://graphql.anilist.co/", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                query: GET_MEDIA_USER,
                variables: {
                  username: session?.user?.name,
                },
              }),
            });

            const responseData = await response.json();

            const prog = responseData?.data?.MediaListCollection;

            if (prog && prog.lists.length > 0) {
              const gut = prog.lists
                .flatMap((item) => item.entries)
                .find((item) => item.mediaId === parseInt(id[0]));

              if (gut) {
                setProgress(gut.progress);
                const statusMapping = {
                  CURRENT: { name: "Watching", value: "CURRENT" },
                  PLANNING: { name: "Plan to watch", value: "PLANNING" },
                  COMPLETED: { name: "Completed", value: "COMPLETED" },
                  DROPPED: { name: "Dropped", value: "DROPPED" },
                  PAUSED: { name: "Paused", value: "PAUSED" },
                  REPEATING: { name: "Rewatching", value: "REPEATING" },
                };
                setStatuses(statusMapping[gut.status]);
              }
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
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content={`Madara - ${info.title.romaji || info.title.english}`}
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
      <ToastContainer pauseOnHover={false} />
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
              image={info}
              close={handleClose}
            />
          )}
        </div>
      </Modal>
      <Layout navTop="text-white bg-primary lg:pt-0 lg:px-0 bg-slate bg-opacity-40 z-50">
        <div className="w-screen min-h-screen relative flex flex-col items-center bg-primary gap-5">
          <div className="bg-image w-screen">
            <div className="bg-gradient-to-t from-primary from-10% to-transparent absolute h-[300px] w-screen z-10 inset-0" />
            {info ? (
              <>
                {info?.bannerImage && (
                  <Image
                    src={info?.bannerImage}
                    priority={true}
                    alt="banner anime"
                    height={1000}
                    width={1000}
                    className="hidden md:block object-cover bg-image w-screen absolute top-0 left-0 h-[300px] brightness-[70%] z-0"
                  />
                )}
                <Image
                  src={info?.coverImage.extraLarge || info?.coverImage.large}
                  priority={true}
                  alt="banner anime"
                  height={1000}
                  width={1000}
                  className="md:hidden object-cover bg-image w-screen absolute top-0 left-0 h-[300px] brightness-[70%] z-0"
                />
              </>
            ) : (
              <div className="bg-image w-screen absolute top-0 left-0 h-[300px]" />
            )}
          </div>
          <div className="lg:w-[90%] xl:w-[75%] lg:pt-[10rem] z-30 flex flex-col gap-5">
            {/* Mobile Anime Information */}

            <DetailTop
              info={info}
              handleOpen={handleOpen}
              loading={loading}
              statuses={statuses}
            />

            {/* PC Anime Information*/}
            <DesktopDetails
              info={info}
              color={color}
              handleOpen={handleOpen}
              loading={loading}
              statuses={statuses}
              setShowAll={setShowAll}
              showAll={showAll}
            />

            {/* Episodes */}

            <AnimeEpisode info={info} progress={progress} />
          </div>
          {info && rec?.length !== 0 && (
            <div className="w-screen lg:w-[90%] xl:w-[85%]">
              <Content
                ids="recommendAnime"
                section="Recommendations"
                data={rec}
              />
            </div>
          )}
        </div>
      </Layout>
    </>
  );
}

export async function getServerSideProps(context) {
  const { id } = context.query;
  const API_URI = process.env.API_URI;

  const res = await fetch("https://graphql.anilist.co/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: GET_MEDIA_INFO,
      variables: {
        id: id?.[0],
      },
    }),
  });

  const json = await res.json();
  const data = json?.data?.Media;

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

  return {
    props: {
      info: data,
      color: color,
      api: API_URI,
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
