import Player from "../lib/Artplayer";
import { useEffect, useState } from "react";
import { useAniList } from "../lib/anilist/useAnilist";
import artplayerPluginHlsQuality from "artplayer-plugin-hls-quality";

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

export default function VideoPlayer({
  data,
  id,
  progress,
  session,
  aniId,
  stats,
  skip,
  title,
  poster,
  proxy,
  provider,
}) {
  const [url, setUrl] = useState("");
  const [source, setSource] = useState([]);
  const { markProgress } = useAniList(session);

  const [resolution, setResolution] = useState("auto");
  const [subSize, setSubSize] = useState({ size: "16px", html: "Small" });
  const [defSize, setDefSize] = useState();
  const [subtitle, setSubtitle] = useState();
  const [defSub, setDefSub] = useState();

  useEffect(() => {
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
        const referer = data?.headers?.Referer;
        const source = data.sources.map((items) => {
          const isDefault =
            provider !== "gogoanime"
              ? items.quality === "default" || items.quality === "auto"
              : resolution === "auto"
              ? items.quality === "default" || items.quality === "auto"
              : items.quality === resolution;
          return {
            ...(isDefault && { default: true }),
            html: items.quality === "default" ? "adaptive" : items.quality,
            url:
              provider === "gogoanime"
                ? `https://cors.moopa.workers.dev/?url=${encodeURIComponent(
                    items.url
                  )}${referer ? `&referer=${encodeURIComponent(referer)}` : ""}`
                : `${proxy}${items.url}`,
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

        setSource(source);
      } catch (error) {
        console.error(error);
      }
    }
    compiler();
  }, [data, resolution]);

  return (
    <>
      {url && (
        <Player
          key={url}
          option={{
            url: `${url}`,
            title: `${title}`,
            autoplay: true,
            screenshot: true,
            moreVideoAttr: {
              crossOrigin: "anonymous",
            },
            poster: poster ? poster : "",
            ...(provider !== "gogoanime" && {
              plugins: [
                artplayerPluginHlsQuality({
                  // Show quality in control
                  // control: true,

                  // Show quality in setting
                  setting: true,

                  // Get the resolution text from level
                  getResolution: (level) => level.height + "P",

                  // I18n
                  title: "Quality",
                  auto: "Auto",
                }),
              ],
            }),
            ...(provider === "zoro" && {
              subtitle: {
                url: `${defSub}`,
                // type: "vtt",
                encoding: "utf-8",
                default: true,
                name: "English",
                escape: false,
                style: {
                  color: "#FFFF",
                  fontSize: `${defSize?.size}`,
                  fontFamily: localStorage.getItem("font")
                    ? localStorage.getItem("font")
                    : "Arial",
                  textShadow: localStorage.getItem("subShadow")
                    ? JSON.parse(localStorage.getItem("subShadow")).value
                    : "0px 0px 10px #000000",
                },
              },
            }),
          }}
          res={resolution}
          quality={source}
          subSize={subSize}
          subtitles={subtitle}
          provider={provider}
          style={{
            width: "100%",
            height: "100%",
            margin: "0 auto 0",
          }}
          getInstance={(art) => {
            art.on("ready", () => {
              // console.log(art.storage.settings);
              const seek = art.storage.get(id);
              const seekTime = seek?.time || 0;
              const duration = art.duration;
              const percentage = seekTime / duration;

              if (subSize) {
                art.subtitle.style.fontSize = subSize?.size;
              }

              if (percentage >= 0.9) {
                art.currentTime = 0;
                console.log("Video started from the beginning");
              } else {
                art.currentTime = seekTime;
              }
            });

            let marked = 0;
            
            art.on("video:timeupdate", () => {
              if (!session) return;
              const mediaSession = navigator.mediaSession;
              const currentTime = art.currentTime;
              const duration = art.duration;
              const percentage = currentTime / duration;

              mediaSession.setPositionState({
                duration: art.duration,
                playbackRate: art.playbackRate,
                position: art.currentTime,
              });

              if (percentage >= 0.9) {
                // use >= instead of >
                if (marked < 1) {
                  marked = 1;
                  markProgress(aniId, progress, stats);
                  // console.log("Video progress marked");
                }
              }
            });

            art.on("video:timeupdate", () => {
              var currentTime = art.currentTime;
              // console.log(art.currentTime);
              art.storage.set(id, {
                time: art.currentTime,
                duration: art.duration,
              });

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
          }}
        />
      )}
    </>
  );
}
