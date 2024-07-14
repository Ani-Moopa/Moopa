import Image from "next/image";
import { useEffect, useState } from "react";
import { Navbar } from "@/components/shared/NavBar";
import MobileNav from "@/components/shared/MobileNav";
import pls from "@/utils/request";

type DataType = {
  id: string;
  title: string;
  pages: PageType[];
};

type PageType = {
  index: string;
  src: string;
};

interface ReadNovelProps {
  mangaId: string;
  chapterId: string;
  API: string;
}

export default function ReadNovel({ mangaId, chapterId, API }: ReadNovelProps) {
  const [data, setData] = useState<DataType | null>();
  const [hideNav, setHideNav] = useState(false);

  useEffect(() => {
    async function fetchData() {
      if (chapterId) {
        const data = await pls.get(`${API}/api/manga/pages/${chapterId}`);
        setData(data);
      }
    }
    fetchData();

    return () => {
      setData(null);
    };
  }, [chapterId]);

  return (
    <div className="w-screen flex flex-col items-center">
      {!hideNav && (
        <>
          <Navbar paddingY="2" scrollP={0} />
          <MobileNav hideProfile />
        </>
      )}
      <div className="block mt-12" onClick={() => setHideNav((prev) => !prev)}>
        <div className="w-full h-full max-w-screen-lg pointer-events-none select-none">
          {data?.pages?.map((i) => (
            <div key={i.index}>
              <Image
                src={`https://aoi.moopa.live/utils/image-proxy?url=${encodeURIComponent(
                  i.src
                )}${`&headers=${encodeURIComponent(
                  JSON.stringify({ Referer: "https://komikindo.tv/" })
                )}`}`}
                alt="image"
                width={500}
                height={500}
                className="w-full h-full"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps({ params }: any) {
  const { id } = params;

  const [mangaId, chapterId] = id;

  const API = process.env.ID_API;

  return {
    props: {
      mangaId,
      chapterId,
      API,
    },
  };
}
