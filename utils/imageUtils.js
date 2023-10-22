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
