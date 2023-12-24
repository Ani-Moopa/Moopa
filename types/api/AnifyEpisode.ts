export interface AnifyEpisode {
  providerId: string;
  episodes: Episode[];
}

export interface Episode {
  id: string;
  number: number;
  title: string;
  isFiller: boolean;
  img: null;
  hasDub: boolean;
  description: null;
  rating: null;
  updatedAt: number;
}
