import MobileNav from "@/components/shared/MobileNav";
import { Navbar } from "@/components/shared/NavBar";
import { useWatchProvider } from "@/lib/context/watchPageProvider";
import pls from "@/utils/request";
import { GetServerSidePropsContext } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";

type QueryProps = {
  v: string;
  id: string;
  n: string;
  prv: string;
  dub: string;
  t: string;
};

type WatchPageProps = {
  watchId: string;
  aniId: string;
  provider: string;
  dub: string;
  epiNumber: string;
  seekTo: string;
};

type EpisodeData = {
  from: string;
  providerId: string;
  episodes: {
    id: string;
    isFiller: boolean;
    number: number;
    title: string;
    img: string;
    hasDub: boolean;
    description: string;
  }[];
};

export async function getServerSideProps({ query }: GetServerSidePropsContext) {
  const { v, id, prv, dub, n, t } = query as QueryProps;
  return {
    props: {
      watchId: v || null,
      aniId: id || null,
      provider: prv || null,
      dub: dub || null,
      epiNumber: n || null,
      seekTo: t || null
    }
  };
}

function filterGogoanime(providers: any[]) {
  let gogoanimeCount = 0;
  if (providers.some((p) => p.from === "consumet")) {
    return providers.filter((provider) => {
      if (provider.provider !== "gogoanime") {
        return true;
      } else if (provider.from === "consumet") {
        gogoanimeCount++;
        return gogoanimeCount <= 1;
      } else {
        return false;
      }
    });
  } else {
    return providers;
  }
}

function getEpisodeNavigation(
  episodesData: EpisodeData[],
  current: number,
  provider: string
) {
  // todo get previous current and next episodes from providers

  console.log({
    episodesData,
    current,
    provider
  });

  const currentEpisode = episodesData
    .find((ep) => ep.providerId === provider)
    ?.episodes.find((ep) => ep.number === current);
  return currentEpisode;
}

export default function WatchPage({
  watchId,
  aniId,
  provider,
  dub,
  epiNumber,
  seekTo
}: WatchPageProps) {
  const [data, setData] = useState([]);

  const { track } = useWatchProvider();

  useEffect(() => {
    async function getEpisodeSource() {
      const episodes = await pls.get(`/api/v2/episode/${aniId}`);
      let getAllProvider = [];

      getAllProvider = episodes.map((ep: any) => ({
        provider: ep.providerId,
        from: ep.from,
        episode: ep.episodes.find(
          (eps: any) => eps.number === parseInt(epiNumber)
        )
      }));

      const filteredGogo = filterGogoanime(episodes);

      console.log(
        getEpisodeNavigation(filteredGogo, parseInt(epiNumber), provider)
      );

      setData(episodes);
    }
    getEpisodeSource();
  }, [provider, epiNumber, aniId]);

  return (
    <>
      <Head>
        <title>Watch Anime</title>
      </Head>
      <main className="w-screen h-full">
        <Navbar
          scrollP={20}
          withNav
          shrink
          // todo add padding condition for theater mode
          paddingY={`py-2`}
        />
        {/* // todo add session */}
        <MobileNav hideProfile />
        <div className="mx-auto pt-16">
          {/* <div>Player on fullscreen / theater not fullscreen</div> */}
          <div className="w-full flex flex-col lg:flex-row mx-auto max-w-[95%]">
            {/* Default mode */}
            <div className="w-full border">
              {/* Primary */}
              <div className="aspect-video border border-yellow-300">
                Video Player
              </div>
              <div className="border border-green-300">
                <div>video details</div>
                <div>more info</div>
              </div>
            </div>
            <div className="border w-[25%] shrink-0">
              {/* Secondary */}
              Episode lists
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
