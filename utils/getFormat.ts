const data = [
  { name: "TV Show", value: "TV" },
  { name: "TV Short", value: "TV_SHORT" },
  { name: "Movie", value: "MOVIE" },
  { name: "Special", value: "SPECIAL" },
  { name: "OVA", value: "OVA" },
  { name: "ONA", value: "ONA" },
  { name: "Music", value: "MUSIC" },
  { name: "Manga", value: "MANGA" },
  { name: "Novel", value: "NOVEL" },
  { name: "One Shot", value: "ONE_SHOT" },
];

export function getFormat(format: string) {
  const results = data.find((item) => item.value === format);
  return results?.name;
}
