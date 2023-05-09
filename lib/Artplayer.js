import { useEffect, useRef } from "react";
import Artplayer from "artplayer";
import Hls from "hls.js";

export default function Player({ option, getInstance, ...rest }) {
  const artRef = useRef();
  function playM3u8(video, url, art) {
    if (Hls.isSupported()) {
      if (art.hls) art.hls.destroy();
      const hls = new Hls();
      hls.loadSource(url);
      hls.attachMedia(video);
      art.hls = hls;
      art.on("destroy", () => hls.destroy());
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
      type: "m3u8",
      customType: {
        m3u8: playM3u8,
      },
      fullscreen: true,
      hotkey: true,
      lock: true,
      setting: true,
      flip: true,
      playbackRate: true,
      aspectRatio: true,
      autoOrientation: true,
      pip: true,
      theme: "#f97316",
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
