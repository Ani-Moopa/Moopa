export function getHeaders(providerId) {
  switch (providerId) {
    case "mangahere":
      return { Referer: "https://mangahere.org" };
    case "mangadex":
      return { Referer: "https://mangadex.org" };
    case "mangakakalot":
      return { Referer: "https://mangakakalot.com" };
    case "mangapill":
      return { Referer: "https://mangapill.com" };
    case "mangasee123":
      return { Referer: "https://mangasee123.com" };
    case "comick":
      return { Referer: "https://comick.app" };
    default:
      return null;
  }
}

export function getRandomId() {
  return Math.random().toString(36).substr(2, 9);
}

export function truncateImgUrl(url) {
  // Find the index of .png if not found find the index of .jpg
  let index =
    url.indexOf(".png") !== -1 ? url.indexOf(".png") : url.indexOf(".jpg");
  if (index !== -1) {
    // If .png is found
    url = url.slice(0, index + 4); // Slice the string from the start to the index of .png plus 4 (the length of .png)
  }
  return url;
}
