interface Image {
  episode: number;
  img: string;
}

interface Episode {
  number: number;
  img?: string;
}

interface ProviderEpisodes {
  episodes: Episode[];
}

async function appendImagesToEpisodes(
  episodesData: ProviderEpisodes[],
  images: Image[]
) {
  // Create a dictionary for faster lookup of images based on episode number
  const episodeImages: { [key: number]: string } = {};
  images.forEach((image) => {
    episodeImages[image.episode] = image.img;
  });

  // Iterate through each provider's episodes data
  for (const providerEpisodes of episodesData) {
    // Iterate through each episode in the provider's episodes data
    for (const episode of providerEpisodes.episodes) {
      // Get the episode number
      const episodeNumber = episode.number;

      // Check if there is an image available for this episode number
      if (episodeImages[episodeNumber]) {
        // Append the image URL to the episode data
        episode.img = episodeImages[episodeNumber];
      }
    }
  }

  return episodesData;
}

export default appendImagesToEpisodes;
