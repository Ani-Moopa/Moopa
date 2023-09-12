import { useEffect, useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { ForwardIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";
import Details from "./primary/details";
import VideoPlayer from "../../videoPlayer";
import Link from "next/link";
import Skeleton from "react-loading-skeleton";
import Modal from "../../modal";
import AniList from "../../media/aniList";

export default function PrimarySide({
  info,
  session,
  epiNumber,
  navigation,
  providerId,
  watchId,
  onList,
  proxy,
  disqus,
  setOnList,
  episodeList,
  timeWatched,
  dub,
}) {
  const [episodeData, setEpisodeData] = useState();
  const [open, setOpen] = useState(false);
  const [skip, setSkip] = useState();

  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    async function fetchData() {
      if (info) {
        const anify = await fetch("/api/v2/source", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            source:
              providerId === "gogoanime" && !watchId.startsWith("/")
                ? "consumet"
                : "anify",
            providerId: providerId,
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

        setSkip({ op, ed });

        setEpisodeData(anify);
        setLoading(false);
      }
    }

    fetchData();
    return () => {
      setEpisodeData();
      setSkip();
    };
  }, [providerId, watchId, info]);

  useEffect(() => {
    const mediaSession = navigator.mediaSession;
    if (!mediaSession) return;

    const now = navigation?.playing;
    const poster = now?.image || info?.bannerImage;
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
  }, [navigation, info, epiNumber]);

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
      <Modal open={open} onClose={() => handleClose()}>
        {!session && (
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
      <div className="w-full h-full">
        <div key={watchId} className="w-full aspect-video bg-black">
          {!loading ? (
            navigation && episodeData?.sources?.length !== 0 ? (
              <VideoPlayer
                session={session}
                info={info}
                data={episodeData}
                provider={providerId}
                id={watchId}
                progress={epiNumber}
                skip={skip}
                proxy={proxy}
                aniId={info.id}
                aniTitle={info.title?.romaji || info.title?.english}
                track={navigation}
                timeWatched={timeWatched}
                dub={dub}
              />
            ) : (
              <p className="h-full flex-center">
                Video is not available, please try other providers
              </p>
            )
          ) : (
            <div className="flex-center aspect-video bg-black">
              <div className="lds-ellipsis">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </div>
            </div>
          )}
        </div>
        <div className="flex flex-col divide-y divide-white/20">
          {info && episodeList ? (
            <div className="flex items-center justify-between py-3 px-3">
              <div className="flex flex-col gap-2 w-[60%]">
                <h1 className="text-xl font-outfit font-semibold line-clamp-1">
                  <Link
                    href={`/en/anime/${info.id}`}
                    className="hover:underline"
                    title={navigation?.playing?.title || info.title?.romaji}
                  >
                    {navigation?.playing?.title || info.title?.romaji}
                  </Link>
                </h1>
                <h3 className="text-sm font-karla font-light">
                  Episode {epiNumber}
                </h3>
              </div>
              <div className="flex gap-4 items-center justify-end">
                <div className="relative">
                  <select
                    className="flex items-center gap-5 rounded-[3px] bg-secondary py-1 px-3 pr-8 font-karla appearance-none cursor-pointer"
                    value={epiNumber}
                    onChange={(e) => {
                      const selectedEpisode = episodeList.find(
                        (episode) => episode.number === parseInt(e.target.value)
                      );
                      router.push(
                        `/en/anime/watch/${info.id}/${providerId}?id=${
                          selectedEpisode.id
                        }&num=${selectedEpisode.number}${
                          dub ? `&dub=${dub}` : ""
                        }`
                      );
                    }}
                  >
                    {episodeList.map((episode) => (
                      <option key={episode.number} value={episode.number}>
                        Episode {episode.number}
                      </option>
                    ))}
                  </select>
                  <ChevronDownIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 w-5 h-5 pointer-events-none" />
                </div>
                <button
                  disabled={!navigation?.next}
                  className={`${
                    !navigation?.next ? "pointer-events-none" : ""
                  }relative group`}
                  onClick={() => {
                    router.push(
                      `/en/anime/watch/${info.id}/${providerId}?id=${
                        navigation?.next.id
                      }&num=${navigation?.next.number}${
                        dub ? `&dub=${dub}` : ""
                      }`
                    );
                  }}
                >
                  <span className="absolute z-[9999] -left-11 -top-14 p-2 shadow-xl rounded-md transform transition-all whitespace-nowrap bg-secondary lg:group-hover:block group-hover:opacity-1 hidden font-karla font-bold">
                    Next Episode
                  </span>
                  <ForwardIcon
                    className={`w-6 h-6 ${
                      !navigation?.next ? "text-[#282828]" : ""
                    }`}
                  />
                </button>
              </div>
            </div>
          ) : (
            <div className="py-3 px-4">
              <div className="text-xl font-outfit font-semibold line-clamp-2">
                <div className="inline hover:underline">
                  <Skeleton width={240} />
                </div>
              </div>
              <h4 className="text-sm font-karla font-light">
                <Skeleton width={75} />
              </h4>
            </div>
          )}
          <Details
            info={info}
            session={session}
            description={navigation?.playing?.description || info?.description}
            epiNumber={epiNumber}
            id={watchId}
            onList={onList}
            setOnList={setOnList}
            handleOpen={handleOpen}
            disqus={disqus}
          />
        </div>
      </div>
    </>
  );
}
