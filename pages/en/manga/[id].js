import dotenv from "dotenv";
import ChapterSelector from "../../../components/manga/chapters";
import HamburgerMenu from "../../../components/manga/mobile/hamburgerMenu";
import Navbar from "../../../components/navbar";
import TopSection from "../../../components/manga/info/topSection";
import Footer from "../../../components/footer";
import Head from "next/head";
import { useEffect, useState } from "react";
import { setCookie } from "nookies";
import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]";
import getAnifyInfo from "../../../lib/anify/info";

export default function Manga({ info, userManga, chapters }) {
  const [domainUrl, setDomainUrl] = useState("");
  const [firstEp, setFirstEp] = useState();
  const chaptersData = info.chapters.data;

  useEffect(() => {
    setDomainUrl(window.location.origin);
  }, []);

  return (
    <>
      <Head>
        <title>
          {info
            ? `Manga - ${
                info.title.romaji || info.title.english || info.title.native
              }`
            : "Getting Info..."}
        </title>
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content={`Madara - ${info.title.romaji || info.title.english}`}
        />
        <meta
          name="twitter:description"
          content={`${info.description?.slice(0, 180)}...`}
        />
        <meta
          name="twitter:image"
          content={`${domainUrl}/api/og?title=${
            info.title.romaji || info.title.english
          }&image=${info.bannerImage || info.coverImage}`}
        />
      </Head>
      <div className="min-h-screen w-screen flex flex-col items-center relative">
        <HamburgerMenu />
        <Navbar className="absolute top-0 w-full z-40" />
        <div className="flex flex-col w-screen items-center gap-5 md:gap-10 py-10 pt-nav">
          <div className="flex-center w-full relative z-30">
            <TopSection info={info} firstEp={firstEp} setCookie={setCookie} />
            <>
              <div className="absolute hidden md:block z-20 bottom-0 h-1/2 w-full bg-secondary" />
              <div className="absolute hidden md:block z-20 top-0 h-1/2 w-full bg-transparent" />
            </>
          </div>
          <div className="w-[90%] xl:w-[70%] min-h-[35vh] z-40">
            {chaptersData.length > 0 ? (
              <ChapterSelector
                chaptersData={chaptersData}
                data={info}
                setFirstEp={setFirstEp}
                setCookie={setCookie}
                userManga={userManga}
              />
            ) : (
              <p>No Chapter Available :(</p>
            )}
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  dotenv.config();

  const session = await getServerSession(context.req, context.res, authOptions);

  const { id } = context.query;
  const key = process.env.API_KEY;
  const data = await getAnifyInfo(id, key);

  let userManga = null;

  if (session) {
    const response = await fetch("https://graphql.anilist.co/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
        query ($username: String, $status: MediaListStatus) {
    MediaListCollection(userName: $username, type: MANGA, status: $status, sort: SCORE_DESC) {
      user {
        id
        name
      }
      lists {
        status
        name
        entries {
          id
          mediaId
          status
          progress
          score
          progressVolumes
          media {
            id
            status
            title {
              english
              romaji
            }
            episodes
            coverImage {
              large
            }
          }
        }
      }
    }
  }
        `,
        variables: {
          username: session?.user?.name,
        },
      }),
    });
    const data = await response.json();
    const user = data?.data?.MediaListCollection;
    const userListsCurrent = user?.lists.find((X) => X.status === "CURRENT");
    const matched = userListsCurrent?.entries.find(
      (x) => x.mediaId === parseInt(id)
    );
    if (matched) {
      userManga = matched;
    }
  }

  if (!data?.chapters) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      info: data,
      userManga,
    },
  };
}
