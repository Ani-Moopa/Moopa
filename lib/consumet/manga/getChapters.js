let API_URL;
API_URL = process.env.API_URI || null || null;
// remove / from the end of the url if it exists
if (API_URL && API_URL.endsWith("/")) {
  API_URL = API_URL.slice(0, -1);
}

async function fetchInfo(id) {
  try {
    const providers = [
      "mangadex",
      "mangahere",
      "mangakakalot",
      // "mangapark",
      // "mangapill",
      "mangasee123",
    ];
    let datas = [];

    async function promiseMe(provider) {
      try {
        const data = await fetch(
          `${API_URL}/meta/anilist-manga/info/${id}?provider=${provider}`
        ).then((res) => {
          if (!res.ok) {
            switch (res.status) {
              case 404: {
                return null;
              }
            }
          }
          return res.json();
        });
        if (data.chapters.length > 0) {
          datas.push({
            providerId: provider,
            chapters: data.chapters,
          });
        }
      } catch (error) {
        console.error(`Error fetching data for provider '${provider}':`, error);
      }
    }

    await Promise.all(providers.map((provider) => promiseMe(provider)));

    return datas;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}

export default async function getConsumetChapters(id, redis) {
  try {
    let cached;
    let chapters;

    if (redis) {
      cached = await redis.get(`chapter:${id}`);
    }

    if (cached) {
      chapters = JSON.parse(cached);
    } else {
      chapters = await fetchInfo(id);
    }

    if (chapters?.length === 0) {
      return null;
    }
    if (redis) {
      await redis.set(`chapter:${id}`, JSON.stringify(chapters), "EX", 60 * 60); // 1 hour
    }

    return chapters;
  } catch (error) {
    return { error };
  }
}
