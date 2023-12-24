import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Navbar } from "../../../components/shared/NavBar";
import MobileNav from "../../../components/shared/MobileNav";
import { GetServerSideProps } from "next";

type InfoNovelProps = {
  id: string;
  API: string;
};

type NovelData = {
  image?: string;
  title?: string;
  Release?: string;
  Status?: string;
  Author?: string;
  description?: string;
  chapters?: {
    chapterId?: string;
    chapter?: string;
    release?: string;
  }[];
  notFound?: boolean;
};

export default function InfoNovel({ id, API }: InfoNovelProps) {
  const [data, setData] = useState<NovelData>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const { data } = await axios.get(`${API}/api/novel/info/` + id);
        setData(data);
      } catch (error) {
        setData({
          notFound: true,
        });
      } finally {
        setLoading(false);
      }
    }
    fetchData();

    return () => {
      setData(undefined);
    };
  }, [id]);

  return (
    <div className="flex flex-col items-center">
      <Navbar withNav paddingY="" scrollP={0} />
      <MobileNav hideProfile />
      <div className="relative w-full max-w-screen-lg mx-5 mt-5 px-5 lg:px-0 lg:mt-14">
        {data && (
          <div className="flex lg:flex-row flex-col z-30 pt-24 lg:px-5">
            {data?.image && (
              <Image
                src={data?.image}
                width={200}
                height={200}
                alt="coverImage"
                className="z-50 w-[170px] h-[240px] object-cover rounded"
              />
            )}
            <div className="flex flex-col items-start justify-end gap-2 lg:pl-5 z-30 mt-5 lg:mt-0">
              <h1 className="font-bold text-2xl lg:text-3xl font-outfit line-clamp-2">
                {data?.title}
              </h1>
              <div className="flex gap-5 w-full">
                <p className="flex gap-2 font-bold font-karla">
                  Release: <span>{data?.Release}</span>
                </p>
                <p className="flex gap-2 font-bold font-karla">
                  Status: <span>{data?.Status}</span>
                </p>
                <p className="flex-1 gap-2 font-bold font-karla overflow-x-hidden text-ellipsis whitespace-nowrap">
                  Author: <span>{data?.Author}</span>
                </p>
              </div>
              <p className="line-clamp-2 font-light font-karla">
                {data?.description}
              </p>
            </div>
          </div>
        )}

        <div className="mt-10 flex flex-col gap-3">
          {data?.chapters?.map((chapter) => (
            <Link
              key={chapter?.chapterId}
              href={`/id/novel/read/?id=${chapter?.chapterId}`}
              className="py-3 bg-secondary w-full px-5 rounded"
            >
              <div className="flex justify-between w-full">
                <p className="font-bold font-karla">{chapter?.chapter}</p>
                <p className="font-light font-karla">{chapter?.release}</p>
              </div>
            </Link>
          ))}
        </div>
        <div className="w-full bg-secondary rounded-xl h-[200px] absolute inset-0 z-10" />
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const { id } = params || {};
  const API = process.env.ID_API;
  return {
    props: {
      id,
      API,
    },
  };
};
