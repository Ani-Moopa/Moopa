import Head from "next/head";
import { useEffect, useState } from "react";

import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../api/auth/[...nextauth]";

import dotenv from "dotenv";
import Navigasi from "../../../../components/home/staticNav";
import PrimarySide from "../../../../components/anime/watch/primarySide";
import SecondarySide from "../../../../components/anime/watch/secondarySide";
import { GET_MEDIA_USER } from "../../../../queries";
import { createList, createUser, getEpisode } from "../../../../prisma/user";
// import { updateUser } from "../../../../prisma/user";

export default function Info({
  sessions,
  aniId,
  watchId,
  provider,
  epiNumber,
  dub,
  data,
  userData,
  proxy,
  disqus,
}) {
  const [info, setInfo] = useState(data.data.Media);
  const [currentEpisode, setCurrentEpisode] = useState(null);
  const [loading, setLoading] = useState(false);

  const [progress, setProgress] = useState(0);
  const [statuses, setStatuses] = useState("CURRENT");
  const [artStorage, setArtStorage] = useState(null);
  const [episodesList, setepisodesList] = useState();
  const [onList, setOnList] = useState(false);
  const [origin, setOrigin] = useState(null);

  useEffect(() => {
    setLoading(true);
    setOrigin(window.location.origin);
    async function getInfo() {
      if (sessions?.user?.name) {
        const response = await fetch("https://graphql.anilist.co/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: GET_MEDIA_USER,
            variables: {
              username: sessions?.user?.name,
            },
          }),
        });

        const responseData = await response.json();

        const prog = responseData?.data?.MediaListCollection;

        if (prog && prog.lists.length > 0) {
          const gut = prog.lists
            .flatMap((item) => item.entries)
            .find((item) => item.mediaId === parseInt(aniId));

          if (gut) {
            setProgress(gut.progress);
            setOnList(true);
          }

          if (gut?.status === "COMPLETED") {
            setStatuses("REPEATING");
          } else if (
            gut?.status === "REPEATING" &&
            gut?.media?.episodes === parseInt(epiNumber)
          ) {
            setStatuses("COMPLETED");
          } else if (gut?.status === "REPEATING") {
            setStatuses("REPEATING");
          } else if (gut?.media?.episodes === parseInt(epiNumber)) {
            setStatuses("COMPLETED");
          } else if (
            gut?.media?.episodes !== null &&
            data?.data?.Media.episodes === parseInt(epiNumber)
          ) {
            setStatuses("COMPLETED");
            setLoading(false);
          }
        }
      }

      const response = await fetch(
        `/api/consumet/episode/${aniId}${dub ? `?dub=${dub}` : ""}`
      );
      const episodes = await response.json();

      if (episodes) {
        const getProvider = episodes.data?.find(
          (i) => i.providerId === provider
        );
        if (getProvider) {
          setepisodesList(getProvider.episodes);
          const currentEpisode = getProvider.episodes?.find(
            (i) => i.number === parseInt(epiNumber)
          );
          const nextEpisode = getProvider.episodes?.find(
            (i) => i.number === parseInt(epiNumber) + 1
          );
          const previousEpisode = getProvider.episodes?.find(
            (i) => i.number === parseInt(epiNumber) - 1
          );
          setCurrentEpisode({
            prev: previousEpisode,
            playing: currentEpisode,
            next: nextEpisode,
          });
        } else {
          setLoading(false);
        }
      }

      setArtStorage(JSON.parse(localStorage.getItem("artplayer_settings")));
      // setEpiData(episodes);
      setLoading(false);
    }
    getInfo();

    return () => {
      setCurrentEpisode(null);
    };
  }, [sessions?.user?.name, epiNumber, dub]);

  return (
    <>
      <Head>
        <title>{info?.title?.romaji || "Retrieving data..."}</title>
        <meta
          name="title"
          data-title-romaji={info?.title?.romaji}
          data-title-english={info?.title?.english}
          data-title-native={info?.title?.native}
        />
        <meta
          name="description"
          content={currentEpisode?.playing?.description || info?.description}
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content={`Episode ${epiNumber} - ${
            info.title.romaji || info.title.english
          }`}
        />
        <meta
          name="twitter:description"
          content={`${
            currentEpisode?.playing?.description?.slice(0, 180) ||
            info?.description?.slice(0, 180)
          }...`}
        />
        <meta
          name="twitter:image"
          content={`${origin}/api/og?title=${
            info.title.romaji || info.title.english
          }&image=${info.bannerImage || info.coverImage.extraLarge}`}
        />
      </Head>

      <Navigasi />
      <div className="w-screen flex justify-center my-3 lg:my-10">
        <div className="lg:w-[95%] flex flex-col lg:flex-row gap-5 lg:gap-0 justify-between">
          <PrimarySide
            info={info}
            navigation={currentEpisode}
            episodeList={episodesList}
            session={sessions}
            epiNumber={epiNumber}
            providerId={provider}
            watchId={watchId}
            status={statuses}
            onList={onList}
            proxy={proxy}
            disqus={disqus}
            setOnList={setOnList}
            setLoading={setLoading}
            loading={loading}
            timeWatched={userData?.timeWatched}
            dub={dub}
          />
          <SecondarySide
            info={info}
            providerId={provider}
            watchId={watchId}
            episode={episodesList}
            progress={progress}
            artStorage={artStorage}
            dub={dub}
          />
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  dotenv.config();

  const session = await getServerSession(context.req, context.res, authOptions);

  const query = context.query;
  if (!query) {
    return {
      notFound: true,
    };
  }

  const proxy = process.env.PROXY_URI;
  const disqus = process.env.DISQUS_SHORTNAME;

  const [aniId, provider] = query.info;
  const watchId = query.id;
  const epiNumber = query.num;
  const dub = query.dub;

  let userData = null;

  const ress = await fetch(`https://graphql.anilist.co`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `query ($id: Int) {
              Media (id: $id) {
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
      aniId: aniId || null,
      provider: provider || null,
      watchId: watchId || null,
      epiNumber: epiNumber || null,
      dub: dub || null,
      userData: userData?.[0] || null,
      data: data || null,
      proxy,
      disqus,
    },
  };
}
