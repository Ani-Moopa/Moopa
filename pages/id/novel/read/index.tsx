import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Navbar } from "@/components/shared/NavBar";
import MobileNav from "@/components/shared/MobileNav";
import pls from "@/utils/request/index";

interface IData {
  novelTitle: string;
  title: string;
  navigation: {
    next: string;
    prev: string;
  };
  content: string;
}

export async function getServerSideProps() {
  const API = process.env.ID_API;
  return {
    props: {
      API,
    },
  };
}

export default function ReadNovel({ API }: { API: string }) {
  const [data, setData] = useState<IData>();

  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const mangaId = id?.split("/")[0];

  useEffect(() => {
    async function fetchData() {
      if (id) {
        const data = await pls.get(`${API}/api/novel/chapter/${id}`);
        setData(data);
      }
    }
    fetchData();

    return () => {
      setData(undefined);
    };
  }, [id]);

  return (
    <>
      <Navbar withNav paddingY="py-2" scrollP={2} />
      <MobileNav hideProfile />
      <div className="w-screen flex flex-col items-center">
        {/* {data && ( */}
        <div className="flex items-center gap-5 w-full max-w-screen-lg px-5 mt-16 font-karla font-bold">
          <div className="flex gap-2">
            <Link
              href={`/id/novel/read/?id=${data?.navigation?.prev}`}
              className={`${
                data?.navigation?.prev ? "" : "pointer-events-none opacity-60"
              } py-1 px-2 bg-secondary rounded`}
            >
              prev
            </Link>
            <Link
              href={`/id/novel/read/?id=${data?.navigation?.next}`}
              className={`${
                data?.navigation?.next ? "" : "pointer-events-none opacity-60"
              } py-1 px-2 bg-secondary rounded`}
            >
              next
            </Link>
          </div>
          <span>/</span>
          <Link href={`/id/novel/${mangaId}`} className="text-lg line-clamp-1">
            {data?.novelTitle}
          </Link>
        </div>
        {/* )} */}
        <div className="block mt-5">
          <div className="px-5 w-full h-full max-w-screen-lg pointer-events-none select-none">
            <p className="text-xl font-bold my-5">{data?.title}</p>
            {data?.content && (
              <p
                dangerouslySetInnerHTML={{ __html: data?.content }}
                className="space-y-5"
              />
            )}
          </div>
        </div>
        {data?.content && (
          <div className="px-5 py-10 w-full h-full max-w-screen-lg">
            <div className="flex w-full gap-2">
              <Link
                href={`/id/novel/read/?id=${data?.navigation?.prev}`}
                className={`${
                  data?.navigation?.prev ? "" : "pointer-events-none opacity-60"
                } py-1 px-2 bg-secondary rounded`}
              >
                prev
              </Link>
              <Link
                href={`/id/novel/read/?id=${data?.navigation?.next}`}
                className={`${
                  data?.navigation?.next ? "" : "pointer-events-none opacity-60"
                } py-1 px-2 bg-secondary rounded`}
              >
                next
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
