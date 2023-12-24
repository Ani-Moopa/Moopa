type Episode = {
  id: string;
  description: string | null;
  hasDub: boolean;
  img: string | null;
  isFiller: boolean;
  number: number;
  rating: number | null;
  title: string;
  updatedAt: number;
};

type Provider = {
  providerId: string;
  data: Episode[];
};

export function getProviderWithMostEpisodesAndImage(
  data: Provider[]
): Provider | null {
  let maxEpisodesProvider: Provider | null = null;

  for (const provider of data) {
    if (
      !maxEpisodesProvider ||
      provider.data.length > maxEpisodesProvider.data.length
    ) {
      const hasImage = provider.data.some((episode) => episode.img !== null);
      if (hasImage) {
        maxEpisodesProvider = provider;
      }
    }
  }

  return maxEpisodesProvider;
}
