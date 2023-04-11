import Player from "../lib/Artplayer";
import { useEffect, useState } from "react";

export default function VideoPlayer({ data, seek, titles, id }) {
  const [url, setUrl] = useState();
  const [source, setSource] = useState([]);
  const [loading, setLoading] = useState(true);

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
              const lastPlayed = {
                id: id,
                time: art.currentTime,
              };

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
