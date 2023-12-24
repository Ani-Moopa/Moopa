// Consumets types
export interface ConsumetInfo {
  id: string;
  title: Title;
  malId: number;
  synonyms?: null[] | null;
  isLicensed: boolean;
  isAdult: boolean;
  countryOfOrigin: string;
  trailer: Trailer;
  image: string;
  popularity: number;
  color: string;
  cover: string;
  description: string;
  status: string;
  releaseDate: number;
  startDate: StartDateOrEndDate;
  endDate: StartDateOrEndDate;
  totalEpisodes: number;
  currentEpisode: number;
  rating: number;
  duration: number;
  genres?: string[] | null;
  season: string;
  studios?: string[] | null;
  subOrDub: string;
  type: string;
  recommendations?: RecommendationsEntity[] | null;
  characters?: CharactersEntityConsumet[] | null;
  relations?: RelationsEntityConsumet[] | null;
  mappings?: MappingsEntity[] | null;
  artwork?: ArtworkEntity[] | null;
  episodes?: EpisodesEntity[] | null;
}
export interface Trailer {
  id: string;
  site: string;
  thumbnail: string;
}
export interface StartDateOrEndDate {
  year: number;
  month: number;
  day: number;
}
export interface RecommendationsEntity {
  id: number;
  malId: number;
  title: Title1;
  status: string;
  episodes: number;
  image: string;
  cover: string;
  rating: number;
  type: string;
}
export interface Title1 {
  romaji: string;
  english?: string | null;
  native: string;
  userPreferred: string;
}
export interface Title {
  native: string;
  romaji: string;
  english: string;
}
export interface CharactersEntityConsumet {
  id: number;
  role: string;
  name: Name;
  image: string;
  voiceActors?: VoiceActorsEntity[] | null;
}
export interface Name {
  first: string;
  last?: string | null;
  full: string;
  native: string;
  userPreferred: string;
}
export interface VoiceActorsEntity {
  id: number;
  language: string;
  name: Name1;
  image: string;
}
export interface Name1 {
  first: string;
  last: string;
  full: string;
  native?: string | null;
  userPreferred: string;
}
export interface RelationsEntityConsumet {
  id: number;
  relationType: string;
  malId: number;
  title: Title1;
  status: string;
  episodes?: number | null;
  image: string;
  color: string;
  type: string;
  cover: string;
  rating: number;
}
export interface MappingsEntity {
  id: string;
  providerId: string;
  similarity: number;
  providerType: string;
}
export interface ArtworkEntity {
  img: string;
  type: string;
  providerId: string;
}
export interface EpisodesEntity {
  id: string;
  title: string;
  description?: null;
  number: number;
  image: string;
  airDate?: null;
}
