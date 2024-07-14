import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Navbar } from "../../../components/shared/NavBar";
import MobileNav from "../../../components/shared/MobileNav";
import pls from "@/utils/request";

export interface DataType {
  id: string;
  title: string;
  description: string;
  image: string;
  chapters: ChapterType[];
}

export interface ChapterType {
  id: string;
  title: string;
  rilis: string;
}

interface InfoNovelProps {
  id: string;
  API: string;
}

export default function InfoNovel({ id, API }: InfoNovelProps) {
  const [data, setData] = useState<DataType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const [filter, setFilter] = useState<string>("");

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const data = await pls.get(`${API}/api/manga/info/` + id);
        setData(data);
      } catch (error) {
        setData(null);
      } finally {
        setLoading(false);
      }
    }
    fetchData();

    return () => {
      setData(null);
    };
  }, [id]);

  const fuzzySearch = (text: string, query: string): boolean => {
    const textLower = text.toLowerCase().replace(/\.|\s/g, "");
    const queryLower = query.toLowerCase().replace(/\.|\s/g, "");

    let i = 0;
    let j = 0;

    while (i < textLower.length && j < queryLower.length) {
      if (textLower[i] === queryLower[j]) {
        j++;
      }
      i++;
    }

    return j === queryLower.length;
  };

  const filteredData = data?.chapters?.filter((chapter: ChapterType) =>
    fuzzySearch(chapter.title, filter)
  );

  return (
    <div className="flex flex-col items-center">
      <Navbar withNav paddingY="" scrollP={0} />
      <MobileNav hideProfile />
      <div className="relative w-full max-w-screen-lg mx-5 mt-5 px-5 lg:px-0 lg:mt-14">
        {data && (
          <div className="flex lg:flex-row flex-col z-30 pt-24 lg:px-5">
            <div className="shrink-0 z-50 w-[170px] h-[240px] rounded overflow-hidden bg-secondary/20">
              {data?.image && (
                <Image
                  src={`https://aoi.moopa.live/utils/image-proxy?url=${encodeURIComponent(
                    data?.image
                  )}${`&headers=${encodeURIComponent(
                    JSON.stringify({ Referer: "https://komikindo.tv/" })
                  )}`}`}
                  width={200}
                  height={200}
                  alt="coverImage"
                  className="z-50 w-[170px] h-[240px] object-cover"
                />
              )}
            </div>
            <div className="flex flex-col items-start justify-end gap-2 lg:pl-5 z-30 mt-5 lg:mt-0">
              <h1 className="font-bold text-2xl lg:text-3xl font-outfit line-clamp-2">
                {data?.title}
              </h1>
              {/* <div className="flex gap-5 w-full">
                <p className="flex gap-2 font-bold font-karla">
                  Format: <span>{data?.format}</span>
                </p>
                <p className="flex gap-2 font-bold font-karla">
                  Release: <span>{data?.year}</span>
                </p>
                <p className="flex gap-2 font-bold font-karla">
                  Status: <span>{data?.status}</span>
                </p>
              </div> */}
              <p className="line-clamp-2 font-light font-karla">
                {data?.description}
              </p>
            </div>
          </div>
        )}

        <div className="mt-10">
          <input
            className="appearance-none rounded bg-secondary px-2 py-1 font-karla outline-none"
            placeholder="Search..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>

        <div className="mt-5 flex flex-col gap-3">
          {filteredData?.map((chapter: ChapterType) => (
            <Link
              key={chapter?.id}
              href={`/id/manga/read/${id}/${chapter?.id}`}
              className="py-3 bg-secondary w-full px-5 rounded"
            >
              <div className="flex justify-between items-center font-karla w-full">
                <div className="">
                  <p className="font-bold">{chapter?.title}</p>
                </div>
                <p className="font-light">{chapter?.rilis}</p>
              </div>
            </Link>
          ))}
        </div>
        <div className="w-full bg-secondary rounded-xl h-[200px] absolute inset-0 z-10" />
      </div>
    </div>
  );
}

export async function getServerSideProps({ params }: any) {
  const { id } = params;
  const API = process.env.ID_API;
  // console.log(id);
  return {
    props: {
      id,
      API,
    },
  };
}
