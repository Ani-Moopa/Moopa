/**
 * @type {import("artplayer/types/icons".Icons)}
 */
export const icons = {
  screenshot:
    '<svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 20 20"><path fill="currentColor" d="M10 8a3 3 0 1 0 0 6a3 3 0 0 0 0-6zm8-3h-2.4a.888.888 0 0 1-.789-.57l-.621-1.861A.89.89 0 0 0 13.4 2H6.6c-.33 0-.686.256-.789.568L5.189 4.43A.889.889 0 0 1 4.4 5H2C.9 5 0 5.9 0 7v9c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm-8 11a5 5 0 0 1-5-5a5 5 0 1 1 10 0a5 5 0 0 1-5 5zm7.5-7.8a.7.7 0 1 1 0-1.4a.7.7 0 0 1 0 1.4z"></path></svg>',
  play: '<svg xmlns="http://www.w3.org/2000/svg" width="25px" height="25px" viewBox="0 0 20 20"><path fill="currentColor" d="M15 10.001c0 .299-.305.514-.305.514l-8.561 5.303C5.51 16.227 5 15.924 5 15.149V4.852c0-.777.51-1.078 1.135-.67l8.561 5.305c-.001 0 .304.215.304.514z"></path></svg>',
  pause:
    '<svg xmlns="http://www.w3.org/2000/svg" width="25px" height="25px" viewBox="0 0 20 20"><path fill="currentColor" d="M15 3h-2c-.553 0-1 .048-1 .6v12.8c0 .552.447.6 1 .6h2c.553 0 1-.048 1-.6V3.6c0-.552-.447-.6-1-.6zM7 3H5c-.553 0-1 .048-1 .6v12.8c0 .552.447.6 1 .6h2c.553 0 1-.048 1-.6V3.6c0-.552-.447-.6-1-.6z"></path></svg>',
  volume:
    '<svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 20 20"><path fill="currentColor" d="M19 13.805c0 .657-.538 1.195-1.195 1.195H1.533c-.88 0-.982-.371-.229-.822l16.323-9.055C18.382 4.67 19 5.019 19 5.9v7.905z"></path></svg>',
  fullscreenOff:
    '<svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 20 20"><path fill="currentColor" d="M3.28 2.22a.75.75 0 0 0-1.06 1.06L5.44 6.5H2.75a.75.75 0 0 0 0 1.5h4.5A.75.75 0 0 0 8 7.25v-4.5a.75.75 0 0 0-1.5 0v2.69L3.28 2.22Zm10.22.53a.75.75 0 0 0-1.5 0v4.5c0 .414.336.75.75.75h4.5a.75.75 0 0 0 0-1.5h-2.69l3.22-3.22a.75.75 0 0 0-1.06-1.06L13.5 5.44V2.75ZM3.28 17.78l3.22-3.22v2.69a.75.75 0 0 0 1.5 0v-4.5a.75.75 0 0 0-.75-.75h-4.5a.75.75 0 0 0 0 1.5h2.69l-3.22 3.22a.75.75 0 1 0 1.06 1.06Zm10.22-3.22l3.22 3.22a.75.75 0 1 0 1.06-1.06l-3.22-3.22h2.69a.75.75 0 0 0 0-1.5h-4.5a.75.75 0 0 0-.75.75v4.5a.75.75 0 0 0 1.5 0v-2.69Z"></path></svg>',
  fullscreenOn:
    '<svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 20 20"><path fill="currentColor" d="m13.28 7.78l3.22-3.22v2.69a.75.75 0 0 0 1.5 0v-4.5a.75.75 0 0 0-.75-.75h-4.5a.75.75 0 0 0 0 1.5h2.69l-3.22 3.22a.75.75 0 0 0 1.06 1.06ZM2 17.25v-4.5a.75.75 0 0 1 1.5 0v2.69l3.22-3.22a.75.75 0 0 1 1.06 1.06L4.56 16.5h2.69a.75.75 0 0 1 0 1.5h-4.5a.747.747 0 0 1-.75-.75Zm10.22-3.97l3.22 3.22h-2.69a.75.75 0 0 0 0 1.5h4.5a.747.747 0 0 0 .75-.75v-4.5a.75.75 0 0 0-1.5 0v2.69l-3.22-3.22a.75.75 0 1 0-1.06 1.06ZM3.5 4.56l3.22 3.22a.75.75 0 0 0 1.06-1.06L4.56 3.5h2.69a.75.75 0 0 0 0-1.5h-4.5a.75.75 0 0 0-.75.75v4.5a.75.75 0 0 0 1.5 0V4.56Z"></path></svg>',
};

export const backButton = {
  name: "back-button",
  index: 10,
  position: "top",
  html: "<div class='parent-player-title'><div></div><div className='flex gap-2'><p className='pt-1'><ChevronLeftIcon className='w-7 h-7'/></p><div class='flex flex-col text-white'><p className='font-outfit font-bold text-2xl'>Komi-san wa, Komyushou desu.</p><p className=''>Episode 1</p></div></div></div>",
  //   tooltip: "Your Button",
  click: function (...args) {
    console.info("click", args);
  },
  mounted: function (...args) {
    console.info("mounted", args);
  },
};

export const seekBackward = {
  index: 10,
  name: "fast-rewind",
  position: "left",
  html: '<svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 20 20"><path fill="currentColor" d="M17.959 4.571L10.756 9.52s-.279.201-.279.481s.279.479.279.479l7.203 4.951c.572.38 1.041.099 1.041-.626V5.196c0-.727-.469-1.008-1.041-.625zm-9.076 0L1.68 9.52s-.279.201-.279.481s.279.479.279.479l7.203 4.951c.572.381 1.041.1 1.041-.625v-9.61c0-.727-.469-1.008-1.041-.625z"></path></svg>',
  tooltip: "Backward 5s",
  click: function () {
    art.backward = 5;
  },
};

export const seekForward = {
  index: 11,
  name: "fast-forward",
  position: "left",
  html: '<svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 20 20"><path fill="currentColor" d="M9.244 9.52L2.041 4.571C1.469 4.188 1 4.469 1 5.196v9.609c0 .725.469 1.006 1.041.625l7.203-4.951s.279-.199.279-.478c0-.28-.279-.481-.279-.481zm9.356.481c0 .279-.279.478-.279.478l-7.203 4.951c-.572.381-1.041.1-1.041-.625V5.196c0-.727.469-1.008 1.041-.625L18.32 9.52s.28.201.28.481z"></path></svg>',
  tooltip: "Forward 5s",
  click: function () {
    art.forward = 5;
  },
};

// /**
//  * @type {import("artplayer/types/component").ComponentOption}
//  */
// export const
