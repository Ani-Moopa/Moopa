import React, { useEffect, useRef, useState } from "react";
import PlayerComponent from "@/components/watch/player/playerComponent";
import { FlagIcon, ShareIcon } from "@heroicons/react/24/solid";
import Details from "@/components/watch/primary/details";
import EpisodeLists from "@/components/watch/secondary/episodeLists";
import { getServerSession } from "next-auth";
import { useWatchProvider } from "@/lib/context/watchPageProvider";
import { authOptions } from "../../../api/auth/[...nextauth]";
import { createList, createUser, getEpisode } from "@/prisma/user";
import Link from "next/link";
import MobileNav from "@/components/shared/MobileNav";
import { NewNavbar } from "@/components/shared/NavBar";
import Modal from "@/components/modal";
import AniList from "@/components/media/aniList";
import { signIn } from "next-auth/react";
import BugReportForm from "@/components/shared/bugReport";
import Skeleton from "react-loading-skeleton";
import Head from "next/head";

export async function getServerSideProps(context) {
  let userData = null;
  const session = await getServerSession(context.req, context.res, authOptions);
  const accessToken = session?.user?.token || null;

  const query = context?.query;
  if (!query) {
    return {
      notFound: true,
    };
  }

  let proxy;
  proxy = process.env.PROXY_URI;
  if (proxy && proxy.endsWith("/")) {
    proxy = proxy.slice(0, -1);
  }
  const disqus = process.env.DISQUS_SHORTNAME;

  const [aniId, provider] = query?.info;
  const watchId = query?.id;
  const epiNumber = query?.num;
  const dub = query?.dub;

  const ress = await fetch(`https://graphql.anilist.co`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
    },
    body: JSON.stringify({
      query: `query ($id: Int) {
              Media (id: $id) {
                mediaListEntry {
                  progress
                  status
                  customLists
                  repeat
                }
                id
                idMal
                title {
                  romaji
                  english
                  native
                }
                status
                genres
                episodes
                studios {
                  edges {
                    node {
                      id
                      name
                    }
                  }
                }
                bannerImage
                description
                coverImage {
                  extraLarge
                  color
                }
                synonyms
                  
              }
            }
          `,
      variables: {
        id: aniId,
      },
    }),
  });
  const data = await ress.json();

  try {
    if (session) {
      await createUser(session.user.name);
      await createList(session.user.name, watchId);
      const data = await getEpisode(session.user.name, watchId);
      userData = JSON.parse(
        JSON.stringify(data, (key, value) => {
          if (key === "createdDate") {
            return String(value);
          }
          return value;
        })
      );
    }
  } catch (error) {
    console.error(error);
    // Handle the error here
  }
  return {
    props: {
      sessions: session,
      provider: provider || null,
      watchId: watchId || null,
      epiNumber: epiNumber || null,
      dub: dub || null,
      userData: userData?.[0] || null,
      info: data?.data?.Media || null,
      proxy,
      disqus,
    },
  };
}

