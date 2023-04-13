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
            // autoplay: true,
            screenshot: true,
            type: "m3u8",
          }}
          style={{ width: "100%", height: "100%", margin: "0 auto 0" }}
          getInstance={(art) => {
            art.on("ready", () => {
              const seekTime = seek;
              const duration = art.duration;
              const percentage = seekTime / duration;

              if (percentage >= 0.9) {
                // use >= instead of >
                art.currentTime = 0;
                console.log("Video restarted from the beginning");
              } else {
                art.currentTime = seek;
              }
            });

            art.on("destroy", () => {
              const currentTime = art.currentTime;
              const duration = art.duration;
              const percentage = currentTime / duration;

              if (percentage >= 0.9) {
                // use >= instead of >
                markProgress(aniId, progress);
              } else {
                return;
              }
            });

            art.on("video:ended", () => {
              art.destroy();
              console.log("Video ended");
            });

            art.on("destroy", async () => {
              if (!session) return;
              const lastPlayed = {
                id: id,
                time: art.currentTime,
              };
              const res = await fetch("/api/watched-episode", {
                method: "POST",
                body: JSON.stringify({
                  username: session?.user.name,
                  id: aniId,
                  newData: lastPlayed,
                }),
                headers: {
                  "Content-Type": "application/json",
                },
              });

              console.log(res.status);

              const title = titles;
              const prevDataStr = localStorage.getItem("lastPlayed") || "[]";
              const prevData = JSON.parse(prevDataStr);
              let titleExists = false;

              prevData.forEach((item) => {
                if (item.title === title) {
                  const foundIndex = item.data.findIndex((e) => e.id === id);
                  if (foundIndex !== -1) {
                    item.data[foundIndex] = lastPlayed;
                  } else {
                    item.data.push(lastPlayed);
                  }
                  titleExists = true;
                }
              });

              if (!titleExists) {
                prevData.push({
                  title: title,
                  data: [lastPlayed],
                });
              }

              localStorage.setItem("lastPlayed", JSON.stringify(prevData));
            });
          }}
        />
      )}
    </>
  );
}
