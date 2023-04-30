import Head from "next/head";
import Footer from "../../components/footer";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAniList } from "../../lib/useAnilist";
import Image from "next/image";

export default function Categories() {
  const router = useRouter();
  const { id } = router.query;
  const tags = id?.replace(/-/g, " ");
  const { aniAdvanceSearch } = useAniList();

  const [data, setData] = useState();

  const [season, setSeason] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    if (tags === "This Season") {
      seasonNow();
      setLoading(false);
    } else if (tags === "Popular Anime") {
      PopularAnime();
      setLoading(false);
    } else if (tags === "Popular Manga") {
      PopularManga();
      setLoading(false);
    } else {
      setData(null);
      setLoading(false);
    }
  }, [id]);

  async function seasonNow() {
    const data = await aniAdvanceSearch({
      perPage: 25,
      seasonYear: 2023,
      season: getCurrentSeason(),
      // type: "MANGA",
    });
    setData(data);
  }

  async function PopularAnime() {
    const data = await aniAdvanceSearch({
      perPage: 25,
      sort: ["POPULARITY_DESC"],
    });
    setData(data);
  }

  async function PopularManga() {
    const data = await aniAdvanceSearch({
      perPage: 25,
      sort: ["POPULARITY_DESC"],
      type: "MANGA",
    });
    setData(data);
  }

  console.log(data);
  return (
    <>
      <Head>
        <title>Categories - {tags}</title>
      </Head>
      <div className="flex-center min-h-screen w-screen">
        <div className="grid-container bg-white">
          {loading ? (
            <p>Loading...</p>
          ) : (
            data &&
            data?.media.map((m) => {
              return (
                <div key={m.id} className="grid-item h-[265px] w-[185px]">
                  <Image
                    src={m.coverImage.extraLarge}
                    alt="image"
                    width={500}
                    height={500}
                    className="object-cover h-[265px] w-[185px]"
                  />
                </div>
              );
            })
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

function getYear() {
  const now = new Date();
  return now.getFullYear();
}

function getCurrentSeason() {
  const now = new Date();
  const month = now.getMonth() + 1; // getMonth() returns 0-based index

  switch (month) {
    case 12:
    case 1:
    case 2:
      return "WINTER";
    case 3:
    case 4:
    case 5:
      return "SPRING";
    case 6:
    case 7:
    case 8:
      return "SUMMER";
    case 9:
    case 10:
    case 11:
      return "FALL";
    default:
      return "UNKNOWN SEASON";
  }
}
