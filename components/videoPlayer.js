import Player from "../lib/Artplayer";
import { useEffect, useState } from "react";
import { useAniList } from "../lib/useAnilist";

export default function VideoPlayer({
  data,
  seek,
  titles,
  id,
  progress,
  session,
  aniId,
  stats,
}) {
  const [url, setUrl] = useState();
  const [source, setSource] = useState([]);
  const [loading, setLoading] = useState(true);
  const { markProgress } = useAniList(session);

  // console.log(progress);

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
            type: "m3u8",
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
                console.log("Video restarted from the beginning");
              } else {
                art.currentTime = seekTime;
              }
            });

            art.on("destroy", () => {
              const currentTime = art.currentTime;
              const duration = art.duration;
              const percentage = currentTime / duration;

              if (percentage >= 0.9) {
                // use >= instead of >
                markProgress(aniId, progress, stats);
              } else {
                return;
              }
            });

            art.on("video:ended", () => {
              art.destroy();
              console.log("Video ended");
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
