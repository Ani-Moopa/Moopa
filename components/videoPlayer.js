import Player from "../lib/Artplayer";
import { useEffect, useState } from "react";
import { useAniList } from "../lib/useAnilist";

export default function VideoPlayer({
  data,
  id,
  progress,
  session,
  aniId,
  stats,
  op,
  ed,
}) {
  const [url, setUrl] = useState();
  const [source, setSource] = useState([]);
  const [loading, setLoading] = useState(true);
  const { markProgress } = useAniList(session);

  useEffect(() => {
    async function compiler() {
      try {
        const dataEpi = data.sources;
        const referer = data.headers.Referer;
        let sumber = dataEpi.find((source) => source.quality === "default");

        const source = data.sources
          .map((items) => ({
            html: items.quality,
            url: `https://cors.moopa.my.id/?url=${encodeURIComponent(
              items.url
            )}&referer=${encodeURIComponent(referer)}`,
          }))
          .sort((a, b) => {
            if (a.html === "default") return -1;
            if (b.html === "default") return 1;
            return 0;
          });

        const defUrl = `https://cors.moopa.my.id/?url=${encodeURIComponent(
          sumber.url
        )}&referer=${encodeURIComponent(referer)}`;

        setUrl(defUrl);
        setSource(source);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    }
    compiler();
  }, [data]);

  // console.log(skip);

  return (
    <>
      {loading ? (
        ""
      ) : (
        <Player
          option={{
            url: `${url}`,
            quality: [source],
            autoplay: true,
            screenshot: true,
          }}
          style={{ width: "100%", height: "100%", margin: "0 auto 0" }}
          getInstance={(art) => {
            art.on("ready", () => {
              const seek = art.storage.get(id);
              const seekTime = seek?.time || 0;
              const duration = art.duration;
              const percentage = seekTime / duration;

              if (percentage >= 0.9) {
                // use >= instead of >
                art.currentTime = 0;
                console.log("Video started from the beginning");
              } else {
                art.currentTime = seekTime;
              }
            });

            art.on("video:timeupdate", () => {
              if (!session) return;
              const currentTime = art.currentTime;
              const duration = art.duration;
              const percentage = currentTime / duration;

              // console.log(percentage);

              if (percentage >= 0.9) {
                // use >= instead of >
                markProgress(aniId, progress, stats);
                art.off("video:timeupdate");
                console.log("Video progress marked");
              }
            });

            art.on("video:timeupdate", function () {
              var currentTime = art.currentTime;

              if (
                op &&
                currentTime >= op.interval.startTime &&
                currentTime <= op.interval.endTime
              ) {
                // Add the layer if it's not already added
                if (!art.layers.op) {
                  art.layers.add({
                    name: "op",
                    html: `<button style="background-color: #fff; color: black; padding: 10px 25px; border: none; border-radius: 4px; cursor: pointer; box-shadow: 2px 2px 5px rgba(0,0,0,0.2); font-family: Karla, sans-serif; font-size: 16px; text-align: center;">Skip Opening</button>`,
                    tooltip: "Skip",
                    style: {
                      position: "absolute",
                      bottom: "68px",
                      right: "60px",
                    },
                    click: function (...args) {
                      art.seek = op.interval.endTime;
                    },
                  });
                }
                // Show the layer
                art.layers.show = true;
                if (art.layers.ed) {
                  art.layers.ed.style.display = "none";
                }
              } else if (
                ed &&
                currentTime >= ed.interval.startTime &&
                currentTime <= ed.interval.endTime
              ) {
                // Add the layer if it's not already added
                if (!art.layers.ed) {
                  art.layers.add({
                    name: "ed",
                    html: `<button style="background-color: #fff; color: black; padding: 10px 25px; border: none; border-radius: 4px; cursor: pointer; box-shadow: 2px 2px 5px rgba(0,0,0,0.2); font-family: Karla, sans-serif; font-size: 16px; text-align: center;">Skip Ending</button>`,
                    tooltip: "Skip",
                    style: {
                      position: "absolute",
                      bottom: "68px",
                      right: "60px",
                    },
                    click: function (...args) {
                      art.seek = ed.interval.endTime;
                    },
                  });
                }
                // Show the layer
                art.layers.show = true;
                if (art.layers.op) {
                  art.layers.op.style.display = "none";
                }
              } else {
                art.layers.show = false;
              }
            });

            art.on("destroy", async () => {
              art.storage.set(id, { time: art.currentTime });
            });
          }}
        />
      )}
    </>
  );
}
