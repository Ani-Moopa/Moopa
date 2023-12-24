export interface AnifyRecentEpisode {
  id: string;
  slug: string;
  coverImage: string;
  bannerImage: string;
  trailer: string;
  status: string;
  season: string;
  title: Title;
  currentEpisode: number;
  mappings?: MappingsEntity[] | null;
  synonyms?: string[] | null;
  countryOfOrigin: string;
  description: string;
  duration: number;
  color: string;
  year: number;
  rating: RatingOrPopularity;
  popularity: RatingOrPopularity;
  type: string;
  format: string;
  relations?: RelationsEntity[] | null;
  totalEpisodes: number;
  genres?: string[] | null;
  tags?: string[] | null;
  episodes: Episodes;
  averageRating: number;
  averagePopularity: number;
  artwork?: ArtworkEntity[] | null;
  characters?: CharactersEntity[] | null;
}
export interface Title {
  native: string;
  romaji: string;
  english: string;
}
export interface MappingsEntity {
  id: string;
  providerId: string;
  similarity: number;
  providerType: string;
}
export interface RatingOrPopularity {
  anidb: number;
  anilist: number;
}
export interface RelationsEntity {
  id: string;
  type: string;
  title: Title;
  format: string;
  relationType: string;
}
export interface Episodes {
  data?: DataEntity[] | null;
  latest: Latest;
}
export interface DataEntity {
  episodes?: EpisodesEntity[] | null;
  providerId: string;
}
export interface EpisodesEntity {
  id: string;
  img?: null;
  title: string;
  hasDub: boolean;
  number: number;
  rating?: null;
  isFiller: boolean;
  updatedAt: number;
  description?: null;
}
export interface Latest {
  updatedAt: number;
  latestTitle: string;
  latestEpisode: number;
}
export interface ArtworkEntity {
  img: string;
  type: string;
  providerId: string;
}
export interface CharactersEntity {
  name: string;
  image: string;
  voiceActor: VoiceActor;
}
export interface VoiceActor {
  name: string;
  image: string;
}
