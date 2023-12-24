export type TrackData = {
  provider: string;
  defaultQuality: DefaultQuality;
  subtitles: Subtitle[];
  thumbnails: string;
  epiData: EpiData;
  skip: Skip;
};

export interface DefaultQuality {
  url: string;
  headers: Headers;
}

export interface Headers {}

export interface Subtitle {
  src: string;
  label: string;
  kind: "subtitles" | "captions" | "descriptions" | "chapters" | "metadata";
  default?: boolean;
}

export interface EpiData {
  sources: Source[];
  subtitles: Subtitle2[];
  audio: any[];
  intro: Intro;
  outro: Outro;
  headers: Headers2;
}

export interface Source {
  url: string;
  quality: string;
}

export interface Subtitle2 {
  url: string;
  lang: string;
}

export interface Intro {
  start: number;
  end: number;
}

export interface Outro {
  start: number;
  end: number;
}

export interface Headers2 {}

export interface Skip {
  op: Op;
  ed: any;
}

export interface Op {
  interval: Interval;
  skipType: string;
  skipId: string;
  episodeLength: number;
}

export interface Interval {
  startTime: number;
  endTime: number;
}
