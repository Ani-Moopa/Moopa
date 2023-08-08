import { useEffect, useRef } from "react";
import Artplayer from "artplayer";
import Hls from "hls.js";
import { useRouter } from "next/router";

export default function Player({
  option,
  res,
  quality,
  subSize,
  subtitles,
  provider,
  getInstance,
  id,
  track,
  // socket
  socket,
  isPlay,
  watchdata,
  room,
  autoplay,
  setautoplay,
  ...rest
}) {
  const artRef = useRef();

  const router = useRouter();

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
      playbackRate: true,
      autoOrientation: true,
      pip: true,
      theme: "#f97316",
      controls: [
        {
          name: "fast-rewind",
          position: "right",
          html: '<svg class="hi-solid hi-rewind inline-block w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M8.445 14.832A1 1 0 0010 14v-2.798l5.445 3.63A1 1 0 0017 14V6a1 1 0 00-1.555-.832L10 8.798V6a1 1 0 00-1.555-.832l-6 4a1 1 0 000 1.664l6 4z"/></svg>',
          tooltip: "Backward 5s",
          click: function () {
            art.backward = 5;
          },
        },
        {
          name: "fast-forward",
          position: "right",
          html: '<svg class="hi-solid hi-fast-forward inline-block w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M4.555 5.168A1 1 0 003 6v8a1 1 0 001.555.832L10 11.202V14a1 1 0 001.555.832l6-4a1 1 0 000-1.664l-6-4A1 1 0 0010 6v2.798l-5.445-3.63z"/></svg>',
          tooltip: "Forward 5s",
          click: function () {
            art.forward = 5;
          },
        },
      ],
      settings: [
        {
          html: "Autoplay",
          // icon: '<img width="22" heigth="22" src="/assets/img/state.svg">',
          tooltip: "ON/OFF",
          switch: localStorage.getItem("autoplay") === "true" ? true : false,
          onSwitch: function (item) {
            setautoplay(!item.switch);
            localStorage.setItem("autoplay", !item.switch);
            return !item.switch;
          },
        },
        provider === "zoro" && {
          html: "Subtitles",
          icon: '<svg xmlns="http://www.w3.org/2000/svg" width="35" height="28" viewBox="0 -960 960 960"><path d="M240-350h360v-60H240v60zm420 0h60v-60h-60v60zM240-470h60v-60h-60v60zm120 0h360v-60H360v60zM140-160q-24 0-42-18t-18-42v-520q0-24 18-42t42-18h680q24 0 42 18t18 42v520q0 24-18 42t-42 18H140zm0-60h680v-520H140v520zm0 0v-520 520z"></path></svg>',
          width: 300,
          tooltip: "Settings",
          selector: [
            {
              html: "Display",
              icon: '<svg xmlns="http://www.w3.org/2000/svg" width="35" height="26" viewBox="0 -960 960 960"><path d="M480.169-341.796q65.754 0 111.894-46.31 46.141-46.309 46.141-112.063t-46.31-111.894q-46.309-46.141-112.063-46.141t-111.894 46.31q-46.141 46.309-46.141 112.063t46.31 111.894q46.309 46.141 112.063 46.141zm-.371-48.307q-45.875 0-77.785-32.112-31.91-32.112-31.91-77.987 0-45.875 32.112-77.785 32.112-31.91 77.987-31.91 45.875 0 77.785 32.112 31.91 32.112 31.91 77.987 0 45.875-32.112 77.785-32.112 31.91-77.987 31.91zm.226 170.102q-130.921 0-239.6-69.821-108.679-69.82-167.556-186.476-2.687-4.574-3.892-10.811Q67.77-493.347 67.77-500t1.205-12.891q1.205-6.237 3.892-10.811Q131.745-640.358 240.4-710.178q108.655-69.821 239.576-69.821t239.6 69.821q108.679 69.82 167.556 186.476 2.687 4.574 3.892 10.811 1.205 6.238 1.205 12.891t-1.205 12.891q-1.205 6.237-3.892 10.811Q828.255-359.642 719.6-289.822q-108.655 69.821-239.576 69.821zM480-500zm-.112 229.744q117.163 0 215.048-62.347Q792.821-394.949 844.308-500q-51.487-105.051-149.26-167.397-97.772-62.347-214.936-62.347-117.163 0-215.048 62.347Q167.179-605.051 115.282-500q51.897 105.051 149.67 167.397 97.772 62.347 214.936 62.347z"></path></svg>',
              tooltip: "Show",
              switch: true,
              onSwitch: function (item) {
                item.tooltip = item.switch ? "Hide" : "Show";
                art.subtitle.show = !item.switch;
                return !item.switch;
              },
            },
            {
              html: "Font Size",
              icon: '<svg xmlns="http://www.w3.org/2000/svg" width="35" height="26" viewBox="0 -960 960 960"><path d="M619.861-177.694q-15.655 0-26.475-10.918-10.821-10.918-10.821-26.516v-492.309H415.128q-15.598 0-26.516-10.959-10.918-10.959-10.918-26.615 0-15.655 10.918-26.475 10.918-10.82 26.516-10.82h409.744q15.598 0 26.516 10.958 10.918 10.959 10.918 26.615 0 15.656-10.918 26.476-10.918 10.82-26.516 10.82H657.435v492.309q0 15.598-10.959 26.516-10.959 10.918-26.615 10.918zm-360 0q-15.655 0-26.475-10.918-10.821-10.918-10.821-26.516v-292.309h-87.437q-15.598 0-26.516-10.959-10.918-10.959-10.918-26.615 0-15.655 10.918-26.475 10.918-10.82 26.516-10.82h249.744q15.598 0 26.516 10.958 10.918 10.959 10.918 26.615 0 15.656-10.918 26.476-10.918 10.82-26.516 10.82h-87.437v292.309q0 15.598-10.959 26.516-10.959 10.918-26.615 10.918z"></path></svg>',
              selector: subSize,
              onSelect: function (item) {
                if (item.html === "Small") {
                  art.subtitle.style({ fontSize: "16px" });
                  localStorage.setItem(
                    "subSize",
                    JSON.stringify({
                      size: "16px",
                      html: "Small",
                    })
                  );
                } else if (item.html === "Medium") {
                  art.subtitle.style({ fontSize: "36px" });
                  localStorage.setItem(
                    "subSize",
                    JSON.stringify({
                      size: "36px",
                      html: "Medium",
                    })
                  );
                } else if (item.html === "Large") {
                  art.subtitle.style({ fontSize: "56px" });
                  localStorage.setItem(
                    "subSize",
                    JSON.stringify({
                      size: "56px",
                      html: "Large",
                    })
                  );
                }
              },
            },
            {
              html: "Language",
              icon: '<svg xmlns="http://www.w3.org/2000/svg" width="35" height="26" viewBox="0 -960 960 960"><path d="M528.282-110.771q-21.744 0-31.308-14.013t-2.205-34.295l135.952-359.307q5.304-14.793 20.292-25.126 14.988-10.334 31.152-10.334 15.398 0 30.85 10.388 15.451 10.387 20.932 25.125l137.128 357.485q8.025 20.949-1.83 35.513-9.855 14.564-33.24 14.564-10.366 0-19.392-6.616-9.025-6.615-12.72-16.242l-30.997-91.808H594.769l-33.381 91.869q-3.645 9.181-13.148 15.989-9.504 6.808-19.958 6.808zm87.871-179.281h131.64l-64.615-180.717h-2.41l-64.615 180.717zM302.104-608.384q14.406 25.624 31.074 48.184 16.669 22.559 37.643 47.021 41.333-44.128 68.628-90.461t46.038-97.897H111.499q-15.674 0-26.278-10.615-10.603-10.616-10.603-26.308t10.615-26.307q10.616-10.616 26.308-10.616h221.537v-36.923q0-15.692 10.615-26.307 10.616-10.616 26.308-10.616t26.307 10.616q10.616 10.615 10.616 26.307v36.923h221.537q15.692 0 26.307 10.616 10.616 10.615 10.616 26.307 0 15.692-10.616 26.308-10.615 10.615-26.307 10.615h-69.088q-19.912 64.153-53.237 125.74-33.325 61.588-82.341 116.412l89.384 90.974-27.692 75.179-115.486-112.922-158.948 158.947q-10.615 10.616-25.667 10.616-15.051 0-25.666-11.026-11.026-10.615-11.026-25.666 0-15.052 11.026-26.077l161.614-161.358q-24.666-28.308-45.551-57.307-20.884-29-37.756-60.103-10.641-19.871-1.346-34.717t33.038-14.846q9.088 0 18.429 5.73 9.34 5.731 13.956 13.577z"></path></svg>',
              tooltip: "English",
              selector: [...subtitles],
              onSelect: function (item) {
                art.subtitle.switch(item.url, {
                  name: item.html,
                });
                return item.html;
              },
            },
            {
              html: "Font Family",
              tooltip: localStorage.getItem("font")
                ? localStorage.getItem("font")
                : "Arial",
              selector: [
                { html: "Arial" },
                { html: "Comic Sans MS" },
                { html: "Verdana" },
                { html: "Tahoma" },
                { html: "Trebuchet MS" },
                { html: "Times New Roman" },
                { html: "Georgia" },
                { html: "Impact " },
                { html: "Andalé Mono" },
                { html: "Palatino" },
                { html: "Baskerville" },
                { html: "Garamond" },
                { html: "Courier New" },
                { html: "Brush Script MT" },
              ],
              onSelect: function (item) {
                art.subtitle.style({ fontFamily: item.html });
                localStorage.setItem("font", item.html);
                return item.html;
              },
            },
            {
              html: "Font Shadow",
              tooltip: localStorage.getItem("subShadow")
                ? JSON.parse(localStorage.getItem("subShadow")).shadow
                : "Default",
              selector: [
                { html: "None", value: "none" },
                {
                  html: "Uniform",
                  value:
                    "2px 2px 0px  #000, -2px -2px 0px  #000, 2px -2px 0px  #000, -2px 2px 0px  #000",
                },
                { html: "Raised", value: "-1px 2px 3px rgba(0, 0, 0, 1)" },
                { html: "Depressed", value: "-2px -3px 3px rgba(0, 0, 0, 1)" },
                { html: "Glow", value: "0 0 10px rgba(0, 0, 0, 0.8)" },
                {
                  html: "Block",
                  value:
                    "-3px 3px 4px rgba(0, 0, 0, 1),2px 2px 4px rgba(0, 0, 0, 1),1px -1px 3px rgba(0, 0, 0, 1),-3px -2px 4px rgba(0, 0, 0, 1)",
                },
              ],
              onSelect: function (item) {
                art.subtitle.style({ textShadow: item.value });
                localStorage.setItem(
                  "subShadow",
                  JSON.stringify({ shadow: item.html, value: item.value })
                );
                return item.html;
              },
            },
          ],
        },
        provider === "gogoanime" && {
          html: "Quality",
          width: 150,
          tooltip: `${res}`,
          selector: quality,
          onSelect: function (item) {
            art.switchQuality(item.url, item.html);
            localStorage.setItem("quality", item.html);
            return item.html;
          },
        },
      ].filter(Boolean),
    });

    if ("mediaSession" in navigator) {
      art.on("video:timeupdate", () => {
        const session = navigator.mediaSession;
        if (!session) return;
        session.setPositionState({
          duration: art.duration,
          playbackRate: art.playbackRate,
          position: art.currentTime,
        });
      });

      navigator.mediaSession.setActionHandler("play", () => {
        art.play();
      });

      navigator.mediaSession.setActionHandler("pause", () => {
        art.pause();
      });

      navigator.mediaSession.setActionHandler("previoustrack", () => {
        if (track?.prev) {
          router.push(
            `/en/anime/watch/${id}/${provider}?id=${encodeURIComponent(
              track?.prev?.id
            )}&num=${track?.prev?.number}`
          );
        }
      });

      navigator.mediaSession.setActionHandler("nexttrack", () => {
        if (track?.next) {
          router.push(
            `/en/anime/watch/${id}/${provider}?id=${encodeURIComponent(
              track?.next?.id
            )}&num=${track?.next?.number}`
          );
        }
      });
    }

    art.events.proxy(document, "keydown", (event) => {
      if (event.key === "f" || event.key === "F") {
        art.fullscreen = !art.fullscreen;
      }
    });

    // artInstanceRef.current = art;

    // art.on("video:pause", handleVideoPause);
    // art.on("video:play", handleVideoPlay);

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
