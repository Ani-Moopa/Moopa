import Image from "next/image";
import { Fragment, useEffect, useState } from "react";
import {
  CheckIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { Combobox, Transition } from "@headlessui/react";
import pls from "@/utils/request";

const types = [
  {
    name: "Novel",
    value: "novel",
  },
  {
    name: "Manga",
    value: "manga",
  },
];

type DataType = {
  id: string;
  title: string;
  img: string;
  synonym?: string;
  status?: string;
  genres?: string;
  release?: string;
};

export async function getServerSideProps() {
  const API = process.env.ID_API;
  return {
    props: {
      API,
    },
  };
}

export default function Search({ API }: { API: string }) {
  const [data, setData] = useState<DataType[] | null>([]);
  const [query, setQuery] = useState("a");

  const [type, setType] = useState(types[0]);

  const handleQuery = async (e: any) => {
    e.preventDefault();
    setData([]);

    try {
      const data = await pls.get(`${API}/api/${type.value}/search/${query}`);
      setData(data);
    } catch (error) {
      setData(null);
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await pls.get(`${API}/api/${type.value}/search/${query}`);
        setData(data);
      } catch (error) {
        setData(null);
      }
    }
    fetchData();
    return () => {
      setData(null);
    };
  }, [type?.value]);

  useEffect(() => {
    // run handleQuery when pressing enter
    const handleEnter = (e: any) => {
      if (e.key === "Enter") {
        handleQuery(e);
      }
    };
    window.addEventListener("keydown", handleEnter);

    return () => {
      window.removeEventListener("keydown", handleEnter);
    };
  }, [query, type?.value]);

  const handleChange = (e: any) => {
    setType(e);
    setData(null);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-screen-lg px-5">
        <div className="flex justify-between mt-16">
          <div className="flex-1 max-w-[20%] items-center justify-end text-lg relative">
            <Combobox value={type} onChange={(e) => handleChange(e)}>
              <Combobox.Button className="h-full w-full gap-5 py-[2px] bg-secondary/70 rounded text-sm font-karla flex items-center justify-between px-2">
                {type.name}
                <ChevronDownIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </Combobox.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="transform opacity-0 scale-95 translate-y-5"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95 translate-y-5"
                afterLeave={() => setQuery("")}
              >
                <Combobox.Options
                  className="absolute z-[55] mt-1 max-h-60 w-full rounded-md bg-secondary py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
                  style={{ scrollbarGutter: "stable" }}
                >
                  {types.length === 0 && query !== "" ? (
                    <div className="relative cursor-default select-none py-2 px-4 text-gray-300">
                      Nothing found.
                    </div>
                  ) : (
                    types.map((item) => (
                      <Combobox.Option
                        key={item.value}
                        className={({ active }) =>
                          `relative cursor-pointer select-none py-2 px-2 mx-2 rounded-md ${
                            active ? "bg-white/5 text-white" : "text-gray-300"
                          }`
                        }
                        value={item}
                      >
                        {({ selected, active }) => (
                          <Fragment>
                            <span
                              className={`block truncate ${
                                selected
                                  ? "font-medium text-white"
                                  : "font-normal"
                              }`}
                            >
                              {item.name}
                            </span>
                            {selected ? (
                              <span
                                className={`absolute inset-y-0 right-0 flex items-center pl-3 pr-1 ${
                                  active ? "text-white" : "text-action"
                                }`}
                              >
                                <CheckIcon
                                  className="h-5 w-5"
                                  aria-hidden="true"
                                />
                              </span>
                            ) : null}
                          </Fragment>
                        )}
                      </Combobox.Option>
                    ))
                  )}
                </Combobox.Options>
              </Transition>
            </Combobox>
          </div>
          <form
            onSubmit={handleQuery}
            className="flex items-center justify-end relative space-x-2"
          >
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="bg-secondary h-10 px-5 pr-16 rounded-lg text-sm focus:outline-none"
            />
            <button type="submit" className="text-white">
              <MagnifyingGlassIcon className="h-6 w-6 text-white" />
            </button>
          </form>
        </div>
        <div className="mt-5 grid xxs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-6 gap-5 gap-y-5">
          {data !== null
            ? data?.map((x, index) => (
                <div key={x.id + index} className="flex flex-col gap-2">
                  <Link
                    href={`/id/${type.value}/${x.id}`}
                    className="block relative overflow-hidden bg-secondary hover:scale-[1.03] scale-100 transition-all cursor-pointer duration-200 ease-out rounded"
                    style={{
                      paddingTop: "145%", // 2:3 aspect ratio (3/2 * 100%)
                    }}
                  >
                    {x.img && (
                      <Image
                        src={`https://aoi.moopa.live/utils/image-proxy?url=${encodeURIComponent(
                          x.img
                        )}${`&headers=${encodeURIComponent(
                          JSON.stringify({ Referer: "https://komikindo.tv/" })
                        )}`}`}
                        alt={x.title}
                        sizes="(min-width: 808px) 50vw, 100vw"
                        quality={100}
                        fill
                        className="object-cover"
                      />
                    )}
                  </Link>
                  <div>
                    <h1 className="line-clamp-2 font-karla font-bold">
                      {x.title}
                    </h1>
                  </div>
                </div>
              ))
            : "No results found"}
        </div>
      </div>
    </div>
  );
}
