import Image from "next/image";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

const g = [
  {
    name: "Action",
    img: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx20958-HuFJyr54Mmir.jpg",
  },
  {
    name: "Comedy",
    img: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx21202-TfzXuWQf2oLQ.png",
  },
  {
    name: "Horror",
    img: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx127230-FlochcFsyoF4.png",
  },
  {
    name: "Romance",
    img: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx124080-h8EPH92nyRfS.jpg",
  },
  {
    name: "Music",
    img: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx130003-5Y8rYzg982sq.png",
  },
  {
    name: "Sports",
    img: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx20464-eW7ZDBOcn74a.png",
  },
];

export default function Genres() {
  return (
    <div className="antialiased">
      <div className="flex items-center justify-between lg:justify-normal lg:gap-3 px-5">
        <h1 className="font-karla text-[20px] font-bold">Top Genres</h1>
        <ChevronRightIcon className="w-5 h-5" />
      </div>
      <div className="flex xl:justify-center items-center relative">
        <div className="bg-gradient-to-r from-primary to-transparent z-40 absolute w-7 h-[300px] left-0" />
        <div className="flex lg:gap-8 gap-3 lg:p-10 py-8 px-5 z-30 overflow-y-hidden overflow-x-scroll snap-x snap-proximity scrollbar-none relative">
          <div className="flex lg:gap-10 gap-3">
            {g.map((a, index) => (
              <Link
                href={`/search/anime/?genres=${a.name}`}
                key={index}
                className="relative hover:shadow-lg hover:scale-105 duration-200 cursor-pointer ease-out h-[190px] w-[135px] lg:h-[265px] lg:w-[230px] rounded-md shrink-0"
              >
                <div className="bg-gradient-to-b from-transparent to-[#0c0d10] h-[190px] w-[135px] lg:h-[265px] lg:w-[230px] rounded-md absolute flex justify-center items-end">
                  <h1 className="pb-7 lg:text-xl font-karla font-semibold">
                    {a.name}
                  </h1>
                </div>
                <Image
                  src={a.img}
                  alt="genres images"
                  width={1000}
                  height={1000}
                  className="object-cover shrink-0 h-[190px] w-[135px] lg:h-[265px] lg:w-[230px] rounded-md"
                />
              </Link>
            ))}
          </div>
        </div>
        <div className="bg-gradient-to-l from-primary to-transparent z-40 absolute w-7 h-[300px] right-0" />
      </div>
    </div>
  );
}
