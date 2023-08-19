import { useEffect, useRef } from "react";
import Artplayer from "artplayer";

export default function Player({ option, res, getInstance, ...rest }) {
  const artRef = useRef();

  useEffect(() => {
    const art = new Artplayer({
      ...option,
      container: artRef.current,
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
    });

    art.events.proxy(document, "keydown", (event) => {
      if (event.key === "f" || event.key === "F") {
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
