import Head from "next/head";
import { useEffect, useState } from "react";

import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../api/auth/[...nextauth]";

import dotenv from "dotenv";
import Navigasi from "../../../../components/home/staticNav";
import PrimarySide from "../../../../components/anime/watch/primarySide";
import SecondarySide from "../../../../components/anime/watch/secondarySide";
import { GET_MEDIA_USER } from "../../../../queries";
import { createList } from "../../../../prisma/user";
// import { updateUser } from "../../../../prisma/user";

export default function Info({
  sessions,
  aniId,
  watchId,
  provider,
  epiNumber,
  dub,
  proxy,
  disqus,
}) {
  const [info, setInfo] = useState(null);
  const [currentEpisode, setCurrentEpisode] = useState(null);
  const [loading, setLoading] = useState(false);

  const [progress, setProgress] = useState(0);
  const [statuses, setStatuses] = useState("CURRENT");
  const [artStorage, setArtStorage] = useState(null);
  const [episodesList, setepisodesList] = useState();
  const [onList, setOnList] = useState(false);

  useEffect(() => {
    setLoading(true);
    async function getInfo() {
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

      setInfo(data.data.Media);

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

          // if (sessions.user.name) {
          //   const resp = await fetch("/api/user/update/episode", {
          //     method: "PUT",
          //     body: JSON.stringify({
          //       name: sessions.user.name,
          //       id: watchId,
          //       title: currentEpisode.title,
          //       image: currentEpisode.image,
          //       number: Number(epiNumber),
          //     }),
          //   });
          // }

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
  }, [sessions?.user?.name, epiNumber, dub]);

  // console.log(proxy);

  return (
    <>
      <Head>
        <title>{info?.title?.romaji || "Retrieving data..."}</title>
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

  const aniId = query.info[0];
  const provider = query.info[1];
  const watchId = query.id;
  const epiNumber = query.num;
  const dub = query.dub;

  if (session) {
    const user = await createList(session.user.name, watchId);
    if (user) {
      console.log(user);
    }
  }

  return {
    props: {
      sessions: session,
      aniId: aniId || null,
      provider: provider || null,
      watchId: watchId || null,
      epiNumber: epiNumber || null,
      dub: dub || null,
      proxy,
      disqus,
    },
  };
}
