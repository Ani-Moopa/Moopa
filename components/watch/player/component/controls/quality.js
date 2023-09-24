import artplayerPluginHlsQuality from "artplayer-plugin-hls-quality";

export const QualityPlugins = [
  artplayerPluginHlsQuality({
    // Show quality in setting
    setting: true,

    // Get the resolution text from level
    getResolution: (level) => level.height + "P",

    // I18n
    title: "Quality",
    auto: "Auto",
  }),
];
