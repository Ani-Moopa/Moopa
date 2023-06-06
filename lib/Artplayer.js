import { useEffect, useRef } from "react";
import Artplayer from "artplayer";
import Hls from "hls.js";

export default function Player({
  option,
  res,
  quality,
  subSize,
  subtitles,
  provider,
  getInstance,
  ...rest
}) {
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
        provider === "zoro" && {
          html: "Subtitle",
          width: 300,
          tooltip: "English",
          selector: [
            {
              html: "Display",
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
              tooltip: "English",
              selector: [
            ...subtitles,
              ],
              onSelect: function (item) {
                art.subtitle.switch(item.url, {
                  name: item.html,
                });
                return item.html;
              },
            },
            {
              html: "Font Family",
              tooltip: localStorage.getItem("font") ? localStorage.getItem("font") : "Arial",
              selector: [{ html: "Arial"},
              { html: "Comic Sans MS"},
              { html: "Verdana"},
              { html: "Tahoma"},
              { html: "Trebuchet MS"},
              { html: "Times New Roman",},
              { html: "Georgia"},
              { html: "Impact "},
              { html: "Andalé Mono"},
              { html: "Palatino"},
              { html: "Baskerville"},
              { html: "Garamond"},
              { html: "Courier New"},
              { html: "Brush Script MT"}],
              onSelect: function (item) {
                art.subtitle.style({ fontFamily: item.html });
                localStorage.setItem("font", item.html);
                return item.html;
              }
            },
            {
              html: "Font Shadow",
              tooltip: localStorage.getItem("subShadow") ? JSON.parse(localStorage.getItem("subShadow")).shadow : "Default",
              selector: [
                { html: 'None', value: 'none' },
                { html: 'Uniform', value: '2px 2px 0px  #000, -2px -2px 0px  #000, 2px -2px 0px  #000, -2px 2px 0px  #000' },
                { html: 'Raised', value: '-1px 2px 3px rgba(0, 0, 0, 1)' },
                { html: 'Depressed', value: '-2px -3px 3px rgba(0, 0, 0, 1)' },
                { html: 'Glow', value: '0 0 10px rgba(0, 0, 0, 0.8)' },
                { html: 'Block', value: '-3px 3px 4px rgba(0, 0, 0, 1),2px 2px 4px rgba(0, 0, 0, 1),1px -1px 3px rgba(0, 0, 0, 1),-3px -2px 4px rgba(0, 0, 0, 1)' }
              ],
              onSelect: function (item) {
                art.subtitle.style({ textShadow: item.value });
                localStorage.setItem("subShadow", JSON.stringify({shadow:item.html, value:item.value}));
                return item.html;
              }
              }
          ],
          
        },
        {
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
    
    art.events.proxy(document,"keydown", event => {
      if (event.key === 'f' || event.key === 'F') {
      art.fullscreen = !art.fullscreen;
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
