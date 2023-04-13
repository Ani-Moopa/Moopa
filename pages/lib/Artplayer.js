import { useEffect, useRef } from "react";
import Artplayer from "artplayer";
import Hls from "hls.js";

export default function Player({ option, getInstance, ...rest }) {
  const artRef = useRef();
  function playM3u8(video, url, art) {
    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(url);
      hls.attachMedia(video);

      // optional
      art.hls = hls;
      art.once("url", () => hls.destroy());
      art.once("destroy", () => hls.destroy());
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = url;
    } else {
      art.notice.show = "Unsupported playback format: m3u8";
    }
  }

  useEffect(() => {
    const art = new Artplayer({
      ...option,
      container: artRef.current,
      customType: {
        m3u8: playM3u8,
      },
      fullscreen: true,
      fullscreenWeb: true,
      hotkey: true,
      lock: true,
      autoOrientation: true,
      theme: "#f97316",
      icons: {
        state: "</>",
      },
    });

    if (getInstance && typeof getInstance === "function") {
      getInstance(art);
    }

    return () => {
      if (art && art.destroy) {
        art.destroy(false);
      }
    };
  }, []);

  return <div ref={artRef} {...rest}></div>;
}
