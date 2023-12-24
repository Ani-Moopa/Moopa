export interface ConsumetInfo {
  message: string;
  length: number;
  id: string;
  title: Title;
  malId: number;
  synonyms: string[];
  isLicensed: boolean;
  isAdult: boolean;
  countryOfOrigin: string;
  trailer: Trailer;
  image: string;
  popularity: number;
  color: string;
  cover: string;
  description: string;
  status: Status;
  releaseDate: number;
  startDate: EndDateClass;
  endDate: EndDateClass;
  totalEpisodes: number;
  currentEpisode: number;
  rating: number;
  duration: number;
  genres: string[];
  season: string;
  studios: string[];
  subOrDub: string;
  type: RecommendationType;
  recommendations: Ation[];
  characters: Character[];
  relations: Ation[];
  mappings: Mapping[];
  artwork: Artwork[];
  episodes: Episode[];
}

export interface Artwork {
  img: string;
  type: ArtworkType;
  providerId: ProviderID;
}

export enum ProviderID {
  Anilist = "anilist",
  Mal = "mal",
  Tvdb = "tvdb",
}

export enum ArtworkType {
  Banner = "banner",
  ClearArt = "clear_art",
  ClearLogo = "clear_logo",
  Icon = "icon",
  Poster = "poster",
  TopBanner = "top_banner",
}

export interface Character {
  id: number;
  role: Role;
  name: Name;
  image: string;
  voiceActors: VoiceActor[];
}

export interface Name {
  first: string;
  last: null | string;
  full: string;
  native: null | string;
  userPreferred: string;
}

export enum Role {
  Main = "MAIN",
  Supporting = "SUPPORTING",
}

export interface VoiceActor {
  id: number;
  language: Language;
  name: Name;
  image: string;
}

export enum Language {
  English = "English",
  French = "French",
  German = "German",
  Japanese = "Japanese",
  Portuguese = "Portuguese",
  Spanish = "Spanish",
}

export interface EndDateClass {
  year: number;
  month: number;
  day: number;
}

export interface Episode {
  id: string;
  title: string;
  description: null;
  number: number;
  image: string;
  airDate: null;
}

export interface Mapping {
  id: string;
  providerId: string;
  similarity: number;
  providerType: string;
}

export interface Ation {
  id: number;
  malId: number;
  title: Title;
  status: Status;
  episodes: number | null;
  image: string;
  cover: string;
  rating: number;
  type: RecommendationType;
  relationType?: string;
  color?: string;
}

export enum Status {
  Completed = "Completed",
}

export interface Title {
  romaji: string;
  english: string;
  native: string;
  userPreferred?: string;
}

export enum RecommendationType {
  Manga = "MANGA",
  Ona = "ONA",
  Tv = "TV",
  TvShort = "TV_SHORT",
}

export interface Trailer {
  id: string;
  site: string;
  thumbnail: string;
}
