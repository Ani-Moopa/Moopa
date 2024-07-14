export interface EpisodeData {
  map?: boolean;
  providerId: string;
  episodes: Episode[];
}

export interface Episode {
  id: string;
  title: string;
  img: string;
  number: number;
  createdAt?: Date;
  description: string;
  url?: string;
  isFiller?: boolean;
  hasDub?: boolean;
  rating?: null;
  updatedAt?: number;
}
