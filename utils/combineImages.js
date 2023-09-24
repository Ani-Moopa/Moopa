async function appendImagesToEpisodes(episodesData, images) {
  // Create a dictionary for faster lookup of images based on episode number
  const episodeImages = {};
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
