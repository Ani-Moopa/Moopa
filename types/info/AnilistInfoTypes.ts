export interface AniListInfoTypes {
  mediaListEntry: MediaListEntry;
  id: number;
  type: string;
  format: string;
  title: Title;
  coverImage: CoverImage;
  startDate: StartDate;
  bannerImage: string;
  description: string;
  episodes: any;
  nextAiringEpisode: any;
  averageScore: number;
  popularity: number;
  status: string;
  genres: string[];
  season: any;
  studios: Studios;
  seasonYear: any;
  duration: any;
  relations: Relations;
  recommendations: Recommendations;
  characters: Characters;
}

interface Studios {
  edges: Studio[];
}

interface Studio {
  isMain: boolean;
  node: Node4;
}

interface Node4 {
  id: number;
  name: string;
}

export interface MediaListEntry {
  status: string;
  progress: number;
  progressVolumes: number;
}

export interface Title {
  romaji: string;
  english: string;
  native: string;
}

export interface CoverImage {
  extraLarge: string;
  large: string;
  color: string;
}

export interface StartDate {
  year: number;
  month: number;
}

export interface Relations {
  edges: Edge[];
}

export interface Edge {
  id: number;
  relationType: string;
  node: Node;
}

export interface Node {
  id: number;
  title: Title2;
  format: string;
  type: string;
  status: string;
  bannerImage?: string;
  coverImage: CoverImage2;
}

export interface Title2 {
  userPreferred: string;
}

export interface CoverImage2 {
  extraLarge: string;
  color: string;
}

export interface Recommendations {
  nodes: Node2[];
}

export interface Node2 {
  mediaRecommendation: MediaRecommendation;
}

export interface MediaRecommendation {
  id: number;
  title: Title3;
  coverImage: CoverImage3;
}

export interface Title3 {
  romaji: string;
}

export interface CoverImage3 {
  extraLarge: string;
  large: string;
}

export interface Characters {
  edges: Edge2[];
}

export interface Edge2 {
  role: string;
  node: Node3;
}

export interface Node3 {
  id: number;
  image: Image;
  name: Name;
}

export interface Image {
  large: string;
  medium: string;
}

export interface Name {
  full: string;
  userPreferred: string;
}