export default function Watch({
  info,
  watchId,
  disqus,
  proxy,
  dub,
  userData,
  sessions,
  provider,
  epiNumber,
}) {
  const [artStorage, setArtStorage] = useState(null);

  const [episodeNavigation, setEpisodeNavigation] = useState(null);
  const [episodesList, setepisodesList] = useState();
  const [mapEpisode, setMapEpisode] = useState(null);

  const [episodeSource, setEpisodeSource] = useState(null);

  const [open, setOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const [onList, setOnList] = useState(false);

  const { theaterMode, setPlayerState, setAutoPlay, setMarked } =
    useWatchProvider();

  const playerRef = useRef(null);

  useEffect(() => {
    async function getInfo() {
      if (info.mediaListEntry) {
        setOnList(true);
      }

      const response = await fetch(
        `/api/v2/episode/${info.id}?releasing=${
          info.status === "RELEASING" ? "true" : "false"
        }${dub ? "&dub=true" : ""}`
      ).then((res) => res.json());
      const getMap = response.find((i) => i?.map === true) || response[0];
      let episodes = response;

      if (getMap) {
        if (provider === "gogoanime" && !watchId.startsWith("/")) {
          episodes = episodes.filter((i) => {
            if (i?.providerId === "gogoanime" && i?.map !== true) {
              return null;
            }
            return i;
          });
        }

        setMapEpisode(getMap?.episodes);
      }

      if (episodes) {
        const getProvider = episodes?.find((i) => i.providerId === provider);
        const episodeList = getProvider?.episodes.slice(
          0,
          getMap?.episodes.length
        );
        const playingData = getMap?.episodes.find(
          (i) => i.number === Number(epiNumber)
        );

        if (getProvider) {
          setepisodesList(episodeList);
          const currentEpisode = episodeList?.find(
            (i) => i.number === parseInt(epiNumber)
          );
          const nextEpisode = episodeList?.find(
            (i) => i.number === parseInt(epiNumber) + 1
          );
          const previousEpisode = episodeList?.find(
            (i) => i.number === parseInt(epiNumber) - 1
          );
          setEpisodeNavigation({
            prev: previousEpisode,
            playing: {
              id: currentEpisode.id,
              title: playingData?.title,
              description: playingData?.description,
              img: playingData?.img || playingData?.image,
              number: currentEpisode.number,
            },
            next: nextEpisode,
          });
        }
      }

      setArtStorage(JSON.parse(localStorage.getItem("artplayer_settings")));
      // setEpiData(episodes);
    }
    getInfo();

    return () => {
      setEpisodeNavigation(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessions?.user?.name, epiNumber, dub]);

  useEffect(() => {
    async function fetchData() {
      if (info) {
        const autoplay =
          localStorage.getItem("autoplay_video") === "true" ? true : false;
        setAutoPlay(autoplay);

        const anify = await fetch("/api/v2/source", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            source:
              provider === "gogoanime" && !watchId.startsWith("/")
                ? "consumet"
                : "anify",
            providerId: provider,
            watchId: watchId,
            episode: epiNumber,
            id: info.id,
            sub: dub ? "dub" : "sub",
          }),
        }).then((res) => res.json());

        const skip = await fetch(
          `https://api.aniskip.com/v2/skip-times/${info.idMal}/${parseInt(
            epiNumber
          )}?types[]=ed&types[]=mixed-ed&types[]=mixed-op&types[]=op&types[]=recap&episodeLength=`
        ).then((res) => {
          if (!res.ok) {
            switch (res.status) {
              case 404: {
                return null;
              }
            }
          }
          return res.json();
        });

        const op =
          skip?.results?.find((item) => item.skipType === "op") || null;
        const ed =
          skip?.results?.find((item) => item.skipType === "ed") || null;

        const episode = {
          epiData: anify,
          skip: {
            op,
            ed,
          },
        };

        setEpisodeSource(episode);
      }
    }

    fetchData();
    return () => {
      setEpisodeSource();
      setPlayerState({
        currentTime: 0,
        isPlaying: false,
      });
      setMarked(0);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [provider, watchId, info?.id]);

  useEffect(() => {
    const mediaSession = navigator.mediaSession;
    if (!mediaSession) return;

    const now = episodeNavigation?.playing;
    const poster = now?.img || info?.bannerImage;
    const title = now?.title || info?.title?.romaji;

    const artwork = poster
      ? [{ src: poster, sizes: "512x512", type: "image/jpeg" }]
      : undefined;

    mediaSession.metadata = new MediaMetadata({
      title: title,
      artist: `Moopa ${
        title === info?.title?.romaji
          ? "- Episode " + epiNumber
          : `- ${info?.title?.romaji || info?.title?.english}`
      }`,
      artwork,
    });
  }, [episodeNavigation, info, epiNumber]);

  const handleShareClick = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `Watch Now - ${info?.title?.english || info.title.romaji}`,
          // text: `Watch [${info?.title?.romaji}] and more on Moopa. Join us for endless anime entertainment"`,
          url: window.location.href,
        });
      } else {
        // Web Share API is not supported, provide a fallback or show a message
        alert("Web Share API is not supported in this browser.");
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

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
          {episodeNavigation?.playing?.title ||
            `${info?.title?.romaji} - Episode ${epiNumber}`}
        </title>
        <meta
          name="title"
          data-title-romaji={info?.title?.romaji}
          data-title-english={info?.title?.english}
          data-title-native={info?.title?.native}
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="description"
          content={episodeNavigation?.playing?.description || info?.description}
        />
        <meta
          name="keywords"
          content="anime, anime streaming, anime streaming website, anime streaming free, anime streaming website free, anime streaming website free english subbed, anime streaming website free english dubbed, anime streaming website free english subbed and dubbed, anime streaming webs
          ite free english subbed and dubbed download, anime streaming website free english subbed and dubbed"
        />
        <meta name="robots" content="index, follow" />

        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content={`Watch - ${
            episodeNavigation?.playing?.title || info?.title?.english
          }`}
        />
        <meta
          property="og:description"
          content={episodeNavigation?.playing?.description || info?.description}
        />
        <meta
          property="og:image"
          content={episodeNavigation?.playing?.img || info?.bannerImage}
        />
        <meta property="og:site_name" content="Moopa" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:image"
          content={episodeNavigation?.playing?.img || info?.bannerImage}
        />
        <meta
          name="twitter:title"
          content={`Watch - ${
            episodeNavigation?.playing?.title || info?.title?.english
          }`}
        />
        <meta
          name="twitter:description"
          content={episodeNavigation?.playing?.description || info?.description}
        />
      </Head>
      <Modal open={open} onClose={() => handleClose()}>
        {!sessions && (
          <div className="flex-center flex-col gap-5 px-10 py-5 bg-secondary rounded-md">
            <h1 className="text-md font-extrabold font-karla">
              Edit your list
            </h1>
            <button
              className="flex items-center bg-[#363642] rounded-md text-white p-1"
              onClick={() => signIn("AniListProvider")}
            >
              <h1 className="px-1 font-bold font-karla">Login with AniList</h1>
              <div className="scale-[60%] pb-[1px]">
                <AniList />
              </div>
            </button>
          </div>
        )}
      </Modal>
      <BugReportForm isOpen={isOpen} setIsOpen={setIsOpen} />
      <main className="w-screen h-full">
        <NewNavbar
          scrollP={20}
          withNav={true}
          shrink={true}
          paddingY={`py-2 ${theaterMode ? "" : "lg:py-4"}`}
        />
        <MobileNav hideProfile={true} sessions={sessions} />
        <div
          className={`mx-auto pt-16 ${theaterMode ? "lg:pt-16" : "lg:pt-20"}`}
        >
          {theaterMode && (
            <PlayerComponent
              id={"cinematic"}
              session={sessions}
              playerRef={playerRef}
              dub={dub}
              info={info}
              watchId={watchId}
              proxy={proxy}
              track={episodeNavigation}
              data={episodeSource?.epiData}
              skip={episodeSource?.skip}
              timeWatched={userData?.timeWatched}
              provider={provider}
              className="w-screen max-h-[85dvh]"
            />
          )}
          <div
            id="default"
            className={`${
              theaterMode ? "lg:max-w-[95%] xl:max-w-[80%]" : "lg:max-w-[95%]"
            } w-full flex flex-col lg:flex-row mx-auto`}
          >
            <div id="primary" className="w-full">
              {!theaterMode && (
                <PlayerComponent
                  id={"default"}
                  session={sessions}
                  playerRef={playerRef}
                  dub={dub}
                  info={info}
                  watchId={watchId}
                  proxy={proxy}
                  track={episodeNavigation}
                  data={episodeSource?.epiData}
                  skip={episodeSource?.skip}
                  timeWatched={userData?.timeWatched}
                  provider={provider}
                />
              )}
              <div
                id="details"
                className="flex flex-col gap-5 w-full px-3 lg:px-0"
              >
                <div className="flex items-end justify-between pt-3 border-b-2 border-secondary pb-2">
                  <div className="w-[55%]">
                    <div className="flex font-outfit font-semibold text-lg lg:text-2xl text-white line-clamp-1">
                      <Link
                        href={`/en/anime/${info?.id}`}
                        className="hover:underline line-clamp-1"
                      >
                        {(episodeNavigation?.playing?.title ||
                          info.title.romaji) ??
                          "Loading..."}
                      </Link>
                    </div>
                    <h3 className="font-karla">
                      {episodeNavigation?.playing?.number ? (
                        `Episode ${episodeNavigation?.playing?.number}`
                      ) : (
                        <Skeleton width={120} height={16} />
                      )}
                    </h3>
                  </div>
                  <div>
                    <div className="flex gap-2 text-sm">
                      <button
                        type="button"
                        onClick={handleShareClick}
                        className="flex items-center gap-2 px-3 py-1 ring-[1px] ring-white/20 rounded overflow-hidden"
                      >
                        <ShareIcon className="w-5 h-5" />
                        share
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsOpen(true)}
                        className="flex items-center gap-2 px-3 py-1 ring-[1px] ring-white/20 rounded overflow-hidden"
                      >
                        <FlagIcon className="w-5 h-5" />
                        report
                      </button>
                    </div>
                  </div>
                  {/* <div>right</div> */}
                </div>

                <Details
                  info={info}
                  session={sessions}
                  description={info?.description}
                  epiNumber={epiNumber}
                  id={info}
                  onList={onList}
                  setOnList={setOnList}
                  handleOpen={() => handleOpen()}
                  disqus={disqus}
                />
              </div>
            </div>
            <div
              id="secondary"
              className={`relative ${theaterMode ? "pt-5" : "pt-4 lg:pt-0"}`}
            >
              <EpisodeLists
                info={info}
                session={sessions}
                map={mapEpisode}
                providerId={provider}
                watchId={watchId}
                episode={episodesList}
                artStorage={artStorage}
                track={episodeNavigation}
                dub={dub}
              />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
