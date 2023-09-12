import Head from "next/head";
import { useEffect, useState } from "react";

import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../api/auth/[...nextauth]";

import Navigasi from "../../../../components/home/staticNav";
import PrimarySide from "../../../../components/anime/watch/primarySide";
import SecondarySide from "../../../../components/anime/watch/secondarySide";
import { createList, createUser, getEpisode } from "../../../../prisma/user";

export default function Info({
  sessions,
  watchId,
  provider,
  epiNumber,
  dub,
  info,
  userData,
  proxy,
  disqus,
}) {
  const [currentEpisode, setCurrentEpisode] = useState(null);
  const [loading, setLoading] = useState(false);

  const [artStorage, setArtStorage] = useState(null);
  const [episodesList, setepisodesList] = useState();
  const [mapProviders, setMapProviders] = useState(null);

  const [onList, setOnList] = useState(false);
  const [origin, setOrigin] = useState(null);

  useEffect(() => {
    setLoading(true);
    setOrigin(window.location.origin);
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

        setMapProviders(getMap?.episodes);
      }

      if (episodes) {
        const getProvider = episodes?.find((i) => i.providerId === provider);
        const episodeList = dub
          ? getProvider?.episodes?.filter((x) => x.hasDub === true)
          : getProvider?.episodes.slice(0, getMap?.episodes.length);
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
          setCurrentEpisode({
            prev: previousEpisode,
            playing: {
              id: currentEpisode.id,
              title: playingData?.title,
              description: playingData?.description,
              image: playingData?.image,
              number: currentEpisode.number,
            },
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
            map={mapProviders}
            providerId={provider}
            watchId={watchId}
            episode={episodesList}
            artStorage={artStorage}
            dub={dub}
          />
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);
  const accessToken = session?.user?.token || null;

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
      aniId: aniId || null,
      provider: provider || null,
      watchId: watchId || null,
      epiNumber: epiNumber || null,
      dub: dub || null,
      userData: userData?.[0] || null,
      info: data.data.Media || null,
      proxy,
      disqus,
    },
  };
}
