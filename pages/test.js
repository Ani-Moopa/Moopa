import { signIn, signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_MEDIA } from "../queries";
import StackPlayer from "../components/test/player";
import Modal from "../components/modal";

import { AniData as data } from "../components/test/dataAni";
import Image from "next/image";
import { client } from "../lib/apolloClient";
import Link from "next/link";
import { useAniList } from "../lib/useAnilist";

export default function AniTest() {
  const { data: session, status } = useSession();
  const { media, aniAdvanceSearch } = useAniList(session);
  const [advanceSearch, setAdvanceSearch] = useState();

  const [search, setSearch] = useState();
  const [type, setType] = useState("ANIME");
  const [seasonYear, setSeasonYear] = useState();
  const [season, setSeason] = useState();
  const [genres, setGenres] = useState();
  const [perPage, setPerPage] = useState(25);
  const [sort, setSort] = useState(["POPULARITY_DESC"]);

  // async function handleUpdateMediaEntry(entryId, status, progress, score) {
  //   try {
  //     const updatedEntry = await updateMediaEntry(
  //       entryId,
  //       status,
  //       progress,
  //       score
  //     );
  //     console.log(updatedEntry);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }

  // const userId = session?.user?.id;
  // const MediaList = ({ userId }) => {
  //   const { data, loading, error } = useQuery(GET_MEDIA, {
  //     variables: { page: 1, userId, type: "ANIME", status: "COMPLETED" },
  //   });

  //   if (loading) return <p>Loading...</p>;
  //   if (error) return <p>Error :(</p>;

  //   const { mediaList } = data.Page;
  //   console.log(mediaList);
  // };

  // const [open, setOpen] = useState(false);

  async function advance() {
    const data = await aniAdvanceSearch(
      search,
      type,
      seasonYear,
      season,
      genres,
      perPage,
      sort
    );
    setAdvanceSearch(data);
  }

  useEffect(() => {
    advance();
  }, [search, type, seasonYear, season, genres, perPage, sort]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  const astatus = "COMPLETED";

  // const { data } = aniAdvanceSearch({
  //   search: "naruto",
  // });

  console.log(advanceSearch);

  return (
    // <div className="h-[720px] w-[1280px]">
    //   <StackPlayer />
    // </div>
    <>
      {/* <button
        className="bg-[#30c168] p-2 rounded-lg m-5 text-black font-semibold font-karla"
        onClick={() => setOpen(true)}
      >
        Start Watching
      </button>
      <Modal open={open} onClose={() => setOpen(false)}>
        <div className="bg-white rounded-md text-black">
          <div className="">
            <Image
              src={data.episodes[0].image}
              alt="iamge"
              width={1000}
              height={1000}
              className="object-cover rounded-t-md w-[420px] h-[100px]"
            />
          </div>
          <div>Episode 6</div>
          <div>test</div>
        </div>
      </Modal> */}
      {!session && (
        <button onClick={() => signIn("AniListProvider")}>
          Sign in with Anilist
        </button>
      )}
      {session && (
        <div>
          <button onClick={() => signOut()}>
            Sign out ({session.user?.name})
          </button>
          <img
            src={session.user?.image.large}
            className="w-[100px] h-[100px]"
          />
        </div>
      )}
      {advanceSearch?.media.map((item) => {
        return <div key={item.id}>{item.title.userPreferred}</div>;
      })}
      {media?.length > 0 && (
        <div className="flex-center flex-col gap-5">
          {media.map((item, index) => {
            return (
              <div key={index} className="flex-center flex-col gap-5">
                <h2 className="font-bold text-xl font-karla">{item.name}</h2>
                <div className="grid grid-cols-4 gap-5">
                  {item.entries.map((items, index) => {
                    return (
                      <div key={index}>
                        <div className="bg-secondary flex h-[120px] w-[420px]">
                          <div className="w-[20%] shrink-0">
                            <Image
                              src={items.media.coverImage.large}
                              alt="image deez nuts"
                              height={1000}
                              width={1000}
                              className="object-cover h-[120px] shrink-0"
                            />
                          </div>
                          <div className="p-3">
                            <h1 className="text-semibold font-karla text-lg line-clamp-3">
                              {items.media.title.romaji}
                            </h1>
                            <h3 className="text-sm font-karla text-light">
                              Episodes {items.progress} - {items.media.episodes}
                            </h3>
                            {item.name === "Watching" && (
                              <button
                                onClick={() =>
                                  handleUpdateMediaEntry(
                                    items.media.id,
                                    "COMPLETED",
                                    items.media.episodes,
                                    8
                                  )
                                }
                              >
                                Mark as Complete
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
          {/* <h2 className="font-bold text-xl font-karla">Paused</h2>
          <div className="grid grid-cols-4 gap-5">
            {media[1].entries.map((item, index) => {
              return (
                <div key={index} className="">
                  <div className="bg-secondary flex h-[120px] w-[420px]">
                    <div className="w-[20%] shrink-0">
                      <Image
                        src={item.media.coverImage.large}
                        alt="image deez nuts"
                        height={1000}
                        width={1000}
                        className="object-cover h-[120px]"
                      />
                    </div>
                    <div className="p-3">
                      <h1 className="text-semibold font-karla text-lg line-clamp-3">
                        {item.media.title.romaji}
                      </h1>
                      <h3 className="text-sm font-karla text-light">
                        Episodes {item.progress} - {item.media.episodes}
                      </h3>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <h2 className="font-bold text-xl font-karla">Dropped</h2>
          <div className="grid grid-cols-4 gap-5">
            {media[2].entries.map((item, index) => {
              return (
                <div key={index} className="">
                  <div className="bg-secondary flex h-[120px] w-[420px]">
                    <div className="w-[20%] shrink-0">
                      <Image
                        src={item.media.coverImage.large}
                        alt="image deez nuts"
                        height={1000}
                        width={1000}
                        className="object-cover h-[120px]"
                      />
                    </div>
                    <div className="p-3">
                      <h1 className="text-semibold font-karla text-lg line-clamp-3">
                        {item.media.title.romaji}
                      </h1>
                      <h3 className="text-sm font-karla text-light">
                        Episodes {item.progress} - {item.media.episodes}
                      </h3>
                    </div>
                  </div>
                </div>
              );
            })}
          </div> */}
        </div>
      )}
      <Link href="/">Home</Link>
    </>
  );
}
