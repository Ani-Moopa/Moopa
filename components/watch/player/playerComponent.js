import React, { useEffect, useState } from "react";
import NewPlayer from "./artplayer";
import { icons } from "./component/overlay";
import { useWatchProvider } from "../../../lib/hooks/watchPageProvider";
import { useRouter } from "next/router";
import { useAniList } from "../../../lib/anilist/useAnilist";

export function calculateAspectRatio(width, height) {
  const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
  const divisor = gcd(width, height);
  const aspectRatio = `${width / divisor}/${height / divisor}`;
  return aspectRatio;
}

const fontSize = [
  {
    html: "Small",
    size: "16px",
  },
  {
    html: "Medium",
    size: "36px",
  },
  {
    html: "Large",
    size: "56px",
  },
];

export default function PlayerComponent({
  playerRef,
  session,
  id,
  info,
  watchId,
  proxy,
  dub,
  timeWatched,
  skip,
  track,
  data,
  provider,
  className,
}) {
  const {
    aspectRatio,
    setAspectRatio,
    playerState,
    setPlayerState,
    autoplay,
    marked,
    setMarked,
  } = useWatchProvider();

  const router = useRouter();

  const { markProgress } = useAniList(session);

  const [url, setUrl] = useState("");
  const [resolution, setResolution] = useState("auto");
  const [source, setSource] = useState([]);
  const [subSize, setSubSize] = useState({ size: "16px", html: "Small" });
  const [defSize, setDefSize] = useState();
  const [subtitle, setSubtitle] = useState();
  const [defSub, setDefSub] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    const resol = localStorage.getItem("quality");
    const sub = JSON.parse(localStorage.getItem("subSize"));
    if (resol) {
      setResolution(resol);
    }

    if (provider === "zoro") {
      const size = fontSize.map((i) => {
        const isDefault = !sub ? i.html === "Small" : i.html === sub?.html;
        return {
          ...(isDefault && { default: true }),
          html: i.html,
          size: i.size,
        };
      });

      const defSize = size?.find((i) => i?.default === true);
      setDefSize(defSize);
      setSubSize(size);
    }

    async function compiler() {
      try {
        const referer = JSON.stringify(data?.headers);
        const source = data?.sources?.map((items) => {
          const isDefault =
            provider !== "gogoanime"
              ? items.quality === "default" || items.quality === "auto"
              : resolution === "auto"
              ? items.quality === "default" || items.quality === "auto"
              : items.quality === resolution;
          return {
            ...(isDefault && { default: true }),
            html: items.quality === "default" ? "main" : items.quality,
            url: `${proxy}/proxy/m3u8/${encodeURIComponent(
              String(items.url)
            )}/${encodeURIComponent(String(referer))}`,
          };
        });

        const defSource = source?.find((i) => i?.default === true);

        if (defSource) {
          setUrl(defSource.url);
        }

        if (provider === "zoro") {
          const subtitle = data?.subtitles
            .filter((subtitle) => subtitle.lang !== "Thumbnails")
            .map((subtitle) => {
              const isEnglish = subtitle.lang === "English";
              return {
                ...(isEnglish && { default: true }),
                url: subtitle.url,
                html: `${subtitle.lang}`,
              };
            });

          const defSub = data?.subtitles.find((i) => i.lang === "English");

          setDefSub(defSub?.url);

          setSubtitle(subtitle);
        }

        const alt = source?.filter(
          (i) =>
            i?.html !== "main" &&
            i?.html !== "auto" &&
            i?.html !== "default" &&
            i?.html !== "backup"
        );
        const server = source?.filter(
          (i) =>
            i?.html === "main" ||
            i?.html === "auto" ||
            i?.html === "default" ||
            i?.html === "backup"
        );

        setSource({ alt, server });
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    }
    compiler();

    return () => {
      setUrl("");
      setSource([]);
      setSubtitle([]);
      setLoading(true);
    };
  }, [provider, data]);

  /**
   * @param {import("artplayer")} art
   */
  function getInstance(art) {
    art.on("ready", () => {
      const autoplay = localStorage.getItem("autoplay_video") || false;

      if (autoplay === "true" || autoplay === true) {
        if (playerState.currentTime === 0) {
          art.play();
        } else {
          if (playerState.isPlaying) {
            art.play();
          } else {
            art.pause();
          }
        }
      } else {
        if (playerState.isPlaying) {
          art.play();
        } else {
          art.pause();
        }
      }
      art.seek = playerState.currentTime;
    });

    art.on("ready", () => {
      if (playerState.currentTime !== 0) return;
      const seek = art.storage.get(id);
      const seekTime = seek?.timeWatched || 0;
      const duration = art.duration;
      const percentage = seekTime / duration;
      const percentagedb = timeWatched / duration;

      if (subSize) {
        art.subtitle.style.fontSize = subSize?.size;
      }

      if (percentage >= 0.9 || percentagedb >= 0.9) {
        art.currentTime = 0;
        console.log("Video started from the beginning");
      } else if (timeWatched) {
        art.currentTime = timeWatched;
      } else {
        art.currentTime = seekTime;
      }
    });

    art.on("error", (error, reconnectTime) => {
      if (error && reconnectTime >= 5) {
        setError(true);
        console.error("Error while loading video:", error);
      }
    });

    art.on("play", () => {
      art.notice.show = "";
      setPlayerState({ ...playerState, isPlaying: true });
    });
    art.on("pause", () => {
      art.notice.show = "";
      setPlayerState({ ...playerState, isPlaying: false });
    });

    art.on("resize", () => {
      art.subtitle.style({
        fontSize: art.height * 0.05 + "px",
      });
    });

    let mark = 0;

    art.on("video:timeupdate", async () => {
      if (!session) return;

      var currentTime = art.currentTime;
      const duration = art.duration;
      const percentage = currentTime / duration;

      if (percentage >= 0.9) {
        // use >= instead of >
        if (mark < 1 && marked < 1) {
          mark = 1;
          setMarked(1);
          markProgress(info.id, track.playing.number);
        }
      }
    });

    art.on("video:playing", () => {
      if (!session) return;
      const intervalId = setInterval(async () => {
        await fetch("/api/user/update/episode", {
          method: "PUT",
          body: JSON.stringify({
            name: session?.user?.name,
            id: String(info?.id),
            watchId: watchId,
            title:
              track.playing?.title || info.title?.romaji || info.title?.english,
            aniTitle: info.title?.romaji || info.title?.english,
            image: track.playing?.img || info?.coverImage?.extraLarge,
            number: Number(track.playing?.number),
            duration: art.duration,
            timeWatched: art.currentTime,
            provider: provider,
            nextId: track.next?.id,
            nextNumber: Number(track.next?.number),
            dub: dub ? true : false,
          }),
        });
        // console.log("updating db", { track });
      }, 5000);

      art.on("video:pause", () => {
        clearInterval(intervalId);
      });

      art.on("video:ended", () => {
        clearInterval(intervalId);
      });

      art.on("destroy", () => {
        clearInterval(intervalId);
        // console.log("clearing interval");
      });
    });

    art.on("video:playing", () => {
      const interval = setInterval(async () => {
        art.storage.set(watchId, {
          aniId: String(info.id),
          watchId: watchId,
          title:
            track.playing?.title || info.title?.romaji || info.title?.english,
          aniTitle: info.title?.romaji || info.title?.english,
          image: track?.playing?.img || info?.coverImage?.extraLarge,
          episode: Number(track.playing?.number),
          duration: art.duration,
          timeWatched: art.currentTime,
          provider: provider,
          nextId: track?.next?.id,
          nextNumber: track?.next?.number,
          dub: dub ? true : false,
          createdAt: new Date().toISOString(),
        });
      }, 5000);

      art.on("video:pause", () => {
        clearInterval(interval);
      });

      art.on("video:ended", () => {
        clearInterval(interval);
      });

      art.on("destroy", () => {
        clearInterval(interval);
      });
    });

    art.on("video:loadedmetadata", () => {
      // get raw video width and height
      // console.log(art.video.videoWidth, art.video.videoHeight);
      const aspect = calculateAspectRatio(
        art.video.videoWidth,
        art.video.videoHeight
      );

      setAspectRatio(aspect);
    });

    art.on("video:timeupdate", () => {
      var currentTime = art.currentTime;
      // console.log(art.currentTime);

      if (
        skip?.op &&
        currentTime >= skip.op.interval.startTime &&
        currentTime <= skip.op.interval.endTime
      ) {
        // Add the layer if it's not already added
        if (!art.controls["op"]) {
          // Remove the other control if it's already added
          if (art.controls["ed"]) {
            art.controls.remove("ed");
          }

          // Add the control
          art.controls.add({
            name: "op",
            position: "top",
            html: '<button class="skip-button">Skip Opening</button>',
            click: function (...args) {
              art.seek = skip.op.interval.endTime;
            },
          });
        }
      } else if (
        skip?.ed &&
        currentTime >= skip.ed.interval.startTime &&
        currentTime <= skip.ed.interval.endTime
      ) {
        // Add the layer if it's not already added
        if (!art.controls["ed"]) {
          // Remove the other control if it's already added
          if (art.controls["op"]) {
            art.controls.remove("op");
          }

          // Add the control
          art.controls.add({
            name: "ed",
            position: "top",
            html: '<button class="skip-button">Skip Ending</button>',
            click: function (...args) {
              art.seek = skip.ed.interval.endTime;
            },
          });
        }
      } else {
        // Remove the controls if they're added
        if (art.controls["op"]) {
          art.controls.remove("op");
        }
        if (art.controls["ed"]) {
          art.controls.remove("ed");
        }
      }
    });

    art.on("video:ended", () => {
      if (!track?.next) return;
      if (localStorage.getItem("autoplay") === "true") {
        art.controls.add({
          name: "next-button",
          position: "top",
          html: '<div class="vid-con"><button class="next-button progress">Play Next</button></div>',
          click: function (...args) {
            if (track?.next) {
              router.push(
                `/en/anime/watch/${
                  info?.id
                }/${provider}?id=${encodeURIComponent(track?.next?.id)}&num=${
                  track?.next?.number
                }${dub ? `&dub=${dub}` : ""}`
              );
            }
          },
        });

        const button = document.querySelector(".next-button");

        function stopTimeout() {
          clearTimeout(timeoutId);
          button.classList.remove("progress");
        }

        let timeoutId = setTimeout(() => {
          art.controls.remove("next-button");
          if (track?.next) {
            router.push(
              `/en/anime/watch/${info?.id}/${provider}?id=${encodeURIComponent(
                track?.next?.id
              )}&num=${track?.next?.number}${dub ? `&dub=${dub}` : ""}`
            );
          }
        }, 7000);

        button.addEventListener("mouseover", stopTimeout);
      }
    });
  }

  /**
   * @type {import("artplayer/types/option").Option}
   */
  const option = {
    url: url,
    autoplay: autoplay ? true : false,
    autoSize: false,
    fullscreen: true,
    autoOrientation: true,
    icons: icons,
    setting: true,
    screenshot: true,
    hotkey: true,
    pip: true,
    fastForward: true,
    airplay: true,
    lock: true,
  };

  return (
    <div
      id={id}
      className={`${className} bg-black`}
      style={{ aspectRatio: aspectRatio }}
    >
      <div className="flex-center w-full h-full">
        {!error ? (
          !loading &&
          track &&
          url && (
            <NewPlayer
              playerRef={playerRef}
              res={resolution}
              quality={source}
              option={option}
              provider={provider}
              defSize={defSize}
              defSub={defSub}
              subSize={subSize}
              subtitles={subtitle}
              getInstance={getInstance}
              style={{
                width: "100%",
                height: "100%",
              }}
            />
          )
        ) : (
          <p className="text-center">
            Something went wrong while loading the video, <br />
            please try from other source
          </p>
        )}
      </div>
    </div>
  );
}
