import { useEffect, useRef } from "react";
import Artplayer from "artplayer";
import Hls from "hls.js";
import { useWatchProvider } from "@/lib/context/watchPageProvider";
import artplayerPluginHlsQuality from "artplayer-plugin-hls-quality";

export default function NewPlayer({
  playerRef,
  option,
  getInstance,
  provider,
  track,
  defSub,
  defSize,
  subtitles,
  subSize,
  res,
  quality,
  ...rest
}) {
  const artRef = useRef(null);
  const { setTheaterMode, setPlayerState, setAutoPlay } = useWatchProvider();

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

      plugins: [
        artplayerPluginHlsQuality({
          // Show quality in setting
          setting: true,

          // Get the resolution text from level
          getResolution: (level) => level.height + "P",

          // I18n
          title: "Quality",
          auto: "Auto",
        }),
      ],

      settings: [
        // provider === "gogoanime" &&
        {
          html: "Autoplay Next",
          icon: '<svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24"><path fill="currentColor" d="M4.05 16.975q-.5.35-1.025.05t-.525-.9v-8.25q0-.6.525-.888t1.025.038l6.2 4.15q.45.3.45.825t-.45.825l-6.2 4.15Zm10 0q-.5.35-1.025.05t-.525-.9v-8.25q0-.6.525-.888t1.025.038l6.2 4.15q.45.3.45.825t-.45.825l-6.2 4.15Z"></path></svg>',
          tooltip: "ON/OFF",
          switch: localStorage.getItem("autoplay") === "true" ? true : false,
          onSwitch: function (item) {
            // setPlayNext(!item.switch);
            localStorage.setItem("autoplay", !item.switch);
            return !item.switch;
          },
        },
        {
          html: "Autoplay Video",
          icon: '<svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24"><path fill="currentColor" d="M4.05 16.975q-.5.35-1.025.05t-.525-.9v-8.25q0-.6.525-.888t1.025.038l6.2 4.15q.45.3.45.825t-.45.825l-6.2 4.15Zm10 0q-.5.35-1.025.05t-.525-.9v-8.25q0-.6.525-.888t1.025.038l6.2 4.15q.45.3.45.825t-.45.825l-6.2 4.15Z"></path></svg>',
          // icon: '<svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24"><path fill="currentColor" d="M5.59 7.41L7 6l6 6l-6 6l-1.41-1.41L10.17 12L5.59 7.41m6 0L13 6l6 6l-6 6l-1.41-1.41L16.17 12l-4.58-4.59Z"></path></svg>',
          tooltip: "ON/OFF",
          switch:
            localStorage.getItem("autoplay_video") === "true" ? true : false,
          onSwitch: function (item) {
            setAutoPlay(!item.switch);
            localStorage.setItem("autoplay_video", !item.switch);
            return !item.switch;
          },
        },
        {
          html: "Alternative Quality",
          width: 250,
          tooltip: `${res}`,
          selector: quality?.alt,
          icon: '<svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 512 512"><path fill="currentColor" d="M381.25 112a48 48 0 0 0-90.5 0H48v32h242.75a48 48 0 0 0 90.5 0H464v-32ZM176 208a48.09 48.09 0 0 0-45.25 32H48v32h82.75a48 48 0 0 0 90.5 0H464v-32H221.25A48.09 48.09 0 0 0 176 208Zm160 128a48.09 48.09 0 0 0-45.25 32H48v32h242.75a48 48 0 0 0 90.5 0H464v-32h-82.75A48.09 48.09 0 0 0 336 336Z"></path></svg>',
          onSelect: function (item) {
            art.switchQuality(item.url, item.html);
            localStorage.setItem("quality", item.html);
            return item.html;
          },
        },
        {
          html: "Server",
          width: 250,
          tooltip: `${quality?.server[0].html}`,
          icon: '<svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 32 32"><path fill="currentColor" d="m24.6 24.4l2.6 2.6l-2.6 2.6L26 31l4-4l-4-4zm-2.2 0L19.8 27l2.6 2.6L21 31l-4-4l4-4z"></path><circle cx="11" cy="8" r="1" fill="currentColor"></circle><circle cx="11" cy="16" r="1" fill="currentColor"></circle><circle cx="11" cy="24" r="1" fill="currentColor"></circle><path fill="currentColor" d="M24 3H8c-1.1 0-2 .9-2 2v22c0 1.1.9 2 2 2h7v-2H8v-6h18V5c0-1.1-.9-2-2-2zm0 16H8v-6h16v6zm0-8H8V5h16v6z"></path></svg>',
          selector: quality?.server,
          onSelect: function (item) {
            art.switchQuality(item.url, item.html);
            localStorage.setItem("quality", item.html);
            return item.html;
          },
        },
        provider === "zoro" && {
          html: "Subtitles",
          icon: '<svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24"><path fill="currentColor" d="M4 20q-.825 0-1.413-.588T2 18V6q0-.825.588-1.413T4 4h16q.825 0 1.413.588T22 6v12q0 .825-.588 1.413T20 20H4Zm2-4h8v-2H6v2Zm10 0h2v-2h-2v2ZM6 12h2v-2H6v2Zm4 0h8v-2h-8v2Z"></path></svg>',
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
      ].filter(Boolean),
      controls: [
        {
          name: "theater-button",
          index: 11,
          position: "right",
          tooltip: "Theater (t)",
          html: '<p class="theater"><svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 20 20"><path fill="currentColor" d="M19 3H1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1zm-1 12H2V5h16v10z"></path></svg></p>',
          click: function (...args) {
            setPlayerState((prev) => ({
              ...prev,
              currentTime: art.currentTime,
              isPlaying: art.playing,
            }));
            setTheaterMode((prev) => !prev);
          },
        },
        {
          index: 10,
          name: "fast-rewind",
          position: "left",
          html: '<svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 20 20"><path fill="currentColor" d="M17.959 4.571L10.756 9.52s-.279.201-.279.481s.279.479.279.479l7.203 4.951c.572.38 1.041.099 1.041-.626V5.196c0-.727-.469-1.008-1.041-.625zm-9.076 0L1.68 9.52s-.279.201-.279.481s.279.479.279.479l7.203 4.951c.572.381 1.041.1 1.041-.625v-9.61c0-.727-.469-1.008-1.041-.625z"></path></svg>',
          tooltip: "Backward 5s",
          click: function () {
            art.backward = 5;
          },
        },
        {
          index: 11,
          name: "fast-forward",
          position: "left",
          html: '<svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 20 20"><path fill="currentColor" d="M9.244 9.52L2.041 4.571C1.469 4.188 1 4.469 1 5.196v9.609c0 .725.469 1.006 1.041.625l7.203-4.951s.279-.199.279-.478c0-.28-.279-.481-.279-.481zm9.356.481c0 .279-.279.478-.279.478l-7.203 4.951c-.572.381-1.041.1-1.041-.625V5.196c0-.727.469-1.008 1.041-.625L18.32 9.52s.28.201.28.481z"></path></svg>',
          tooltip: "Forward 5s",
          click: function () {
            art.forward = 5;
          },
        },
      ],
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

    playerRef.current = art;

    art.events.proxy(document, "keydown", (event) => {
      // Check if the focus is on an input field or textarea
      const isInputFocused =
        document.activeElement.tagName === "INPUT" ||
        document.activeElement.tagName === "TEXTAREA";

      if (!isInputFocused) {
        if (event.key === "f" || event.key === "F") {
          art.fullscreen = !art.fullscreen;
        }

        if (event.key === "t" || event.key === "T") {
          setPlayerState((prev) => ({
            ...prev,
            currentTime: art.currentTime,
            isPlaying: art.playing,
          }));
          setTheaterMode((prev) => !prev);
        }
      }
    });

    art.events.proxy(document, "keypress", (event) => {
      // Check if the focus is on an input field or textarea
      const isInputFocused =
        document.activeElement.tagName === "INPUT" ||
        document.activeElement.tagName === "TEXTAREA";

      if (!isInputFocused && event.code === "Space") {
        event.preventDefault();
        art.playing ? art.pause() : art.play();
      }
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
