export type AnifySearchAdvanceTypes = {
  total: number;
  lastPage: number;
  results: Array<{
    id: string;
    slug: string;
    coverImage: string;
    bannerImage: string;
    status: string;
    title: {
      native: string;
      romaji: string;
      english: string;
    };
    duration: number;
    mappings: Array<{
      id: string;
      providerId: string;
      similarity: number;
      providerType: string;
    }>;
    synonyms: Array<string>;
    countryOfOrigin: string;
    description: string;
    color: string;
    year: number;
    rating: {
      comick: number;
      anilist: number;
    };
    popularity: {
      comick: number;
      anilist: number;
    };
    type: string;
    format: string;
    relations: Array<{
      id: string;
      type: string;
      title: {
        native: string;
        romaji: string;
        english: string;
      };
      format: string;
      relationType: string;
    }>;
    currentChapter: any;
    totalChapters: number;
    totalVolumes: number;
    genres: Array<string>;
    tags: Array<string>;
    chapters: {
      data: Array<{
        chapters: Array<{
          id: string;
          title: string;
          number: number;
          rating: any;
          mixdrop?: string;
          updatedAt: number;
        }>;
        providerId: string;
      }>;
      latest: {
        updatedAt: number;
        latestTitle: string;
        latestChapter: number;
      };
    };
    averageRating: number;
    averagePopularity: number;
    artwork: Array<{
      img: string;
      type: string;
      providerId: string;
    }>;
    characters: Array<{
      name: string;
      image: string;
      voiceActor: {
        name: any;
        image: any;
      };
    }>;
  }>;
};
